# Trading

## Contents

- [`trade`](#trade)
  - [Options](#options)
  - [Examples](#examples)
  - [Resources](#resources)
- [`cancel`](#cancel)
  - [Options](#options-1)
  - [Examples](#examples-1)

![Divider](../../images/divider.png)

## `trade`

Authentication required.

Place order(s).

```sh
ftx trade [options]
```

### Options

```
Required:
  -m, --market <market>      Market name.
  --side <side>              Order side.
  -t, --type <type>          Order type.
  -s, --size <size>          Size to execute, measured in base currency or underlying.

Order-type-specific:
  -p, --price <price>        Price that limit orders will be executed at.
  --trigger-price <price>    Price that triggers stop or take profit orders.
  --trail-value <value>      Distance the price must change direction and move in order to trigger trailing stop orders.
  --split <count>            Splits the order into a number of smaller, equal-sized orders.
  --duration <duration>      Spreads the individual orders of a split order linearly (i.e. fixed interval) over a total order placement duration, creating a TWAP order.
  --[no-]reduce-only         Toggle Reduce-Only mode. When enabled, orders will only reduce your position.
  --[no-]ioc                 Toggle Immediate-or-Cancel (IOC) mode. When enabled, limit orders will only be executed as the taker.
  --[no-]post-only           Toggle Post-Only mode. When enabled, limit orders will only be executed as the maker.
  --[no-]retry               Toggle Retry-Until-Filled mode. When enabled, triggered orders that are executed at market will be retried until the order size is filled.
  --rate-limit <rate limit>  Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).
```

> ℹ️ FTX CLI allows you to place new advanced order types. [Learn more](./advanced-orders.md).
>
> ℹ️ You can save your order mode (IOC, Post-Only, Reduce-Only, Retry-Until-Filled) and rate limit preferences using the `config` command.

---

#### Market

```
-m, --market <market>  Market name.
```

Required.

Case-insensitive but must be formatted as on the FTX platform. You can find lists of available markets using the `spot` and `futures` commands.

Examples: `btc/usd`, `btc-perp`, `btc-move-0218`.

---

#### Side

```
--side <side>  Order side.
```

Required.

| Choice | Aliases |
| ------ | ------- |
| `buy`  | `b`     |
| `sell` | `s`     |

---

#### Type

```
-t, --type <type>  Order type.
```

Required.

| Choice               | Aliases | Additional required options                          |
| -------------------- | ------- | ---------------------------------------------------- |
| `market`             | `m`     |                                                      |
| `limit`              | `l`     | [`price`](#price)                                    |
| `stop-market`        | `sm`    | [`trigger-price`](#trigger-price)                    |
| `stop-limit`         | `sl`    | [`price`](#price), [`trigger-price`](#trigger-price) |
| `trailing-stop`      | `ts`    | [`trail-value`](#trail-value)                        |
| `take-profit-market` | `tpm`   | [`trigger-price`](#trigger-price)                    |
| `take-profit-limit`  | `tpl`   | [`price`](#price), [`trigger-price`](#trigger-price) |

---

#### Size

```
-s, --size <size>  Size to execute, measured in base currency or underlying.
```

Required.

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

---

#### Price

```
-p, --price <price>  Price that limit orders will be executed at.
```

Required for limit orders (`limit`, `stop-limit`, `take-profit-limit`).

Supports [number shorthands](./404.md) and price ranges (format: `X:Y`) for [scaled orders](./advanced-orders.md#scaled-order).

Examples: `0.001`, `100k`, `500:1k`.

---

#### Trigger price

```
--trigger-price <price>  Price that triggers stop or take profit orders.
```

Required for stop and take profit orders (`stop-market`, `stop-limit`, `take-profit-market`, `take-profit-limit`).

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

---

#### Trail value

```
--trail-value <value>  Distance the price must change direction and move in order to trigger trailing stop orders.
```

Required for `trailing-stop` orders.

Positive value for `buy` orders (i.e. the price must increase by the value without making a new low); negative value for `sell` orders (i.e. the price must decrease by the value without making a new high).

Supports [number shorthands](./404.md).

Examples: `1`, `-1`, `1k`, `-1k`.

---

#### Split

```
--split <count>  Splits the order into a number of smaller, equal-sized orders.
```

Optional (default: `1` [disabled]).

Compatible with all order types.

Supports [number shorthands](./404.md).

Examples: `1`, `100`, `1k`.

[Learn more about split orders](./advanced-orders.md#split-order).

---

#### Duration

```
--duration <duration>  Spreads the individual orders of a split order linearly (i.e. fixed interval) over a total order placement duration, creating a TWAP order.
```

Optional (default: disabled).

Compatible with all order types executed as split orders.

Examples: `30s`, `1h45m10s`, `3h`.

[Learn more about TWAP orders](./advanced-orders.md#twap-order).

---

#### Reduce-Only

```
--reduce-only     Enable Reduce-Only mode. Orders will only reduce your position.
--no-reduce-only  Disable Reduce-Only mode.
```

Optional (default: disabled).

Compatible with all order types.

---

#### Immediate-or-Cancel (IOC)

```
--ioc     Enable IOC mode. Limit orders will only be executed as the taker.
--no-ioc  Disable IOC mode.
```

Optional (default: disabled).

Compatible order types: `limit`.

---

#### Post-Only

```
--post-only     Enable Post-Only mode. Limit orders will only be executed as the maker.
--no-post-only  Disable Post-Only mode.
```

Optional (default: enabled).

Compatible order types: `limit`.

---

#### Retry-Until-Filled

```
--retry     Enable Retry-Until-Filled mode. Triggered orders that are executed at market will be retried until the order size is filled.
--no-retry  Disable Retry-Until-Filled mode.
```

Optional (default: enabled).

Compatible order types: `stop-market`, `trailing-stop`, `take-profit-market`.

---

#### Rate limit

```
--rate-limit <rate limit>  Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).
```

Optional (default: `6/200`).

Compatible with all order types.

For example, `6/200` means 'send a maximum of `6` order placement requests every `200` milliseconds'.

Examples: `2/200`, `6/200`, `24/200`.

[Learn more about rate limit overrides](./rate-limit-overrides.md).

---

### Examples

```sh
# Place order: market buy 1 BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 1

# Place order: limit sell 2.5 BTC-PERP at $100,000.
ftx trade --market btc-perp --side sell --type limit --size 2.5 --price 100k

# Place order: stop market buy 10 ETH/BTC, triggering at 0.1.
ftx trade --market eth/btc --side buy --type stop-market --size 10 --trigger-price 0.1

# Place order: stop limit buy 100 FTT/USDT at $150, triggering at $150.5.
ftx trade --market ftt/usdt --side buy --type stop-limit --size 100 --price 150 --trigger-price 150.5

# Place order: trailing stop buy 10,000 USDT-0924, trailing by $0.005.
ftx trade --market usdt-0924 --side buy --type trailing-stop --size 10k --trail-value 0.005

# Place order: take profit market buy 1 BTC/USD, triggering at $30,500.
ftx trade --market btc/usd --side buy --type take-profit-market --size 1 --trigger-price 30.5k

# Place order: take profit limit buy 1 BTC/USD at $30,450, triggering at $30,500.
ftx trade --market btc/usd --side buy --type take-profit-limit --size 1 --price 30.45k --trigger-price 30.5k
```

### Resources

- [Article: Advanced Order Types](https://help.ftx.com/hc/en-us/articles/360031896592-Advanced-Order-Types)
- [Article: Reduce-only Orders](https://help.ftx.com/hc/en-us/articles/360030802012-Reduce-only-Orders)

![Divider](../../images/divider.png)

## `cancel`

Authentication required.

Cancel order(s).

```sh
ftx cancel [options]
```

### Options

```
-m, --market <market>  Market name.
--side <side>          Order side.
```

---

#### Market

```
-m, --market <market>  Market name.
```

Optional.

Case-insensitive but must be formatted as on the FTX platform. You can find lists of available markets using the `spot` and `futures` commands.

Examples: `btc/usd`, `btc-perp`, `btc-move-0218`.

---

#### Side

```
--side <side>  Order side.
```

Optional.

| Choice | Aliases |
| ------ | ------- |
| `buy`  | `b`     |
| `sell` | `s`     |

---

### Examples

```sh
# Cancel all orders.
ftx cancel

# Cancel all BTC-PERP orders.
ftx cancel --market btc-perp

# Cancel all buy orders.
ftx cancel --side buy

# Cancel all BTC/USD sell orders.
ftx cancel --market btc/usd --side sell
```
