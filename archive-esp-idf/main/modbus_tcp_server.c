#include "modbus_tcp_server.h"

#include "esp_log.h"

static const char *TAG = "archive_modbus";

esp_err_t archive_modbus_tcp_start(void)
{
    ESP_LOGW(TAG, "Modbus TCP register map is project-specific. Implement using ESP-IDF supported Modbus component or TCP sockets.");
    return ESP_OK;
}

void archive_modbus_tcp_stop(void)
{
    ESP_LOGI(TAG, "Modbus TCP stop requested");
}
