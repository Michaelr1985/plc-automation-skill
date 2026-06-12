#pragma once

#include <stdbool.h>
#include "esp_err.h"

typedef enum {
    ARCHIVE_BLE_STACK_NIMBLE = 0,
    ARCHIVE_BLE_STACK_BLUEDROID
} archive_ble_stack_t;

typedef struct {
    archive_ble_stack_t stack;
    bool enable_gatt_server;
    bool enable_provisioning;
    bool enable_mesh;
} archive_ble_config_t;

esp_err_t archive_ble_init(const archive_ble_config_t *config);
bool archive_ble_command_source_healthy(void);
