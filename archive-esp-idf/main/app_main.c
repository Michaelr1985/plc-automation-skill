#include "archive_io.h"
#include "plc_runtime.h"

#include "esp_log.h"
#include "esp_task_wdt.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"

static const char *TAG = "archive_app";

static archive_runtime_t runtime;

static void plc_scan_task(void *arg)
{
    (void)arg;

    archive_inputs_t inputs = {0};
    TickType_t last_wake = xTaskGetTickCount();
    const TickType_t scan_ticks = pdMS_TO_TICKS(ARCHIVE_PLC_SCAN_MS);

    esp_task_wdt_add(NULL);

    while (true) {
        archive_io_read(&inputs);
        plc_runtime_scan(&runtime, &inputs);
        archive_io_write(&runtime.outputs);
        esp_task_wdt_reset();
        vTaskDelayUntil(&last_wake, scan_ticks);
    }
}

void app_main(void)
{
    esp_err_t err = nvs_flash_init();
    if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        err = nvs_flash_init();
    }
    ESP_ERROR_CHECK(err);

    archive_io_init_safe();
    ESP_ERROR_CHECK(plc_runtime_init(&runtime));

    ESP_LOGI(TAG, "Archive PLC runtime starting, scan=%d ms", ARCHIVE_PLC_SCAN_MS);

    xTaskCreate(
        plc_scan_task,
        "plc_scan_task",
        4096,
        NULL,
        10,
        NULL);
}
