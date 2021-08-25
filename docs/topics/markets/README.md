# Markets

## Contents

- [`spot`](#spot)
  - [Options](#options)
  - [Examples](#examples)
- [`futures`](#futures)
  - [Options](#options-1)
  - [Examples](#examples-1)

![Divider](../../images/divider.png)

## `spot`

```sh
ftx spot [options]  Display spot markets.
```

### Options

```
-c, --currency <currency>        Currency symbol(s).
-q, --quote-currency <currency>  Quote currency symbol(s).
-t, --type <type>                Spot type(s).
--token-leverage <leverage>      Token leverage name(s) or multiplier(s).
--sort <method>                  Sorting method.
```

---

#### Currency

```
-c, --currency <currency>  Currency symbol(s).
```

Optional (default: all).

Supports comma-separated list.

Examples: `btc`, `bullshit`, `tsla,tsm,twtr`.

---

#### Quote currency

```
-q, --quote-currency <currency>  Quote currency symbol(s).
```

Optional (default: all).

Supports comma-separated list.

Examples: `usd`, `usdt`, `btc,doge,eur`.

---

#### Type

```
-t, --type <type>  Spot type(s).
```

Optional (default: all).

Supports comma-separated list.

| Choice             | Aliases |
| ------------------ | ------- |
| `coin`             |         |
| `fiat`             |         |
| `leveraged-token`  | `lev`   |
| `volatility-token` | `vol`   |
| `equity-token`     | `stock` |

---

#### Token leverage

```
--token-leverage <leverage>  Token leverage name(s) or multiplier(s).
```

Optional (default: all).

Supports comma-separated list.

| Choice  | Aliases |
| ------- | ------- |
| `bull`  | `3x`    |
| `half`  | `0.5x`  |
| `hedge` | `-1x`   |
| `bear`  | `-3x`   |

---

#### Sort

```
--sort <method>  Sorting method.
```

Optional (default: `name`).

| Choice       | Description                              |
| ------------ | ---------------------------------------- |
| `name`       | Sort by name (A-Z).                      |
| `price`      | Sort by price (high-low).                |
| `change-1h`  | Sort by 1-hour price change (high-low).  |
| `change-24h` | Sort by 24-hour price change (high-low). |
| `volume`     | Sort by 24-hour volume (high-low).       |

---

### Examples

```sh
# Display all spot markets.
ftx spot

# Display all BTC and ETH spot markets.
ftx spot --currency btc,eth

# Display all fiat spot markets.
ftx spot --type fiat

# Display all volatility and equity token spot markets, sorted by 1-hour price change.
ftx spot --type volatility-token,equity-token --sort change-1h

# Display BULL (3x) leveraged token traded against USDT spot markets, sorted by volume.
ftx spot --quote-currency usdt --token-leverage bull --sort volume
```

![Divider](../../images/divider.png)

## `futures`

```sh
ftx futures [options]  Display futures markets.
```

### Options

```
-c, --currency <currency>  Underlying currency symbol(s).
-t, --type <type>          Future type(s).
--sort <method>            Sorting method.
```

---

#### Currency

```
-c, --currency <currency>  Underlying currency symbol(s).
```

Optional (default: all).

Supports comma-separated list.

Examples: `btc`, `btc-perp`, `tsla-0924,tsm-0924,twtr-0924`.

---

#### Type

```
-t, --type <type>  Future type(s).
```

Optional (default: all).

Supports comma-separated list.

| Choice      | Aliases |
| ----------- | ------- |
| `perpetual` | `perp`  |
| `quarterly` | `dated` |
| `move`      |         |

---

#### Sort

```
--sort <method>  Sorting method.
```

Optional (default: `name`).

| Choice              | Aliases | Description                                     |
| ------------------- | ------- | ----------------------------------------------- |
| `name`              |         | Sort by name (A-Z).                             |
| `last-price`        |         | Sort by last price (high-low).                  |
| `mark-price`        |         | Sort by mark price (high-low).                  |
| `change-1h`         |         | Sort by 1-hour price change (high-low).         |
| `change-24h`        |         | Sort by 24-hour price change (high-low).        |
| `volume`            |         | Sort by 24-hour volume (high-low).              |
| `open-interest`     | `oi`    | Sort by open interest (high-low).               |
| `previous-funding`  |         | Sort by previous funding rate (high-low).       |
| `estimated-funding` |         | Sort by estimated next funding rate (high-low). |

---

### Examples

```sh
# Display all futures markets.
ftx futures

# Display all BTC and ETH underlying futures markets.
ftx futures --currency btc,eth

# Display all perpetual futures markets.
ftx futures --type perpetual

# Display all perpetual futures markets, sorted by estimated next funding rate.
ftx futures --type perpetual --sort estimated-funding

# Display BTC underlying quarterly and move futures markets, sorted by open interest.
ftx futures --currency btc --type quarterly,move --sort open-interest
```
