# Order sizing

## Contents

- [Basic size](#basic-size)
- [Relative size](#relative-size)
- [Resources](#resources)

![Divider](../../images/divider.png)

## Basic size

Order(s) will be placed with total size measured in terms of one of the market's currencies.

| Choice  | Aliases | Description                                                                                     |
| ------- | ------- | ----------------------------------------------------------------------------------------------- |
| `base`  | `b`     | **Spot:** measure in base currency terms.<br>**Futures:** measure in underlying currency terms. |
| `quote` | `q`     | **Spot:** Measure in quote currency terms.<br>**Futures:** measure in USD terms.                |

### Examples

```sh
# Place order(s) with total size of 0.0001 in base/underlying currency.
ftx trade <options> --size 0.0001 --size-currency base

# Place order(s) with total size of 10 in base/underlying currency.
ftx trade <options> --size 10 --size-currency base

# Place order(s) with total size of 100,000 in quote currency/USD.
ftx trade <options> --size 100k --size-currency quote

# Place order(s) with total size of 100,100 in quote currency/USD.
ftx trade <options> --size 100.1k --size-currency quote
```

![Divider](../../images/divider.png)

## Relative size

Order(s) will be placed with total size relative to a dynamic size, according to the current account state.

| Choice     | Aliases | Description                                                                                                                       |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `default`  | `d`     | **Spot:** available wallet balance (without borrowing).<br>**Futures:** available collateral (not used by open orders/positions). |
| `position` | `p`     | **Spot:** N/A<br>**Futures:** absolute net position size in given market.                                                         |

### Examples

```sh
# Spot: place order(s) with total size of 50% of available wallet balance.
# Futures: place order(s) with total size of 50% of available collateral.
ftx trade <options> --size 50% --size-hook default

# Spot: place order(s) with total size of 200% of available wallet balance (borrowing excess via spot margin).
# Futures: place order(s) with total size of 200% of available collateral (increasing leverage).
ftx trade <options> --size 200% --size-hook default

# Futures: place order(s) with total size of 50% of net position in given market.
ftx trade <options> --size 50% --size-hook position

# Futures: place order(s) with total size of 200% of net position in given market.
ftx trade <options> --size 200% --size-hook position
```

![Divider](../../images/divider.png)

## Resources

- [Article: Order Limits and Price Bands](https://help.ftx.com/hc/en-us/articles/360027946651-Order-Limits-and-Price-Bands)
