# Trading

## Contents

- [`positions` 🔐](#positions)
- [`trade` 🔐💬](#trade)
- [`cancel` 🔐](#cancel)

![Divider](../../images/divider.png)

## `positions` 🔐

```
ftx positions [options]  Display my open futures positions.
```

### Options

```
Optional:
  -m, --market <market>  Market name(s).
      --sort <method>    Sorting method.
```

---

#### Market

```
-m, --market <market>  Market name(s).
```

Case-insensitive but must be formatted as it is on the FTX platform. You can find a list of available markets using the [`futures`](../markets/README.md#futures) command.

Examples: `btc-perp`, `eth-perp`, `btc-perp,btc-1231,btc-move-0218`.

---

#### Sort

```
--sort <method>  Sorting method.
```

| Choice                        | Aliases | Description                                            |
| ----------------------------- | ------- | ------------------------------------------------------ |
| `market`                      | `m`     | Sort by market name (A-Z).                             |
| `side`                        | `S`     | Sort by order side (high-low).                         |
| `size`                        | `s`     | Sort by order size (high-low).                         |
| `notional-size`               | `ns`    | Sort by notional order size (high-low).                |
| `mark-price`                  | `mp`    | Sort by mark price (high-low).                         |
| `average-open-price`          | `op`    | Sort by average open price since last flat (high-low). |
| `break-even-price`            | `bep`   | Sort by break-even price since last flat (high-low).   |
| `estimated-liquidation-price` | `lp`    | Sort by estimated liquidation price (high-low).        |
| `pnl`                         |         | Sort by PnL since last flat (high-low).                |

---

### Examples

```sh
# Display my open futures positions.
ftx positions

# Display my open BTC-PERP position.
ftx positions --market btc-perp

# Display my open futures positions, sorted by PnL.
ftx positions --sort pnl
```

### Resources

- [Article: PnL, Average Open Price, and Break-Even Price](https://help.ftx.com/hc/en-us/articles/360031893572-PnL-Average-Open-Price-and-Break-Even-Price)
- [Article: Liquidations](https://help.ftx.com/hc/en-us/articles/360027668712-Liquidations)

![Divider](../../images/divider.png)

## `trade` 🔐💬

```
ftx trade <options>  Place order(s).
```

### Options

```
Required:
  -m, --market <market>                  Market name.
      --side <side>                      Order side.
  -t, --type <type>                      Order type.
  -s, --size <size>                      Size to execute.

Order-type-specific:
  -p, --price <price>                    Price that limit orders will be executed at.
      --trigger-price <price>            Price that triggers stop or take profit orders.
      --trail-value <value>              Distance that price must change direction and move in order to trigger trailing stop orders.

Optional:
      --split <count>                    Splits the order into a number of smaller, equal-sized individual orders.
      --duration <duration>              Spreads the placement of a split order's individual orders linearly (i.e. fixed interval) over a total duration.

Configurable:
      --size-currency <source>           Source currency for calculating size [default: base].
      --size-hook <hook>                 Source size for calculating relative size [default: default].
      --price-hook <hook>                Source price for calculating relative price [default: market].
      --[no-]reduce-only                 Toggle Reduce-Only mode. When enabled, orders will only reduce your position [default: disabled].
      --[no-]ioc                         Toggle Immediate-or-Cancel (IOC) mode. When enabled, limit orders will only be executed as the taker [default: disabled].
      --[no-]post-only                   Toggle Post-Only mode. When enabled, limit orders will only be executed as the maker [default: enabled].
      --[no-]retry                       Toggle Retry-Until-Filled mode. When enabled, triggered orders that are executed at market will be retried until the order size is filled [default: enabled].
      --rate-limit <rate limit>          Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds) [default: 6/200].
      --[no-]retry-exchange-unavailable  Advanced users only. Toggle retrying order placement requests that are rejected due to the exchange being unavailable [default: disabled].
```

> ℹ️ You can set configurable option defaults using the [`config`](../configuration/README.md#config) command.

---

#### Market

```
-m, --market <market>  Market name.
```

Case-insensitive but must be formatted as it is on the FTX platform. You can find lists of available markets using the [`spot`](../markets/README.md#spot) and [`futures`](../markets/README.md#futures) commands.

Examples: `btc/usd`, `btc-perp`, `btc-move-0218`.

---

#### Side

```
--side <side>  Order side.
```

| Choice | Aliases |
| ------ | ------- |
| `buy`  | `b`     |
| `sell` | `s`     |

---

#### Type

```
-t, --type <type>  Order type.
```

| Choice               | Aliases | Additional required options                            |
| -------------------- | ------- | ------------------------------------------------------ |
| `market`             | `m`     |                                                        |
| `limit`              | `l`     | [`price`](#pricing)                                    |
| `stop-market`        | `sm`    | [`trigger-price`](#trigger-price)                      |
| `stop-limit`         | `sl`    | [`price`](#pricing), [`trigger-price`](#trigger-price) |
| `trailing-stop`      | `ts`    | [`trail-value`](#trail-value)                          |
| `take-profit-market` | `tpm`   | [`trigger-price`](#trigger-price)                      |
| `take-profit-limit`  | `tpl`   | [`price`](#pricing), [`trigger-price`](#trigger-price) |

---

#### Sizing

```
-s, --size <size>             Size to execute.
    --size-currency <source>  Source currency for calculating size [default: base].
    --size-hook <hook>        Source size for calculating relative size [default: default].
```

[Learn more about order sizing](./order-sizing.md).

---

#### Pricing

```
-p, --price <price>      Price that orders executed at limit will be placed at.
    --price-hook <hook>  Source price for calculating relative price [default: market].
```

[Learn more about order pricing](./order-pricing.md).

---

#### Trigger price

```
--trigger-price <price>  Price that triggers stop or take profit orders.
```

Examples: `0.001`, `10`, `100k`.

---

#### Trail value

```
--trail-value <value>  Distance that price must change direction and move in order to trigger trailing stop orders.
```

Positive value for `buy` orders (i.e. the price must increase by the value without making a new low); negative value for `sell` orders (i.e. the price must decrease by the value without making a new high).

Examples: `1`, `-1`, `1k`.

---

#### Split

```
--split <count>  Splits the order into a number of smaller, equal-sized individual orders.
```

Split orders can be used to disguise the total order size.

Compatible with all order types.

Examples: `1`, `100`, `1k`.

---

#### Duration

```
--duration <duration>  Spreads the placement of a split order's individual orders linearly (i.e. fixed interval) over a total duration.
```

Timed orders can be combined with market orders to create TWAP orders: these can be used to minimise market impact. Timed orders can also be combined with limit orders to delay individual order placement: these can be used to show smaller parts of an order in the orderbook at once.

Compatible with all split orders.

Examples: `30s`, `1h45m10s`, `3h`.

---

#### Reduce-Only

```
--reduce-only     Enable Reduce-Only mode. Orders will only reduce your position.
--no-reduce-only  Disable Reduce-Only mode.
```

Compatible with all order types.

---

#### Immediate-or-Cancel (IOC)

```
--ioc     Enable IOC mode. Limit orders will only be executed as the taker.
--no-ioc  Disable IOC mode.
```

Compatible order types: `limit`.

---

#### Post-Only

```
--post-only     Enable Post-Only mode. Limit orders will only be executed as the maker.
--no-post-only  Disable Post-Only mode.
```

Compatible order types: `limit`.

---

#### Retry-Until-Filled

```
--retry     Enable Retry-Until-Filled mode. Triggered orders that are executed at market will be retried until the order size is filled.
--no-retry  Disable Retry-Until-Filled mode.
```

Compatible order types: `stop-market`, `trailing-stop`, `take-profit-market`.

---

#### Rate limit

```
--rate-limit <rate limit>  Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).
```

`6/200` means 'send a maximum of `6` order placement requests every `200` milliseconds'.

Examples: `2/200`, `6/200`, `24/200`.

[Learn more about rate limit overrides](./rate-limit-overrides.md).

---

#### Retry exchange unavailable

> ⚠️ This is for advanced users only. Usage should depend on your own discretion and judgement of the current exchange status. If this option is enabled while the exchange is in an unstable state, it is possible for duplicate orders to be placed.

```
--retry-exchange-unavailable     Advanced users only. Enable retrying order placement requests that are rejected due to the exchange being unavailable.
--no-retry-exchange-unavailable  Disable retrying order placement requests that are rejected due to the exchange being unavailable.
```

---

### Examples

Please see [here](./examples.md).

### Notes

Complex orders can have some individual orders rejected. Individual orders that fail to be placed due to rate limits will automatically be retried. Individual orders that fail to be placed due to other reasons (e.g. connection loss, not enough margin) will be ignored and execution will continue. This may result in incomplete orders.

The order placement sequence of complex orders is not guaranteed: individual orders are often sent in parallel, to increase speed, and it is impossible to predict which will be accepted first by the FTX platform.

FTX trading fees are charged per volume executed, and not per trade executed, so multiple smaller orders will incur the same total fee as if they were placed as a single large order.

### Resources

- [Twitter thread: FTX CLI TWAP orders](https://twitter.com/dusktrades/status/1431995882040352775)
- [Twitter thread: FTX CLI order sizing and pricing methods](https://twitter.com/dusktrades/status/1440716947616796680)
- [Article: Advanced Order Types](https://help.ftx.com/hc/en-us/articles/360031896592-Advanced-Order-Types)
- [Article: Reduce-only Orders](https://help.ftx.com/hc/en-us/articles/360030802012-Reduce-only-Orders)

![Divider](../../images/divider.png)

## `cancel` 🔐

```
ftx cancel [options]  Cancel order(s).
```

### Options

```
Optional:
  -m, --market <market>  Market name.
      --side <side>      Order side.
```

---

#### [Market](#market)

---

#### [Side](#side)

---

### Examples

```sh
# Cancel all orders.
ftx cancel

# Cancel all BTC/USD orders.
ftx cancel --market btc/usd

# Cancel all buy orders.
ftx cancel --side buy

# Cancel all BTC-PERP sell orders.
ftx cancel --market btc-perp --side sell
```
