#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef struct {
    bool estop_ok;
    bool start_pb;
    bool stop_pb;
    bool reset_pb;
    bool drive_ready;
    bool drive_running;
    bool drive_fault;
    int adc_raw;
} archive_inputs_t;

typedef struct {
    bool drive_run_cmd;
    bool alarm_light;
    bool run_light;
} archive_outputs_t;

typedef struct {
    float analog_min_raw;
    float analog_max_raw;
    float analog_min_eng;
    float analog_max_eng;
} archive_io_config_t;

void archive_io_init_safe(void);
void archive_io_read(archive_inputs_t *inputs);
void archive_io_write(const archive_outputs_t *outputs);
void archive_io_write_safe(void);
float archive_io_scale_analog(int raw, const archive_io_config_t *config);
