#include "unity.h"

#include <stdbool.h>
#include <string.h>

#include "archive_io.h"
#include "esp_err.h"
#include "nvs_flash.h"
#include "plc_runtime.h"

static archive_inputs_t default_inputs(void)
{
    archive_inputs_t inputs;
    memset(&inputs, 0, sizeof(inputs));
    inputs.estop_ok = true;
    inputs.drive_ready = true;
    inputs.drive_fault = false;
    inputs.drive_running = false;
    inputs.adc_raw = 0;
    return inputs;
}

static archive_runtime_t runtime_init_clean(void)
{
    archive_runtime_t runtime;
    esp_err_t err = nvs_flash_erase();
    TEST_ASSERT_TRUE(err == ESP_OK || err == ESP_ERR_NVS_NOT_INITIALIZED);
    TEST_ESP_OK(nvs_flash_init());
    TEST_ESP_OK(plc_runtime_init(&runtime));
    return runtime;
}

static void scan_start_to_running(archive_runtime_t *runtime, archive_inputs_t *inputs)
{
    inputs->start_pb = true;
    plc_runtime_scan(runtime, inputs);
    inputs->start_pb = false;
    plc_runtime_scan(runtime, inputs);
    plc_runtime_scan(runtime, inputs);
    TEST_ASSERT_TRUE(runtime->outputs.drive_run_cmd);
    inputs->drive_running = true;
    plc_runtime_scan(runtime, inputs);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_RUNNING, runtime->retain.main_seq_step);
}

static void test_archive_runtime_boots_stopped_with_safe_outputs(void)
{
    archive_runtime_t runtime = runtime_init_clean();

    TEST_ASSERT_EQUAL_INT32(PLC_STEP_STOPPED, runtime.retain.main_seq_step);
    TEST_ASSERT_FALSE(runtime.retain.trip_latched);
    TEST_ASSERT_FALSE(runtime.outputs.drive_run_cmd);
    TEST_ASSERT_FALSE(runtime.outputs.run_light);
    TEST_ASSERT_FALSE(runtime.outputs.alarm_light);
}

static void test_archive_runtime_starts_commands_drive_and_stops_safely(void)
{
    archive_runtime_t runtime = runtime_init_clean();
    archive_inputs_t inputs = default_inputs();

    scan_start_to_running(&runtime, &inputs);
    TEST_ASSERT_TRUE(runtime.outputs.drive_run_cmd);
    TEST_ASSERT_EQUAL_UINT32(1, runtime.retain.starts);

    inputs.stop_pb = true;
    plc_runtime_scan(&runtime, &inputs);
    inputs.stop_pb = false;
    TEST_ASSERT_FALSE(runtime.outputs.drive_run_cmd);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_STOPPING, runtime.retain.main_seq_step);

    inputs.drive_running = false;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_STOPPED, runtime.retain.main_seq_step);
    TEST_ASSERT_FALSE(runtime.outputs.drive_run_cmd);
}

static void test_archive_runtime_latches_drive_fault_and_reset_does_not_restart(void)
{
    archive_runtime_t runtime = runtime_init_clean();
    archive_inputs_t inputs = default_inputs();

    scan_start_to_running(&runtime, &inputs);

    inputs.drive_fault = true;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_TRUE(runtime.retain.trip_latched);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_FAULTED, runtime.retain.main_seq_step);
    TEST_ASSERT_FALSE(runtime.outputs.drive_run_cmd);
    TEST_ASSERT_TRUE(runtime.outputs.alarm_light);

    inputs.reset_pb = true;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_TRUE(runtime.retain.trip_latched);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_FAULTED, runtime.retain.main_seq_step);

    inputs.drive_fault = false;
    inputs.reset_pb = false;
    plc_runtime_scan(&runtime, &inputs);
    inputs.reset_pb = true;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_FALSE(runtime.retain.trip_latched);
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_STOPPED, runtime.retain.main_seq_step);
    TEST_ASSERT_FALSE(runtime.outputs.drive_run_cmd);
}

static void test_archive_runtime_power_recovery_from_running_requires_acknowledgement(void)
{
    archive_runtime_t runtime = runtime_init_clean();
    runtime.retain.main_seq_step = PLC_STEP_RUNNING;
    runtime.retain.trip_latched = false;
    runtime.retain.starts = 7;
    TEST_ESP_OK(plc_runtime_save_retain(&runtime));

    archive_runtime_t recovered;
    TEST_ESP_OK(plc_runtime_init(&recovered));
    TEST_ASSERT_EQUAL_INT32(PLC_STEP_STOPPED, recovered.retain.main_seq_step);
    TEST_ASSERT_TRUE(recovered.retain.trip_latched);
    TEST_ASSERT_FALSE(recovered.outputs.drive_run_cmd);
}

static void test_archive_runtime_scales_analog_input_to_engineering_units(void)
{
    archive_runtime_t runtime = runtime_init_clean();
    archive_inputs_t inputs = default_inputs();

    inputs.adc_raw = 0;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 0.0f, runtime.process_value);

    inputs.adc_raw = 2048;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_FLOAT_WITHIN(0.1f, 50.01f, runtime.process_value);

    inputs.adc_raw = 4095;
    plc_runtime_scan(&runtime, &inputs);
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 100.0f, runtime.process_value);
}

void app_main(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_archive_runtime_boots_stopped_with_safe_outputs);
    RUN_TEST(test_archive_runtime_starts_commands_drive_and_stops_safely);
    RUN_TEST(test_archive_runtime_latches_drive_fault_and_reset_does_not_restart);
    RUN_TEST(test_archive_runtime_power_recovery_from_running_requires_acknowledgement);
    RUN_TEST(test_archive_runtime_scales_analog_input_to_engineering_units);
    (void)UNITY_END();
}
