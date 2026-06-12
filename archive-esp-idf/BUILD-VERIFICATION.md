# Archive ESP-IDF Build Verification

Verification date: 2026-06-12

ESP-IDF was installed locally at:

```text
/Users/michaeljohnrautenbach1985/esp/esp-idf
```

Verified ESP-IDF version:

```text
ESP-IDF 5.4
```

## Commands Run

From the repository root:

```sh
./archive-esp-idf/build-main.sh
./archive-esp-idf/build-tests.sh
```

## Results

| Build | Result | Output Binary |
| --- | --- | --- |
| Main firmware | PASS | `archive_plc_app.bin` |
| Unity firmware test app | PASS | `archive_plc_runtime_tests.bin` |

Both builds completed with ESP-IDF `idf.py build`.

## Notes

- ESP-IDF was installed with the official `install.sh esp32` flow.
- The build scripts source `~/esp/esp-idf/export.sh` automatically.
- The build scripts put Homebrew Python 3.12 first in `PATH` before sourcing ESP-IDF to avoid macOS system Python 3.8 environment mismatch.
- Build output folders and generated `sdkconfig` files are ignored because this repository is a reusable template package.
- Current warnings are limited to legacy ADC driver deprecation and one unused MQTT event variable. These are not build failures, but should be cleaned up in a future firmware modernization pass.
