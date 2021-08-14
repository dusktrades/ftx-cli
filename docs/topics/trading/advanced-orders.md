# Advanced orders

## Contents

- [Split order](#split-order)
  - [Usage](#split-order-usage)
  - [Examples](#split-order-examples)
- [Scaled order](#scaled-order)
  - [Usage](#scaled-order-usage)
  - [Examples](#scaled-order-examples)
- [TWAP order](#twap-order)
  - [Usage](#twap-order-usage)
  - [Examples](#twap-order-examples)
- [Scheduled order](#scheduled-order)
  - [Usage](#scheduled-order-usage)
  - [Examples](#scheduled-order-examples)
  - [Resources](#scheduled-order-resources)
- [Notes](#notes)

![Divider](../../images/divider.png)

## Split order

![Split order](../../images/split-order.png)

A split order is an order which will be split into smaller, equal-sized orders. The split count will determine the resulting number of orders post-split.

Split orders can be used with any order type to disguise the order size.

### Split order usage

Split counts have the following format: `--split X`

### Split order examples

```sh
# Overall order:
#
# Market buy 1 BTC-PERP, split into 3 individual orders.
#
# Queued individual orders:
#
# 1. Market buy 0.3333 BTC-PERP.
# 2. Market buy 0.3333 BTC-PERP.
# 3. Market buy 0.3333 BTC-PERP.
ftx trade --market btc-perp --side buy --type market --size 1 --split 3

# Overall order:
#
# Stop limit sell 1 BTC-PERP, split into 3 individual orders.
#
# Queued individual orders:
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

Scaled orders can be used to minimise market impact or obtain a better average price when entering or exiting a position.

When scaled orders need to be queued due to rate limits, they will be queued from the first price to the second price in the price range. This effect will be more apparent the slower the account's rate limit and the higher the number of orders being sent in quick succession, and can be used to prioritise order placement sequence.

### Scaled order usage

Price ranges have the following format: `--price X:Y`

Compatible order types:

- `limit`
- `stop-limit`
- `take-profit-limit`

### Scaled order examples

```sh
# Overall order:
#
# Limit buy 30 BTC-PERP from $10,000 to $11,000.
#
# Queued individual orders:
#
# 1. Limit buy 10 BTC-PERP at $10,000.
# 2. Limit buy 10 BTC-PERP at $10,500.
# 3. Limit buy 10 BTC-PERP at $11,000.
ftx trade --market btc-perp --side buy --type limit --size 30 --price 10k:11k --split 3

# Overall order:
#
# Take profit limit sell 30 BTC-PERP from $140,000 to $100,000.
#
# Queued individual orders:
#
# 1. Take profit limit sell 10 BTC-PERP at $140,000.
# 2. Take profit limit sell 10 BTC-PERP at $120,000.
# 3. Take profit limit sell 10 BTC-PERP at $100,000.
ftx trade --market btc-perp --side sell --type take-profit-limit --size 30 --price 140k:100k --split 3
```

![Divider](../../images/divider.png)

## TWAP order

A TWAP order is a split order paired with a placement duration. The split orders will be spread linearly across the placement duration (placement interval = placement duration / [split count - 1]).

TWAP orders can be used to minimise market impact or increase the seriality/predictability of order placement sequence.

### TWAP order usage

Placement durations have the following format: `--duration XhYmZs`

### TWAP order examples

```sh
# Overall order:
#
# Market buy 30 BTC-PERP, split into 3 individual orders, over a duration of 20 minutes.
#
# Order interval = 20 minutes / (3 - 1) = 10 minutes
#
# Timeline:
#
# 1. Now:                        Market buy 10 BTC-PERP.
# 2. After 10 minutes:           Market buy 10 BTC-PERP.
# 3. After 20 minutes:           Market buy 10 BTC-PERP.
ftx trade --market btc-perp --side buy --type market --size 30 --split 3 --duration 20m

# Overall order:
#
# Limit buy 30 BTC-PERP from $19 to $19.2, split into 3 individual orders, over a duration of 1 minute 30 seconds.
#
# Order interval = 1 minute 30 seconds / (3 - 1) = 45 seconds
#
# Timeline:
#
# 1. Now:                        Limit buy 10 BTC-PERP at $19.
# 2. After 45 seconds:           Limit buy 10 BTC-PERP at $19.1.
# 3. After 1 minute 30 seconds:  Limit buy 10 BTC-PERP at $19.2.
ftx trade --market btc-perp --side buy --type limit --size 30 --split 3 --duration 1m30s
```

![Divider](../../images/divider.png)

## Scheduled order

A scheduled order is an order which will attempt to be placed at a specific date and time or repeating schedule.

Scheduled orders can be used to simulate complex timed-based order types (e.g. Time-of-Day orders) or repeating investing strategies (e.g. Dollar-Cost Averaging).

> ℹ️ You can use scheduling with any command.

### Scheduled order usage

Schedules are formatted `--schedule <schedule>`, where `<schedule>` matches one of the following formats:

| Name                      | Description                                   | Format(s)                                                                                                                                                        |
| ------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ISO 8601 date             | Schedule to run _at_ a specific date and time | Local: `YYYY-MM-DDThh:mm:ss`<br>UTC: `YYYY-MM-DDThh:mm:ssZ`<br>Full: `YYYY-MM-DDThh:mm:ss±hh:mm`                                                                 |
| Cron expression/shorthand | Schedule to run at _every_ time period        | Shorthand options:<br><br>`every-second`<br>`every-minute`<br>`hourly`<br>`daily`<br>`weekly`<br>`monthly`<br>`quarterly`<br>`yearly`<br><br>Full: `* * * * * *` |

### Scheduled order examples

```sh
# Market buy 1 BTC-PERP on December 25, 2021 at 09:30:00 (local timezone).
ftx trade --market btc-perp --side buy --type market --size 1 --schedule 2021-12-25T09:30:00

# Market buy 1 BTC-PERP on December 25, 2021 at 09:30:00 (UTC).
ftx trade --market btc-perp --side buy --type market --size 1 --schedule 2021-12-25T09:30:00Z

# Market buy 1 BTC-PERP on December 25, 2021 at 09:30:00 (PST [UTC-08:00]).
ftx trade --market btc-perp --side buy --type market --size 1 --schedule 2021-12-25T09:30:00−08:00

# Market buy 1 BTC-PERP every day at 00:00:00 (local timezone).
ftx trade --market btc-perp --side buy --type market --size 1 --schedule daily

# Market buy 1 BTC-PERP every Monday at 14:00:00 (local timezone).
ftx trade --market btc-perp --side buy --type market --size 1 --schedule "0 14 * * 1"
```

### Scheduled order resources

- [ISO 8601 wiki](https://en.wikipedia.org/wiki/ISO_8601)
- [ISO 8601 playground](https://www.timestamp-converter.com/)
- [Cron wiki](https://en.wikipedia.org/wiki/Cron)
- [Cron playground](https://crontab.guru/)

![Divider](../../images/divider.png)

## Notes

It is possible for part of an advanced order to be rejected (e.g. connection loss, not enough margin). The current behaviour is to ignore rejected orders and continue, which may result in incomplete orders in some rare cases. We are looking into letting users customise this behaviour (e.g. prompt, ignore, cancel queued orders, cancel queued and placed orders).

The sequence in which orders are placed cannot be guaranteed for split or scaled orders, as FTX CLI favours speed instead (i.e. sending orders in parallel as early as possible). TWAP orders can be used to increase seriality/predictability.

FTX trading fees are charged per volume executed and not per trade executed, so multiple smaller orders will incur the same fees as if they were placed as a single large order.
