# Scheduled orders

A scheduled order is an order which will attempt to be placed at a specific date and time or repeating schedule.

Scheduled orders can be used to simulate complex timed-based order types (e.g. Time-of-Day orders) or repeating investing strategies (e.g. Dollar-Cost Averaging).

> ℹ️ You can use scheduling with any command to customise its behaviour.

## Schedule formats

| Name                      | Description                                   | Format(s)                                                                                                                                                        |
| ------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ISO 8601 date             | Schedule to run _at_ a specific date and time | Local: `YYYY-MM-DDThh:mm:ss`<br>UTC: `YYYY-MM-DDThh:mm:ssZ`<br>Full: `YYYY-MM-DDThh:mm:ss±hh:mm`                                                                 |
| Cron expression/shorthand | Schedule to run at _every_ time period        | Shorthand options:<br><br>`every-second`<br>`every-minute`<br>`hourly`<br>`daily`<br>`weekly`<br>`monthly`<br>`quarterly`<br>`yearly`<br><br>Full: `* * * * * *` |

## Schedule examples

```sh
# Market buy 1 BTC/USD on December 25, 2021 at 09:30:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-12-25T09:30:00

# Market buy 1 BTC/USD on December 25, 2021 at 09:30:00 (UTC).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-12-25T09:30:00Z

# Market buy 1 BTC/USD on December 25, 2021 at 09:30:00 (PST [UTC-08:00]).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-12-25T09:30:00−08:00

# Market buy 1 BTC/USD every day at 00:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule daily

# Market buy 1 BTC/USD every Monday at 14:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule "0 14 * * 1"
```

## Schedule resources

- [ISO 8601 wiki](https://en.wikipedia.org/wiki/ISO_8601)
- [ISO 8601 playground](https://www.timestamp-converter.com/)
- [Cron wiki](https://en.wikipedia.org/wiki/Cron)
- [Cron playground](https://crontab.guru/)
