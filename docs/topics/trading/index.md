# Trading

## Contents

- [`trade`](#trade)
  - [Options](#trade-options)
  - [Examples](#trade-examples)
- [`cancel`](#cancel)
  - [Options](#cancel-options)
  - [Examples](#cancel-examples)
- [Resources](#resources)

![Divider](../../images/divider.png)

## `trade`

Place order(s) (authentication required).

```
trade [options]
```

### `trade` options

```
Required:
  -m, --market <market>      Market symbol.
  --side <side>              Order side.
  -t, --type <type>          Order type.
  -s, --size <size>          Total amount of underlying currency to execute.

Order-type-specific:
  -p, --price <price>        Price or price range that limit orders will be executed at.
  --trigger-price <price>    Price that triggers stop or take profit orders.
  --trail-value <value>      Distance the price must move in order to trigger trailing stop orders; positive for buy orders and negative for sell orders.
  --split <count>            Number of orders to split the order size into (default: 1).
  --duration <duration>      Order placement duration which controls the interval between individual TWAP orders in conjunction with the split count (default: 0).
  --[no-]ioc                 Toggle Immediate-or-Cancel (IOC) mode: when enabled, limit orders will only be executed as the taker (default: false).
  --[no-]post-only           Toggle Post-Only mode: when enabled, limit orders will only be executed as the maker (default: true).
  --[no-]reduce-only         Toggle Reduce-Only mode: when enabled, orders will only reduce your position (default: false).
  --[no-]retry               Toggle Retry-Until-Filled mode: when enabled, trigger market orders will retry sending the triggered order until filled (default: true).
  --rate-limit <rate limit>  Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds) (default: 6/200).
```

> ℹ️ You can save your order mode (IOC, Post-Only, Reduce-Only, Retry-Until-Filled) and rate limit preferences using the `config` command.

#### Market (`-m, --market <market>`)

Required.

Case-insensitive but must be formatted as on the FTX platform. You can find lists of available markets using the `spot` and `futures` commands.

Examples: `btc/usd`, `btc-perp`, `btc-move-0808`.

#### Side

`--side <side>`

Required.

| Choice | Aliases |
| ------ | ------- |
| `buy`  | `b`     |
| `sell` | `s`     |

#### Type

`-t, --type <type>`

Required.

| Choice               | Aliases | Additional required options                      |
| -------------------- | ------- | ------------------------------------------------ |
| `market`             | `m`     |                                                  |
| `limit`              | `l`     | [Price](#price)                                  |
| `stop-market`        | `sm`    | [Trigger price](#trigger-price)                  |
| `stop-limit`         | `sl`    | [Price](#price), [trigger price](#trigger-price) |
| `trailing-stop`      | `ts`    | [Trail value](#trail-value)                      |
| `take-profit-market` | `tpm`   | [Trigger price](#trigger-price)                  |
| `take-profit-limit`  | `tpl`   | [Price](#price), [trigger price](#trigger-price) |

#### Size

`-s, --size <size>`

Required.

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

#### Price

`-p, --price <price>`

Required for limit orders (`limit`, `stop-limit`, `take-profit-limit`).

Supports [number shorthands](./404.md) and [price ranges for scaled orders](./404.md).

Examples: `0.001`, `10`, `100k`, `500:1k`.

#### Trigger price

`--trigger-price <price>`

Required for stop and take profit orders (`stop-market`, `stop-limit`, `take-profit-market`, `take-profit-limit`).

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

#### Trail value

`--trail-value <value>`

Required for `trailing-stop` orders.

Supports [number shorthands](./404.md).

Examples: `1`, `-1`, `1k`, `-1k`.

### `trade` examples

```sh
# Place order: market buy 1 BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 1

# Place order: limit buy 1 BTC-PERP at $10,000.
ftx trade --market btc-perp --side buy --type limit --size 1 --price 10k

# Place order: stop market buy 500 FTT-PERP, triggering at $100.
ftx trade --market ftt-perp --side buy --type stop-market --size 500 --trigger-price 100

# Place order: stop limit buy 1,000 SOL-0924 at $89.5, triggering at $90.5.
ftx trade --market sol-0924 --side buy --type stop-limit --size 1k --price 89.5 --trigger-price 90.5

# Place order: trailing stop buy 1 TRUMP2024, trailing by $0.1.
ftx trade --market trump2024 --side buy --type trailing-stop --size 1 --trail-value 0.1

# Place order: take profit market buy 10 SRM/USDT, triggering at $3.
ftx trade --market srm/usdt --side buy --type take-profit-market --size 10 --trigger-price 3

# Place order: take profit limit buy 10,200 USDTBEAR/USD at $3,100, triggering at $3,000.
ftx trade --market usdtbear/usd --side buy --type take-profit-limit --size 10.2k --price 3100 --trigger-price 3000
```

## `cancel`

Cancel order(s) (authentication required).

```
cancel [options]
```

### `cancel` options

```
-m, --market <market>  Market symbol.
--side <side>          Order side (choices: buy [alias: b], sell [alias: s]).
```

### `cancel` examples

```sh
# Cancel all orders.
ftx cancel

# Cancel all BTC/USD orders.
ftx cancel --market btc/usd

# Cancel all buy orders.
ftx cancel --side buy

# Cancel all BTC/USD buy orders.
ftx cancel --market btc/usd --side buy
```

## Resources

- [Article: Advanced Order Types](https://help.ftx.com/hc/en-us/articles/360031896592-Advanced-Order-Types)
- [Article: Reduce-only Orders](https://help.ftx.com/hc/en-us/articles/360030802012-Reduce-only-Orders)
