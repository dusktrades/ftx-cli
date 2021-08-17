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

Authentication required.

Place order(s).

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
  --split <count>            Number of orders to split the order size into.
  --duration <duration>      Order placement duration which controls the interval between individual TWAP orders in conjunction with the split count.
  --[no-]ioc                 Toggle Immediate-or-Cancel (IOC) mode: when enabled, limit orders will only be executed as the taker.
  --[no-]post-only           Toggle Post-Only mode: when enabled, limit orders will only be executed as the maker.
  --[no-]reduce-only         Toggle Reduce-Only mode: when enabled, orders will only reduce your position.
  --[no-]retry               Toggle Retry-Until-Filled mode: when enabled, trigger market orders will retry sending the triggered order until filled.
  --rate-limit <rate limit>  Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds).
```

> ℹ️ You can save your order mode (IOC, Post-Only, Reduce-Only, Retry-Until-Filled) and rate limit preferences using the `config` command.

#### Market

`-m, --market <market>`

Required.

Market name.

Case-insensitive but must be formatted as on the FTX platform. You can find lists of available markets using the `spot` and `futures` commands.

Examples: `btc/usd`, `btc-perp`, `btc-move-0218`.

#### Side

`--side <side>`

Required.

Order side.

| Choice | Aliases |
| ------ | ------- |
| `buy`  | `b`     |
| `sell` | `s`     |

#### Type

`-t, --type <type>`

Required.

Order type.

| Choice               | Aliases | Additional required options                          |
| -------------------- | ------- | ---------------------------------------------------- |
| `market`             | `m`     |                                                      |
| `limit`              | `l`     | [`price`](#price)                                    |
| `stop-market`        | `sm`    | [`trigger-price`](#trigger-price)                    |
| `stop-limit`         | `sl`    | [`price`](#price), [`trigger-price`](#trigger-price) |
| `trailing-stop`      | `ts`    | [`trail-value`](#trail-value)                        |
| `take-profit-market` | `tpm`   | [`trigger-price`](#trigger-price)                    |
| `take-profit-limit`  | `tpl`   | [`price`](#price), [`trigger-price`](#trigger-price) |

#### Size

`-s, --size <size>`

Required.

Size to execute, measured in base currency or underlying.

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

#### Price

`-p, --price <price>`

Required for limit orders (`limit`, `stop-limit`, `take-profit-limit`).

Price that limit orders will be executed at.

Supports [number shorthands](./404.md) and price ranges ([scaled orders](./advanced-orders.md#scaled-order)).

Examples: `0.001`, `10`, `100k`, `500:1k`.

#### Trigger price

`--trigger-price <price>`

Required for stop and take profit orders (`stop-market`, `stop-limit`, `take-profit-market`, `take-profit-limit`).

Price that triggers stop or take profit orders.

Supports [number shorthands](./404.md).

Examples: `0.001`, `10`, `100k`.

#### Trail value

`--trail-value <value>`

Required for `trailing-stop` orders.

Distance the price must change direction and move in order to trigger `trailing-stop` orders. Positive value for `buy` orders (i.e. the price must increase by the value without making a new low); negative value for `sell` orders (i.e. the price must decrease by the value without making a new high).

Supports [number shorthands](./404.md).

Examples: `1`, `-1`, `1k`, `-1k`.

#### Split

`--split <count>`

Optional (default: `1` [disabled]).

Compatible with all order types.

Splits the order into a number of smaller, equal-sized orders.

Supports [number shorthands](./404.md).

Examples: `1`, `100`, `1k`.

[Learn more about split orders](./advanced-orders.md#split-order).

#### Duration

`--duration <duration>`

Optional (default: disabled).

Compatible with all order types as split orders.

Spreads the individual orders of a split order linearly (i.e. fixed interval) over a total order placement duration, creating a TWAP order.

Examples: `30s`, `1h45m10s`, `3h`.

[Learn more about TWAP orders](./advanced-orders.md#twap-order).

#### Reduce-Only

Enable: `--reduce-only`<br>Disable: `--no-reduce-only`

Optional (default: disabled).

Compatible with all order types.

Toggle Reduce-Only mode. When enabled, orders will only reduce your position.

#### IOC

Enable: `--ioc`<br>Disable: `--no-ioc`

Optional (default: disabled).

Compatible order types: `limit`.

Toggle IOC mode. When enabled, `limit` orders will only be executed as the taker.

#### Post-Only

Enable: `--post-only`<br>Disable: `--no-post-only`

Optional (default: enabled).

Compatible order types: `limit`.

Toggle Post-Only mode. When enabled, `limit` orders will only be executed as the maker.

#### Retry-Until-Filled

Enable: `--retry`<br>Disable: `--no-retry`

Optional (default: enabled).

Compatible order types: `stop-market`, `trailing-stop`, `take-profit-market`.

Toggle Retry-Until-Filled mode. When enabled, triggered orders that are executed at market will be retried until filled.

#### Rate limit

`--rate-limit <rate limit>`

Optional (default: `6/200`).

Compatible with all order types.

Advanced users only. Order placement rate limit, denoted as request limit per interval (milliseconds) (e.g. `6/200` means 'send a maximum of `6` order placement requests every `200` milliseconds').

Examples: `2/200`, `6/200`, `24/200`.

[Learn more about rate limit overrides](./rate-limit-overrides.md).

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

Authentication required.

Cancel order(s).

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
