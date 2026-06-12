#include "plc_runtime.h"

#include <string.h>

#include "archive_io.h"
#include "esp_log.h"
#include "nvs.h"
#include "nvs_flash.h"

static const char *TAG = "archive_plc";
static const char *NVS_NAMESPACE = "archive_plc";
static const char *NVS_KEY_RETAIN = "retain";

static void set_safe_outputs(archive_runtime_t *runtime)
{
    runtime->outputs.drive_run_cmd = false;
    runtime->outputs.alarm_light = false;
    runtime->outputs.run_light = false;
}

static esp_err_t load_retain(archive_retain_t *retain)
{
    nvs_handle_t handle;
    esp_err_t err = nvs_open(NVS_NAMESPACE, NVS_READONLY, &handle);

    if (err != ESP_OK) {
        retain->main_seq_step = PLC_STEP_STOPPED;
        retain->trip_latched = false;
        retain->starts = 0;
        return err;
    }

    size_t required_size = sizeof(*retain);
    err = nvs_get_blob(handle, NVS_KEY_RETAIN, retain, &required_size);
    nvs_close(handle);

    if (err != ESP_OK || required_size != sizeof(*retain)) {
        retain->main_seq_step = PLC_STEP_STOPPED;
        retain->trip_latched = false;
        retain->starts = 0;
        return err;
    }

    return ESP_OK;
}

esp_err_t plc_runtime_save_retain(const archive_runtime_t *runtime)
{
    nvs_handle_t handle;
    esp_err_t err = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &handle);

    if (err != ESP_OK) {
        return err;
    }

    err = nvs_set_blob(handle, NVS_KEY_RETAIN, &runtime->retain, sizeof(runtime->retain));
    if (err == ESP_OK) {
        err = nvs_commit(handle);
    }

    nvs_close(handle);
    return err;
}

esp_err_t plc_runtime_init(archive_runtime_t *runtime)
{
    if (runtime == NULL) {
        return ESP_ERR_INVALID_ARG;
    }

    memset(runtime, 0, sizeof(*runtime));
    set_safe_outputs(runtime);

    runtime->io_config.analog_min_raw = 0.0f;
    runtime->io_config.analog_max_raw = 4095.0f;
    runtime->io_config.analog_min_eng = 0.0f;
    runtime->io_config.analog_max_eng = 100.0f;

    esp_err_t err = load_retain(&runtime->retain);

    if (runtime->retain.main_seq_step == PLC_STEP_RUNNING ||
        runtime->retain.main_seq_step == PLC_STEP_STARTING) {
        runtime->retain.main_seq_step = PLC_STEP_STOPPED;
        runtime->retain.trip_latched = true;
        plc_runtime_save_retain(runtime);
    }

    if (err != ESP_OK) {
        ESP_LOGW(TAG, "Retain load defaulted: %s", esp_err_to_name(err));
    }

    return ESP_OK;
}

void plc_runtime_scan(archive_runtime_t *runtime, const archive_inputs_t *inputs)
{
    if (runtime == NULL || inputs == NULL) {
        return;
    }

    runtime->start_pulse = inputs->start_pb && !runtime->start_prev;
    runtime->stop_pulse = inputs->stop_pb && !runtime->stop_prev;
    runtime->reset_pulse = inputs->reset_pb && !runtime->reset_prev;

    runtime->start_prev = inputs->start_pb;
    runtime->stop_prev = inputs->stop_pb;
    runtime->reset_prev = inputs->reset_pb;

    runtime->process_value = archive_io_scale_analog(inputs->adc_raw, &runtime->io_config);

    runtime->active_trip =
        !inputs->estop_ok ||
        !inputs->drive_ready ||
        inputs->drive_fault;

    if (runtime->active_trip) {
        runtime->retain.trip_latched = true;
        runtime->retain.main_seq_step = PLC_STEP_FAULTED;
    }

    if (runtime->reset_pulse && !runtime->active_trip) {
        runtime->retain.trip_latched = false;
        if (runtime->retain.main_seq_step == PLC_STEP_FAULTED) {
            runtime->retain.main_seq_step = PLC_STEP_STOPPED;
        }
        plc_runtime_save_retain(runtime);
    }

    runtime->permissive_ok =
        inputs->estop_ok &&
        inputs->drive_ready &&
        !inputs->drive_fault &&
        !runtime->retain.trip_latched;

    switch ((plc_step_t)runtime->retain.main_seq_step) {
    case PLC_STEP_STOPPED:
        set_safe_outputs(runtime);

        if (runtime->start_pulse && runtime->permissive_ok) {
            runtime->retain.main_seq_step = PLC_STEP_PRECHECK;
            plc_runtime_save_retain(runtime);
        }
        break;

    case PLC_STEP_PRECHECK:
        set_safe_outputs(runtime);

        if (!runtime->permissive_ok) {
            runtime->retain.main_seq_step = PLC_STEP_FAULTED;
            plc_runtime_save_retain(runtime);
        } else {
            runtime->retain.main_seq_step = PLC_STEP_STARTING;
            plc_runtime_save_retain(runtime);
        }
        break;

    case PLC_STEP_STARTING:
        runtime->outputs.drive_run_cmd = runtime->permissive_ok && !runtime->stop_pulse;
        runtime->outputs.run_light = runtime->outputs.drive_run_cmd;
        runtime->outputs.alarm_light = false;

        if (inputs->drive_running) {
            runtime->retain.starts++;
            runtime->retain.main_seq_step = PLC_STEP_RUNNING;
            plc_runtime_save_retain(runtime);
        } else if (!runtime->outputs.drive_run_cmd) {
            runtime->retain.main_seq_step = PLC_STEP_STOPPED;
            plc_runtime_save_retain(runtime);
        }
        break;

    case PLC_STEP_RUNNING:
        runtime->outputs.drive_run_cmd = runtime->permissive_ok && !runtime->stop_pulse;
        runtime->outputs.run_light = runtime->outputs.drive_run_cmd;
        runtime->outputs.alarm_light = false;

        if (!runtime->outputs.drive_run_cmd) {
            runtime->retain.main_seq_step = PLC_STEP_STOPPING;
            plc_runtime_save_retain(runtime);
        }
        break;

    case PLC_STEP_STOPPING:
        set_safe_outputs(runtime);

        if (!inputs->drive_running) {
            runtime->retain.main_seq_step = PLC_STEP_STOPPED;
            plc_runtime_save_retain(runtime);
        }
        break;

    case PLC_STEP_FAULTED:
        set_safe_outputs(runtime);
        runtime->outputs.alarm_light = true;
        break;

    default:
        set_safe_outputs(runtime);
        runtime->retain.trip_latched = true;
        runtime->retain.main_seq_step = PLC_STEP_FAULTED;
        plc_runtime_save_retain(runtime);
        break;
    }
}
