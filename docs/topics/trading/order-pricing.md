# Order pricing

## Contents

- [Basic price](#basic-price)
- [Scaled price](#scaled-price)
- [Relative price](#relative-price)
  - [Static hook](#static-hook)
  - [Dynamic hook](#dynamic-hook)
- [Resources](#resources)

![Divider](../../images/divider.png)

## Basic price

Order(s) will be placed at a single, basic limit price.

### Examples

```sh
# Place order(s) at 0.0001.
ftx trade [options] --price 0.0001

# Place order(s) at 10.
ftx trade [options] --price 10

# Place order(s) at 100,000.
ftx trade [options] --price 100k

# Place order(s) at 100,100.
ftx trade [options] --price 100.1k
```

![Divider](../../images/divider.png)

## Scaled price

![Scaled order](../../images/scaled-order.png)

Split orders will be spread linearly and placed across a price range.

Orders will be queued from the first price to the second price in the range, which can be used to prioritise the placement sequence of individual orders.

Scaled orders can be used to minimise market impact or obtain a better average position entry or exit.

### Examples

```sh
# Place 3 individual orders from 0.0001 to 0.001.
ftx trade [options] --price 0.0001:0.001 --split 3

# Place 3 individual orders from 10 to 11.
ftx trade [options] --price 10:11 --split 3

# Place 3 individual orders from 100,000 to 110,000.
ftx trade [options] --price 100k:110k --split 3

# Place 3 individual orders from 100,200 to 100,100.
ftx trade [options] --price 100.2k:100.1k --split 3
```

![Divider](../../images/divider.png)

## Relative price

Order(s) will be placed at a single limit price relative to a hook.

> ⚠️ Relative prices cannot currently be used with price ranges.

### Static hook

Order(s) will be placed relative to a [basic price](#basic-price).

These can be used with piping to create custom price hooks.

#### Examples

```sh
# Place order(s) at 10 above 1,000.
ftx trade [options] --price +10 --price-hook 1k

# Place order(s) at 10 below 1,000.
ftx trade [options] --price -10 --price-hook 1k

# Place order(s) at 10% above 11,000.
ftx trade [options] --price +10% --price-hook 11k

# Place order(s) at 10% below 11,000.
ftx trade [options] --price -10% --price-hook 11k
```

### Dynamic hook

Order(s) will be placed relative to a dynamic price, according to the current market state.

> ⚠️ Time-based orders (e.g. timed split limit) are not currently supported in an intuitive way: the price hook is only calculated at the beginning of order placement, so subsequent individual order prices will be calculated using stale data.

| Choice   | Aliases | Description                    |
| -------- | ------- | ------------------------------ |
| `market` | `m`     | Market's current market price. |
| `last`   | `l`     | Market's current last price.   |
| `bid`    | `b`     | Market's current bid price.    |
| `ask`    | `a`     | Market's current ask price.    |

#### Examples

```sh
# Place order(s) at 10 above the current market price.
ftx trade [options] --price +10 --price-hook market

# Place order(s) at 10 below the current last price.
ftx trade [options] --price -10 --price-hook last

# Place order(s) at 10% above the current bid price.
ftx trade [options] --price +10% --price-hook bid

# Place order(s) at 10% below the current ask price.
ftx trade [options] --price -10% --price-hook ask
```

![Divider](../../images/divider.png)

## Resources

- [Article: Order Limits and Price Bands](https://help.ftx.com/hc/en-us/articles/360027946651-Order-Limits-and-Price-Bands)
