#include "mqtt_client_app.h"

#include "archive_config.h"
#include "esp_log.h"
#include "mqtt_client.h"

static const char *TAG = "archive_mqtt";
static esp_mqtt_client_handle_t client;
static bool connected;

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    (void)handler_args;
    (void)base;
    esp_mqtt_event_handle_t event = event_data;

    if (event_id == MQTT_EVENT_CONNECTED) {
        connected = true;
        esp_mqtt_client_subscribe(client, ARCHIVE_MQTT_TOPIC_COMMAND, 1);
    } else if (event_id == MQTT_EVENT_DISCONNECTED) {
        connected = false;
    }
}

esp_err_t archive_mqtt_start(const archive_mqtt_config_t *config)
{
    if (config == NULL || config->broker_uri == NULL) {
        return ESP_ERR_INVALID_ARG;
    }

    esp_mqtt_client_config_t mqtt_config = {
        .broker.address.uri = config->broker_uri,
        .credentials.client_id = config->client_id,
    };

    client = esp_mqtt_client_init(&mqtt_config);
    if (client == NULL) {
        return ESP_FAIL;
    }

    ESP_ERROR_CHECK(esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL));
    ESP_LOGI(TAG, "Starting MQTT client");
    return esp_mqtt_client_start(client);
}

bool archive_mqtt_is_connected(void)
{
    return connected;
}

void archive_mqtt_publish_status(const char *json_status)
{
    if (connected && json_status != NULL) {
        esp_mqtt_client_publish(client, ARCHIVE_MQTT_TOPIC_STATUS, json_status, 0, 1, 0);
    }
}

void archive_mqtt_publish_alarm(const char *json_alarm)
{
    if (connected && json_alarm != NULL) {
        esp_mqtt_client_publish(client, ARCHIVE_MQTT_TOPIC_ALARM, json_alarm, 0, 1, 0);
    }
}
