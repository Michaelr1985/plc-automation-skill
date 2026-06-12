#include "test_harness.h"

#include <string.h>

void archive_test_reset(archive_test_t *test)
{
    if (test == NULL) {
        return;
    }
    memset(test, 0, sizeof(*test));
}

void archive_test_run_step(archive_test_t *test, archive_runtime_t *runtime, archive_inputs_t *inputs)
{
    if (test == NULL || runtime == NULL || inputs == NULL || !test->enable || test->done || test->failed) {
        return;
    }

    test->running = true;

    switch (test->step) {
    case 0:
        inputs->estop_ok = true;
        inputs->drive_ready = true;
        inputs->drive_fault = false;
        inputs->start_pb = false;
        inputs->stop_pb = false;
        inputs->reset_pb = false;
        test->step = 10;
        break;

    case 10:
        inputs->start_pb = true;
        plc_runtime_scan(runtime, inputs);
        inputs->start_pb = false;
        test->step = 20;
        break;

    case 20:
        plc_runtime_scan(runtime, inputs);
        if (!runtime->outputs.drive_run_cmd) {
            test->failed = true;
            test->failure_code = 20;
        } else {
            inputs->drive_running = true;
            test->step = 30;
        }
        break;

    case 30:
        inputs->drive_fault = true;
        plc_runtime_scan(runtime, inputs);
        if (runtime->outputs.drive_run_cmd) {
            test->failed = true;
            test->failure_code = 30;
        } else {
            test->passed = true;
            test->done = true;
            test->running = false;
        }
        break;

    default:
        test->failed = true;
        test->failure_code = 900;
        break;
    }
}
