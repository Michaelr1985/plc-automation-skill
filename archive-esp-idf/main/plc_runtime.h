#pragma once

#include <stdbool.h>
#include <stdint.h>

#include "archive_io.h"
#include "esp_err.h"

#define ARCHIVE_PLC_SCAN_MS 50

typedef enum {
    PLC_STEP_STOPPED = 0,
    PLC_STEP_PRECHECK = 10,
    PLC_STEP_STARTING = 20,
    PLC_STEP_RUNNING = 30,
    PLC_STEP_STOPPING = 40,
    PLC_STEP_FAULTED = 90
} plc_step_t;

typedef struct {
    int32_t main_seq_step;
    bool trip_latched;
    uint32_t starts;
} archive_retain_t;

typedef struct {
    bool start_prev;
    bool stop_prev;
    bool reset_prev;
    bool start_pulse;
    bool stop_pulse;
    bool reset_pulse;
    bool permissive_ok;
    bool active_trip;
    float process_value;
    archive_retain_t retain;
    archive_outputs_t outputs;
    archive_io_config_t io_config;
} archive_runtime_t;

esp_err_t plc_runtime_init(archive_runtime_t *runtime);
void plc_runtime_scan(archive_runtime_t *runtime, const archive_inputs_t *inputs);
esp_err_t plc_runtime_save_retain(const archive_runtime_t *runtime);
