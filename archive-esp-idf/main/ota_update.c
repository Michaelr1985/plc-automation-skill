#include "ota_update.h"

#include "esp_https_ota.h"
#include "esp_log.h"

static const char *TAG = "archive_ota";

esp_err_t archive_ota_start(const char *firmware_url)
{
    if (firmware_url == NULL) {
        return ESP_ERR_INVALID_ARG;
    }

    ESP_LOGW(TAG, "Ensure process outputs are safe before OTA starts");
    esp_http_client_config_t http_config = {
        .url = firmware_url,
    };
    esp_https_ota_config_t ota_config = {
        .http_config = &http_config,
    };

    return esp_https_ota(&ota_config);
}
