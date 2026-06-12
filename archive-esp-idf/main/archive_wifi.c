#include "archive_wifi.h"

#include <string.h>

#include "archive_config.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"
#include "esp_wifi.h"

static const char *TAG = "archive_wifi";
static bool wifi_connected;
static archive_wifi_mode_t active_mode;

static void wifi_event_handler(void *arg, esp_event_base_t base, int32_t id, void *data)
{
    (void)arg;
    (void)data;

    if (base == WIFI_EVENT && id == WIFI_EVENT_STA_DISCONNECTED) {
        wifi_connected = false;
        ESP_LOGW(TAG, "Wi-Fi disconnected");
    } else if (base == IP_EVENT && id == IP_EVENT_STA_GOT_IP) {
        wifi_connected = true;
        ESP_LOGI(TAG, "Wi-Fi connected");
    }
}

esp_err_t archive_wifi_init(const archive_wifi_config_t *config)
{
    if (config == NULL || config->mode == ARCHIVE_WIFI_MODE_DISABLED) {
        active_mode = ARCHIVE_WIFI_MODE_DISABLED;
        return ESP_OK;
    }

    active_mode = config->mode;
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    if (config->mode == ARCHIVE_WIFI_MODE_STA || config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        esp_netif_create_default_wifi_sta();
    }

    if (config->mode == ARCHIVE_WIFI_MODE_SOFTAP || config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        esp_netif_create_default_wifi_ap();
    }

    wifi_init_config_t init_config = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&init_config));
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL));

    if (config->mode == ARCHIVE_WIFI_MODE_STA || config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        wifi_config_t sta_config = {0};
        strlcpy((char *)sta_config.sta.ssid, config->ssid, sizeof(sta_config.sta.ssid));
        strlcpy((char *)sta_config.sta.password, config->password, sizeof(sta_config.sta.password));
        sta_config.sta.threshold.authmode = WIFI_AUTH_WPA2_PSK;
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &sta_config));
    }

    if (config->mode == ARCHIVE_WIFI_MODE_SOFTAP || config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        wifi_config_t ap_config = {0};
        strlcpy((char *)ap_config.ap.ssid, config->softap_ssid, sizeof(ap_config.ap.ssid));
        strlcpy((char *)ap_config.ap.password, config->softap_password, sizeof(ap_config.ap.password));
        ap_config.ap.max_connection = 4;
        ap_config.ap.authmode = strlen(config->softap_password) == 0 ? WIFI_AUTH_OPEN : WIFI_AUTH_WPA2_PSK;
        ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &ap_config));
    }

    wifi_mode_t mode = WIFI_MODE_NULL;
    if (config->mode == ARCHIVE_WIFI_MODE_STA) {
        mode = WIFI_MODE_STA;
    } else if (config->mode == ARCHIVE_WIFI_MODE_SOFTAP) {
        mode = WIFI_MODE_AP;
    } else if (config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        mode = WIFI_MODE_APSTA;
    }

    ESP_ERROR_CHECK(esp_wifi_set_mode(mode));
    ESP_ERROR_CHECK(esp_wifi_start());

    if (config->mode == ARCHIVE_WIFI_MODE_STA || config->mode == ARCHIVE_WIFI_MODE_APSTA) {
        ESP_ERROR_CHECK(esp_wifi_connect());
    }

    return ESP_OK;
}

bool archive_wifi_is_connected(void)
{
    return wifi_connected || active_mode == ARCHIVE_WIFI_MODE_SOFTAP;
}

bool archive_wifi_command_source_healthy(void)
{
    return active_mode == ARCHIVE_WIFI_MODE_DISABLED || archive_wifi_is_connected();
}
