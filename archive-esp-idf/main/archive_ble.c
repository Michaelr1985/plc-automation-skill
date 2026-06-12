#include "archive_ble.h"

#include "esp_log.h"

static const char *TAG = "archive_ble";
static bool ble_enabled;

esp_err_t archive_ble_init(const archive_ble_config_t *config)
{
    if (config == NULL) {
        ble_enabled = false;
        return ESP_OK;
    }

    ble_enabled = config->enable_gatt_server || config->enable_provisioning || config->enable_mesh;

    if (!ble_enabled) {
        return ESP_OK;
    }

    if (config->stack == ARCHIVE_BLE_STACK_NIMBLE) {
        ESP_LOGI(TAG, "BLE requested with NimBLE stack. Add project-specific GATT services here.");
    } else {
        ESP_LOGI(TAG, "BLE requested with Bluedroid stack. Use only when Classic Bluetooth is required.");
    }

    return ESP_OK;
}

bool archive_ble_command_source_healthy(void)
{
    return true;
}
