# Lending

## Contents

- [`rates`](#rates)
- [`offers` 🔐](#offers)
- [`earnings` 🔐](#earnings)
- [`lend` 🔐](#lend)
- [`stop` 🔐](#stop)

![Divider](../../images/divider.png)

## `rates`

```sh
ftx rates [options]  Display lending rates.
```

### Options

```
-c, --currency <currency>  Currency symbol(s).
--sort <method>            Sorting method.
```

---

#### Currency

```
-c, --currency <currency>  Currency symbol(s).
```

Optional (default: all).

Supports comma-separated list.

Examples: `usd`, `btc`, `tsla,tsm,twtr`.

---

#### Sort

```
--sort <method>  Sorting method.
```

Optional (default: `currency`).

| Choice      | Aliases | Description                                     |
| ----------- | ------- | ----------------------------------------------- |
| `currency`  | `c`     | Sort by currency symbol (A-Z).                  |
| `previous`  | `p`     | Sort by previous funding rate (high-low).       |
| `estimated` | `e`     | Sort by estimated next funding rate (high-low). |

---

### Examples

```sh
# Display lending rates for all currencies.
ftx rates

# Display lending rates for USD.
ftx rates --currency usd

# Display lending rates for USD and USDT, sorted by estimated next lending rate.
ftx rates --currency usd,usdt --sort estimated
```

![Divider](../../images/divider.png)

## `offers` 🔐

```sh
ftx offers [options]  Display my active lending offers.
```

### Options

```
--sort <method>  Sorting method.
```

---

#### Sort

```
--sort <method>  Sorting method.
```

Optional (default: `currency`).

| Choice     | Aliases | Description                       |
| ---------- | ------- | --------------------------------- |
| `currency` | `c`     | Sort by currency symbol (A-Z).    |
| `lendable` | `le`    | Sort by lendable size (high-low). |
| `offered`  | `o`     | Sort by offered size (high-low).  |
| `locked`   | `lo`    | Sort by locked size (high-low).   |
| `min-rate` | `r`     | Sort by minimum rate (high-low).  |

---

### Examples

```sh
# Display my open lending offers.
ftx offers

# Display my open lending offers, sorted by locked size.
ftx offers --sort locked
```

![Divider](../../images/divider.png)

## `earnings` 🔐

```sh
ftx earnings  Display my lending earnings.
```

![Divider](../../images/divider.png)

## `lend` 🔐

```sh
ftx lend [options]  Create lending offer(s). Matching existing offer(s) will be overwritten.
```

### Options

```
-c, --currency <currency>  Currency symbol(s).
-s, --size <size>          Size to lend (base currency).
-r, --min-rate <rate>      Minimum yearly lending rate (%).
--compound                 Enable auto-compounding. Proceeds from the lending offer(s) will be automatically compounded hourly by updating offered size(s) to the maximum lendable.
```

---

#### Currency

```
-c, --currency <currency>  Currency symbol(s).
```

Optional (default: all lendable).

Supports comma-separated list.

Examples: `usd`, `btc`, `tsla,tsm,twtr`.

---

#### Size

```
-s, --size <size>  Size to lend (base currency).
```

Optional (default: maximum lendable).

Supports [number shorthands](./../../guides/power-users.md#number-shorthands).

Examples: `0.001`, `10`, `100k`.

---

#### Min. rate

```
-r, --min-rate <rate>  Minimum yearly lending rate (%).
```

Optional (default: `0`).

Examples: `0`, `10`, `100.5`.

---

#### Compound

```
--compound  Enable auto-compounding. Proceeds from the lending offer(s) will be automatically compounded hourly by updating offered size(s) to the maximum lendable.
```

Optional (default: disabled).

> ℹ️ Auto-compounding creates a special type of [recurring scheduled command](../../guides/scheduled-commands.md#recurring) optimised for lending. The command will run at 59 minutes past every hour; lending rates and locked balances are updated hourly, so we want to lock our additional margin as late as possible.

---

### Examples

```sh
# Create offer: lend all lendable currencies at a minimum yearly rate of 0%.
ftx lend

# Create offer: lend 10,000 USD at a minimum yearly rate of 0%.
ftx lend --currency usd --size 10k

# Create offer: lend all USD and USDT at a minimum yearly rate of 5%, with auto-compounding enabled.
ftx lend --currency usd,usdt --min-rate 5 --compound
```

![Divider](../../images/divider.png)

## `stop` 🔐

```sh
ftx stop [options]  Withdraw lending offer(s).
```

> ⚠️ Funds will stay locked by FTX for up to 1 hour after withdrawing a lending offer.

### Options

```
-c, --currency <currency>  Currency symbol(s).
```

---

#### Currency

```
-c, --currency <currency>  Currency symbol(s).
```

Optional (default: all lendable).

Supports comma-separated list.

Examples: `usd`, `btc`, `tsla,tsm,twtr`.

---

### Examples

```sh
# Withdraw all offers.
ftx stop

# Withdraw USD offer.
ftx stop --currency usd

# Withdraw USD and USDT offers.
ftx stop --currency usd,usdt
```
