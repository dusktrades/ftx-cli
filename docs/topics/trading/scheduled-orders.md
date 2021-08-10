# Scheduled orders

A scheduled order is an order which will attempt to be placed at a specific date and time or repeating schedule.

Schedules have the following formats:

- Specific date and time (future ISO date; any timezone): `--schedule YYYY-MM-DDThh:mm:ss`
- Repeating schedule (cron expression; local timezone): `--schedule "* * * * * *"`

Scheduled orders can be used to simulate complex timed-based order types (e.g. Time-of-Day) or repeating investing strategies (e.g. Dollar-Cost Averaging).

```sh
# Market buy 1 BTC/USD on December 25, 2021 at 09:30:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-12-25T09:30:00

# Market buy 2 BTC/USD every Monday at 14:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 2 --schedule "0 14 * * 1"
```

> ℹ️ You can use scheduling with any command to customise its behaviour.
