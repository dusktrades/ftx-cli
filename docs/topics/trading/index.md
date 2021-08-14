# Trading

## Contents

- [`trade`](#trade)
  - [Options](#trade-options)
  - [Examples](#trade-examples)
- [`cancel`](#cancel)
  - [Options](#cancel-options)
  - [Examples](#cancel-examples)
- [Notes](#notes)
- [Resources](#resources)

![Divider](../../images/divider.png)

## `trade`

Place order(s) (authentication required).

```sh
trade [options]
```

### `trade` options

```sh
Required:
  -m, --market <market>      Market symbol (required).
  --side <side>              Order side (required) (choices: buy|b, sell|s).
  -t, --type <type>          Order type (required) (choices: market|m, limit|l, stop-market|sm, stop-limit|sl, trailing-stop|ts, take-profit-market|tpm, take-profit-limit|tpl).
  -s, --size <size>          Total amount of underlying currency to execute (required).

Optional:
  -p, --price <price>        Price or price range that limit orders will be executed at (required for order types: limit, stop-limit, take-profit-limit).
  --trigger-price <price>    Price that triggers stop or take profit orders (required for order types: stop-market, stop-limit, take-profit-market, take-profit-limit).
  --trail-value <value>      Distance the price must move in order to trigger trailing stop orders; positive for buy orders and negative for sell orders (required for order types: trailing-stop).
  --split <count>            Number of orders to split the order size into (default: 1).
  --duration <duration>      Order placement duration which controls the interval between individual TWAP orders in conjunction with the split count (default: 0).
  --[no-]ioc                 Toggle Immediate-or-Cancel (IOC) mode: when enabled, limit orders will only be executed as the taker (default: false).
  --[no-]post-only           Toggle Post-Only mode: when enabled, limit orders will only be executed as the maker (default: true).
  --[no-]reduce-only         Toggle Reduce-Only mode: when enabled, orders will only reduce your position (default: false).
  --[no-]retry               Toggle Retry-Until-Filled mode: when enabled, stop-market, take-profit-market, and trailing-stop orders will retry sending the triggered order until filled (default: true).
  --rate-limit <rate limit>  Order placement rate limit, denoted as request limit per interval (milliseconds) (default: 6/200).
```

> ℹ️ All order types available on the FTX platform are available, alongside some additional advanced order types. [Learn more about advanced order types and associated options.](./advanced-orders.md)
>
> ℹ️ You can save your order mode (IOC, Post-Only, Reduce-Only, Retry-Until-Filled) and rate limit preferences using the `config` command.

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

# Place order: take profit limit buy 10,200 USDTBEAR/USD at $3,100, triggering at $3,000
ftx trade --market usdtbear/usd --side buy --type take-profit-limit --size 10.2k --price 3100 --trigger-price 3000
```

## `cancel`

Cancel order(s) (authentication required).

```sh
cancel [options]
```

### `cancel` options

```sh
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

## Notes

- Market symbols are case-insensitive but must be formatted as they are on the FTX platform (e.g. `btc/usd`, `btc-perp`, `btc-move-0808`). You can find lists of available markets using the `spot` and `futures` commands.

## Resources

- [Article: Advanced Order Types](https://help.ftx.com/hc/en-us/articles/360031896592-Advanced-Order-Types)
- [Article: Reduce-only Orders](https://help.ftx.com/hc/en-us/articles/360030802012-Reduce-only-Orders)
