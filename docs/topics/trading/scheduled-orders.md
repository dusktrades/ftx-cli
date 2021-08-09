# Scheduled orders

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
