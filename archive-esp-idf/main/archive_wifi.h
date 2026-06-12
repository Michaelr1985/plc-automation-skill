#pragma once

#include <stdbool.h>
#include "esp_err.h"

typedef enum {
    ARCHIVE_WIFI_MODE_DISABLED = 0,
    ARCHIVE_WIFI_MODE_STA,
    ARCHIVE_WIFI_MODE_SOFTAP,
    ARCHIVE_WIFI_MODE_APSTA,
    ARCHIVE_WIFI_MODE_ESPNOW
} archive_wifi_mode_t;

typedef struct {
    archive_wifi_mode_t mode;
    char ssid[32];
    char password[64];
    char softap_ssid[32];
    char softap_password[64];
} archive_wifi_config_t;

esp_err_t archive_wifi_init(const archive_wifi_config_t *config);
bool archive_wifi_is_connected(void);
bool archive_wifi_command_source_healthy(void);
