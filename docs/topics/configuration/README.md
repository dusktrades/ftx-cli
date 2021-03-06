# Configuration

## Contents

- [`config`](#config)

![Divider](../../images/divider.png)

## `config`

```sh
ftx config [options]  Save configuration options on your machine.
```

### Options

```
UI:
      --output (table | json)
      --[no-]colour
      --[no-]update-notifications

Platform:
  -e, --exchange (ftx | ftx-us)

Command:
      --size-currency <source>
      --size-hook <hook>
      --price-hook <hook>
      --[no-]reduce-only
      --[no-]ioc
      --[no-]post-only
      --[no-]retry
      --rate-limit <rate limit>
```

> ℹ️ Option descriptions, argument formats, and more, can be found in the relevant documentation sections.

### Examples

```sh
# Save default preference to use FTX US.
ftx config --exchange ftx-us

# Save default preference to disable coloured output.
ftx config --no-colour

# Save default preference to use last price as the price hook.
ftx config --price-hook last

# Save default preference to enable IOC mode.
ftx config --ioc
```
