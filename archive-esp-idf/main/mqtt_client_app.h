#pragma once

#include <stdbool.h>
#include "esp_err.h"

typedef struct {
    const char *broker_uri;
    const char *client_id;
} archive_mqtt_config_t;

esp_err_t archive_mqtt_start(const archive_mqtt_config_t *config);
bool archive_mqtt_is_connected(void);
void archive_mqtt_publish_status(const char *json_status);
void archive_mqtt_publish_alarm(const char *json_alarm);
