#include "archive_io.h"

#include "driver/adc.h"
#include "driver/gpio.h"

#define ARCHIVE_GPIO_ESTOP_OK      GPIO_NUM_18
#define ARCHIVE_GPIO_START_PB      GPIO_NUM_19
#define ARCHIVE_GPIO_STOP_PB       GPIO_NUM_21
#define ARCHIVE_GPIO_RESET_PB      GPIO_NUM_22
#define ARCHIVE_GPIO_DRIVE_READY   GPIO_NUM_23
#define ARCHIVE_GPIO_DRIVE_RUN_FB  GPIO_NUM_25
#define ARCHIVE_GPIO_DRIVE_FAULT   GPIO_NUM_26

#define ARCHIVE_GPIO_DRIVE_RUN_CMD GPIO_NUM_27
#define ARCHIVE_GPIO_ALARM_LIGHT   GPIO_NUM_32
#define ARCHIVE_GPIO_RUN_LIGHT     GPIO_NUM_33

#define ARCHIVE_ADC_CHANNEL        ADC1_CHANNEL_6

static bool read_input(gpio_num_t gpio)
{
    return gpio_get_level(gpio) != 0;
}

void archive_io_init_safe(void)
{
    gpio_config_t input_config = {
        .pin_bit_mask =
            (1ULL << ARCHIVE_GPIO_ESTOP_OK) |
            (1ULL << ARCHIVE_GPIO_START_PB) |
            (1ULL << ARCHIVE_GPIO_STOP_PB) |
            (1ULL << ARCHIVE_GPIO_RESET_PB) |
            (1ULL << ARCHIVE_GPIO_DRIVE_READY) |
            (1ULL << ARCHIVE_GPIO_DRIVE_RUN_FB) |
            (1ULL << ARCHIVE_GPIO_DRIVE_FAULT),
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };

    gpio_config_t output_config = {
        .pin_bit_mask =
            (1ULL << ARCHIVE_GPIO_DRIVE_RUN_CMD) |
            (1ULL << ARCHIVE_GPIO_ALARM_LIGHT) |
            (1ULL << ARCHIVE_GPIO_RUN_LIGHT),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };

    gpio_config(&input_config);
    gpio_config(&output_config);

    adc1_config_width(ADC_WIDTH_BIT_12);
    adc1_config_channel_atten(ARCHIVE_ADC_CHANNEL, ADC_ATTEN_DB_11);

    archive_io_write_safe();
}

void archive_io_read(archive_inputs_t *inputs)
{
    if (inputs == NULL) {
        return;
    }

    inputs->estop_ok = read_input(ARCHIVE_GPIO_ESTOP_OK);
    inputs->start_pb = read_input(ARCHIVE_GPIO_START_PB);
    inputs->stop_pb = read_input(ARCHIVE_GPIO_STOP_PB);
    inputs->reset_pb = read_input(ARCHIVE_GPIO_RESET_PB);
    inputs->drive_ready = read_input(ARCHIVE_GPIO_DRIVE_READY);
    inputs->drive_running = read_input(ARCHIVE_GPIO_DRIVE_RUN_FB);
    inputs->drive_fault = read_input(ARCHIVE_GPIO_DRIVE_FAULT);
    inputs->adc_raw = adc1_get_raw(ARCHIVE_ADC_CHANNEL);
}

void archive_io_write(const archive_outputs_t *outputs)
{
    if (outputs == NULL) {
        archive_io_write_safe();
        return;
    }

    gpio_set_level(ARCHIVE_GPIO_DRIVE_RUN_CMD, outputs->drive_run_cmd ? 1 : 0);
    gpio_set_level(ARCHIVE_GPIO_ALARM_LIGHT, outputs->alarm_light ? 1 : 0);
    gpio_set_level(ARCHIVE_GPIO_RUN_LIGHT, outputs->run_light ? 1 : 0);
}

void archive_io_write_safe(void)
{
    gpio_set_level(ARCHIVE_GPIO_DRIVE_RUN_CMD, 0);
    gpio_set_level(ARCHIVE_GPIO_ALARM_LIGHT, 0);
    gpio_set_level(ARCHIVE_GPIO_RUN_LIGHT, 0);
}

float archive_io_scale_analog(int raw, const archive_io_config_t *config)
{
    if (config == NULL || config->analog_max_raw <= config->analog_min_raw) {
        return 0.0f;
    }

    float normalized = ((float)raw - config->analog_min_raw) /
        (config->analog_max_raw - config->analog_min_raw);

    if (normalized < 0.0f) {
        normalized = 0.0f;
    }

    if (normalized > 1.0f) {
        normalized = 1.0f;
    }

    return config->analog_min_eng +
        normalized * (config->analog_max_eng - config->analog_min_eng);
}
