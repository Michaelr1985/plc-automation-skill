#pragma once

#include <stdbool.h>
#include <stdint.h>

#include "archive_io.h"
#include "plc_runtime.h"

typedef struct {
    bool enable;
    bool running;
    bool done;
    bool passed;
    bool failed;
    int32_t step;
    int32_t failure_code;
} archive_test_t;

void archive_test_reset(archive_test_t *test);
void archive_test_run_step(archive_test_t *test, archive_runtime_t *runtime, archive_inputs_t *inputs);
