#include "http_server_app.h"

#include "esp_http_server.h"
#include "esp_log.h"

static const char *TAG = "archive_http";
static httpd_handle_t server;

static esp_err_t health_handler(httpd_req_t *req)
{
    const char *body = "{\"healthy\":true}";
    httpd_resp_set_type(req, "application/json");
    return httpd_resp_send(req, body, HTTPD_RESP_USE_STRLEN);
}

esp_err_t archive_http_server_start(void)
{
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    esp_err_t err = httpd_start(&server, &config);
    if (err != ESP_OK) {
        return err;
    }

    httpd_uri_t health = {
        .uri = "/health",
        .method = HTTP_GET,
        .handler = health_handler,
    };
    ESP_LOGI(TAG, "HTTP server started");
    return httpd_register_uri_handler(server, &health);
}

void archive_http_server_stop(void)
{
    if (server != NULL) {
        httpd_stop(server);
        server = NULL;
    }
}
