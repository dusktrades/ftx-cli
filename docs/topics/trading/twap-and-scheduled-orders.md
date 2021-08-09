# TWAP and scheduled orders

## TWAP order

A TWAP order is a [split order](./split-and-scaled-orders.md#split-order) paired with an order duration. The split orders will be spread linearly across the order duration (order interval = order duration / [split count - 1]).

Order durations have the following format: `--duration XhYmZs`

TWAP orders can be used to minimise market impact.

```sh
# Overall order:
#
# Market buy 10 BTC-PERP, split into 5 individual orders, over a duration of 20 minutes.
#
# Order interval = 20 minutes / (5 - 1) = 5 minutes
#
# Timeline:
#
# 1. Now: market buy 2 BTC-PERP.
# 2. After 5 minutes: market buy 2 BTC-PERP.
# 3. After 10 minutes: market buy 2 BTC-PERP.
# 4. After 15 minutes: market buy 2 BTC-PERP.
# 5. After 20 minutes: market buy 2 BTC-PERP.
ftx trade --market btc-perp --side buy --type market --size 10 --split 5 --duration 20m

# Overall order:
#
# Scaled limit buy 40 FTT/USD from $19 to $19.9, split into 10 individual orders, over a duration of 1 minute 30 seconds.
#
# Order interval = 1 minute 30 seconds / (10 - 1) = 10 seconds
#
# Timeline:
#
# 1. Now: limit buy 4 FTT/USD at $19.
# 2. After 10 seconds: limit buy 4 FTT/USD at $19.1.
# 3. After 20 seconds: limit buy 4 FTT/USD at $19.2.
# 4. After 30 seconds: limit buy 4 FTT/USD at $19.3.
# 5. After 40 seconds: limit buy 4 FTT/USD at $19.4.
# 6. After 50 seconds: limit buy 4 FTT/USD at $19.5.
# 7. After 60 seconds: limit buy 4 FTT/USD at $19.6.
# 8. After 70 seconds: limit buy 4 FTT/USD at $19.7.
# 9. After 80 seconds: limit buy 4 FTT/USD at $19.8.
# 10. After 90 seconds: limit buy 4 FTT/USD at $19.9.
ftx trade --market ftt/usd --side buy --type limit --size 40 --split 10 --duration 1m30s
```

![Divider](../../images/divider.png)

## Scheduled order

A scheduled order is an order which will attempt to be placed in full (i.e. without being split) at a given date and time (local timezone) or repeating schedule.

Schedules have the following formats:

- Specific date and time: `--schedule YYYY-MM-DDThh:mm:ss`
- Repeating schedule (cron expression): `--schedule "s m h D M Y"`

Scheduled orders can be used to simulate complex timed-based order types (e.g. Time-of-Day) and repeating investing strategies (e.g. Dollar-Cost Averaging).

```sh
# Market buy 1 BTC/USD on December 25, 2021 at 09:30:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-12-25T09:30:00

# Market buy 2 BTC/USD every Monday at 14:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 2 --schedule "0 14 * * 1"
```

> ℹ️ You can use scheduling with any command to customise its behaviour.
