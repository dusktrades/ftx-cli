# Scheduled commands

> ⚠️ Please remember that FTX CLI is self-hosted. The machine that you are using to run scheduled commands must remain powered on and capable of communicating with FTX. For short-running commands, any machine (e.g. PC) will suffice. For long-running commands (i.e. expected to run for more than 1 day), we recommend robuster infrastructure (e.g. installing FTX CLI on a hosted VM, or local server, and using a process manager such as [PM2](https://pm2.keymetrics.io/)).

A scheduled command is a command that is scheduled to run at a future date and time or periodically, according to a given interval, until manually aborted.

## Contents

- [Usage](#usage)
  - [Date and time](#date-and-time)
  - [Recurring](#recurring)
- [Examples](#examples)

## Usage

### Date and time

```
--schedule <ISO 8601 timestamp>  Schedule to run at a future date and time.
```

| Type                | Argument format             |
| ------------------- | --------------------------- |
| Local timezone      | `YYYY-MM-DDThh:mm:ss`       |
| UTC (exchange time) | `YYYY-MM-DDThh:mm:ssZ`      |
| UTC offset          | `YYYY-MM-DDThh:mm:ss±hh:mm` |

- [ISO 8601 standard](https://www.iso.org/iso-8601-date-and-time-format.html)
- [ISO 8601 wiki](https://en.wikipedia.org/wiki/ISO_8601)
- [ISO 8601 playground](https://www.timestamp-converter.com/)

### Recurring

```
--schedule <cron [expression|shorthand]>  Schedule to run periodically, according to a given interval, until aborted.
```

#### Cron expression

| Argument format | Description                      |
| --------------- | -------------------------------- |
| `* * * * *`     | Minute-level interval precision. |
| `* * * * * *`   | Second-level interval precision. |

#### Cron shorthand

| Argument       | Description                     |
| -------------- | ------------------------------- |
| `every-second` | Run at every new second.        |
| `every-minute` | Run at every new minute.        |
| `hourly`       | Run at every new hour.          |
| `daily`        | Run at every new day.           |
| `weekly`       | Run at every new week (Monday). |
| `monthly`      | Run at every new month.         |
| `quarterly`    | Run at every new quarter.       |
| `yearly`       | Run at every new year.          |

- [Cron wiki](https://en.wikipedia.org/wiki/Cron)
- [Cron playground](https://crontab.guru/)

## Examples

```sh
# Schedule to run on 1 January 2021 at 00:00:00 (local timezone).
... --schedule 2021-01-01T00:00:00

# Schedule to run on 18 February 2021 at 18:30:00 (UTC).
... --schedule 2021-02-18T18:30:00Z

# Schedule to run on 25 December 2021 at 07:46:39 (PST [UTC-08:00]).
... --schedule 2021-12-25T07:46:39−08:00

# Schedule to run every day at 00:00:00 (local timezone).
... --schedule daily

# Schedule to run every Wednesday at 19:45:00 (local timezone) in August.
... --schedule "45 19 * 8 3"
```
