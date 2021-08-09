# Split and scaled orders

## Split order

![Split order](../../images/split-order.png)

A split order is an order which will be split into smaller, equal-sized orders. The split count will determine the resulting number of orders post-split.

Split orders can be used with any order type to disguise the order size.

```sh
# Place 3 orders:
#
# 1. Market buy 0.3333 BTC-PERP.
# 2. Market buy 0.3333 BTC-PERP.
# 3. Market buy 0.3333 BTC-PERP.
ftx trade --market btc-perp --side buy --type market --size 1 --split 3

# Place 3 orders:
#
# 1. Stop limit sell 0.3333 BTC-PERP at $11,000, triggering at $10,000.
# 2. Stop limit sell 0.3333 BTC-PERP at $11,000, triggering at $10,000.
# 3. Stop limit sell 0.3333 BTC-PERP at $11,000, triggering at $10,000.
ftx trade --market btc-perp --side sell --type stop-limit --size 1 --price 11k --trigger-price 10k --split 3
```

![Divider](../../images/divider.png)

## Scaled order

![Scaled order](../../images/scaled-order.png)

A scaled order is a split limit order paired with a price range instead of a single price. The split orders will be spread linearly across the price range.

Price ranges have the following format: `--price X:Y`

Compatible order types:

- `limit`
- `stop-limit`
- `take-profit-limit`

Scaled orders can be used to minimise market impact and obtain a better average price when entering or exiting a position.

When scaled orders need to be queued due to rate limits, they will be queued from the first price to the second price in the price range. This effect will be more apparent the slower the account's rate limit and the higher the number of orders being sent in quick succession.

```sh
# Place 5 orders:
#
# 1. Limit buy 0.2 BTC-PERP at $10,000.
# 2. Limit buy 0.2 BTC-PERP at $10,250.
# 3. Limit buy 0.2 BTC-PERP at $10,500.
# 4. Limit buy 0.2 BTC-PERP at $10,750.
# 5. Limit buy 0.2 BTC-PERP at $11,000.
ftx trade --market btc-perp --side buy --type limit --size 1 --price 10k:11k --split 5

# Place 5 orders:
#
# 1. Take profit limit sell 1 BTC-PERP at $140,000.
# 2. Take profit limit sell 1 BTC-PERP at $130,000.
# 3. Take profit limit sell 1 BTC-PERP at $120,000.
# 4. Take profit limit sell 1 BTC-PERP at $110,000.
# 5. Take profit limit sell 1 BTC-PERP at $100,000.
ftx trade --market btc-perp --side sell --type take-profit-limit --size 5 --price 140k:100k --split 5
```

![Divider](../../images/divider.png)

## Notes

It is possible for part of a split or scaled order to be rejected (e.g. connection loss, not enough margin). The current behaviour is to ignore rejected orders and continue, which may result in incomplete orders in some rare cases. We are looking into letting users customise this behaviour (e.g. prompt, ignore, cancel queued orders, cancel queued and placed orders).

FTX trading fees are charged per volume executed and not per trade executed, so multiple smaller orders will incur the same fees as if they were placed as a single large order.
