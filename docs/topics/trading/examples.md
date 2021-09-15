# Examples

> ℹ️ These examples assume you are already logged in and are using the default configuration.
>
> ℹ️ These examples are non-exhaustive and are to inspire ideas. FTX CLI exposes many options that can be used as a foundation and combined in endless ways in order to place orders as simple or as complex as you require. If you think something might be possible with FTX CLI but aren't sure how to achieve it, please [join our Discord server](https://discord.gg/v3MW4TeXtZ) and ask.

## Contents

- [Basic order](#basic-order)
- [Split order](#split-order)
- [Scaled order](#scaled-order)
- [TWAP order](#twap-order)
- [Timed placement order](#timed-placement-order)
- [Scheduled order](#scheduled-order)

![Divider](../../images/divider.png)

## Basic order

```sh
# Market buy 1 BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 1

# Market buy $1,000 worth of BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 1k --size-currency quote

# Limit buy 1 BTC-PERP at $10,000.
ftx trade --market btc-perp --side buy --type limit --size 1 --price 10k

# Limit buy $1,000 worth of BTC-PERP at $10,000.
ftx trade --market btc/usd --side buy --type limit --size 1k --size-currency quote --price 10k

# Stop market buy 1 BTC/USD, triggering at $11,000.
ftx trade --market btc/usd --side buy --type stop-market --size 1 --trigger-price 11k

# Stop limit buy $1,000 worth of BTC/USD at $10,000, triggering at $11,000.
ftx trade --market btc/usd --side buy --type stop-limit --size 1k --size-currency quote --price 10k --trigger-price 11k

# Trailing stop buy 1 BTC/USD, trailing by $500.
ftx trade --market btc/usd --side buy --type trailing-stop --size 1 --trail-value 500

# Trailing stop sell $1,000 worth of BTC/USD, trailing by -$500.
ftx trade --market btc/usd --side sell --type trailing-stop --size 1k --size-currency quote --trail-value -500

# Take profit market buy 1 BTC/USD, triggering at $11,000.
ftx trade --market btc/usd --side buy --type take-profit-market --size 1 --trigger-price 11k

# Take profit limit buy $1,000 worth of BTC/USD at $10,000, triggering at $11,000.
ftx trade --market btc/usd --side buy --type take-profit-limit --size 1k --size-currency quote --price 10k --trigger-price 11k
```

## Split order

```sh
# Market buy 1 BTC/USD, split into 2 individual orders.
ftx trade --market btc/usd --side buy --type market --size 1 --split 2

# Limit buy $1,000 worth of BTC/USD at $10,000, split into 3 individual orders.
ftx trade --market btc/usd --side buy --type limit --size 1k --size-currency quote --price 10k --split 3

# Stop market buy 1 BTC/USD, triggering at $11,000, split into 5 individual orders.
ftx trade --market btc/usd --side buy --type stop-market --size 1 --trigger-price 11k --split 5

# Stop limit buy $1,000 worth of BTC/USD at $10,000, triggering at $11,000, split into 10 individual orders.
ftx trade --market btc/usd --side buy --type stop-limit --size 1k --size-currency quote --price 10k --trigger-price 11k --split 10

# Trailing stop buy 1 BTC/USD, trailing by $500, split into 20 individual orders.
ftx trade --market btc/usd --side buy --type trailing-stop --size 1 --trail-value 500 --split 20

# Take profit market buy $1,000 worth of BTC/USD, triggering at $11,000, split into 50 individual orders.
ftx trade --market btc/usd --side buy --type take-profit-market --size 1k --size-currency quote --trigger-price 11k --split 50

# Take profit limit buy 1 BTC/USD at $10,000, triggering at $11,000, split into 100 individual orders.
ftx trade --market btc/usd --side buy --type take-profit-limit --size 1 --price 10k --trigger-price 11k --split 100
```

## Scaled order

```sh
# Limit buy 1 BTC/USD from $9,000 to $10,000, split into 2 individual orders.
#
# Individual order #1: Limit buy 0.5 BTC/USD at $9,000.
# Individual order #2: Limit buy 0.5 BTC/USD at $10,000.
ftx trade --market btc/usd --side buy --type limit --size 1 --price 9k:10k --split 2

# Stop limit buy $1,000 worth of BTC/USD from $9,000 to $10,000, triggering at $11,000, split into 3 individual orders.
#
# Individual order #1: Stop limit buy 0.3333 BTC/USD at $9,000, triggering at $11,000.
# Individual order #2: Stop limit buy 0.3333 BTC/USD at $9,500, triggering at $11,000.
# Individual order #3: Stop limit buy 0.3333 BTC/USD at $10,000, triggering at $11,000.
ftx trade --market btc/usd --side buy --type stop-limit --size 1k --size-currency quote --price 9k:10k --split 3

# Take profit limit buy 1 BTC/USD from $10,000 to $9,000, triggering at $11,000, split into 5 individual orders.
#
# Individual order #1: Take profit limit buy 0.2 BTC/USD at $10,000, triggering at $11,000.
# Individual order #2: Take profit limit buy 0.2 BTC/USD at $9,750, triggering at $11,000.
# Individual order #3: Take profit limit buy 0.2 BTC/USD at $9,500, triggering at $11,000.
# Individual order #4: Take profit limit buy 0.2 BTC/USD at $9,250, triggering at $11,000.
# Individual order #5: Take profit limit buy 0.2 BTC/USD at $9,000, triggering at $11,000.
ftx trade --market btc/usd --side buy --type take-profit-limit --size 1 --price 10k:9k --split 5
```

## TWAP order

```sh
# Market buy 1 BTC/USD, split into 3 individual orders, over a duration of 1 minute 30 seconds.
#
# Individual order #1 (now):                       Market buy 0.3333 BTC/USD.
# Individual order #2 (after 45 seconds):          Market buy 0.3333 BTC/USD.
# Individual order #3 (after 1 minute 30 seconds): Market buy 0.3333 BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 1 --split 3 --duration 1m30s

# Market sell $1,000 worth of BTC/USD, split into 5 individual orders, over a duration of 10 minutes.
#
# Individual order #1 (now):                        Market sell $200 worth of BTC/USD.
# Individual order #2 (after 2 minutes 30 seconds): Market sell $200 worth of BTC/USD.
# Individual order #3 (after 5 minutes):            Market sell $200 worth of BTC/USD.
# Individual order #4 (after 7 minutes 30 seconds): Market sell $200 worth of BTC/USD.
# Individual order #5 (after 10 minutes):           Market sell $200 worth of BTC/USD.
ftx trade --market btc/usd --side sell --type market --size 1 --split 5 --duration 10m

# Market buy 30% of available USD wallet balance, split into 3 individual orders, over a duration of 2 minutes.
#
# Individual order #1 (now):             Market buy 10% of available USD wallet balance worth of BTC/USD.
# Individual order #2 (after 1 minute):  Market buy 10% of available USD wallet balance worth of BTC/USD.
# Individual order #3 (after 2 minutes): Market buy 10% of available USD wallet balance worth of BTC/USD.
ftx trade --market btc/usd --side buy --type market --size 30% --split 3 --duration 2m

# Market sell 30% of available BTC wallet balance, split into 3 individual orders, over a duration of 2 minutes.
#
# Individual order #1 (now):             Market sell 10% of available BTC wallet balance worth of BTC/USD.
# Individual order #2 (after 1 minute):  Market sell 10% of available BTC wallet balance worth of BTC/USD.
# Individual order #3 (after 2 minutes): Market sell 10% of available BTC wallet balance worth of BTC/USD.
ftx trade --market btc/usd --side sell --type market --size 30% --split 3 --duration 2m
```

## Timed placement order

```sh
# Limit buy 1 BTC/USD at $10,000, split into 3 individual orders, over a duration of 1 minute.
#
# Individual order #1 (now):              Limit buy 0.3333 BTC/USD at $10,000.
# Individual order #2 (after 30 seconds): Limit buy 0.3333 BTC/USD at $10,000.
# Individual order #3 (after 1 minute):   Limit buy 0.3333 BTC/USD at $10,000.
ftx trade --market btc/usd --side buy --type limit --size 1 --price 10k --split 3 --duration 1m

# Stop limit buy 1 BTC/USD from $9,000 to $10,000, triggering at $11,000, split into 5 individual orders, over a duration of 1 hour.
#
# Individual order #1 (now):              Stop limit buy 0.2 BTC/USD at $9,000, triggering at $11,000.
# Individual order #2 (after 15 minutes): Stop limit buy 0.2 BTC/USD at $9,250, triggering at $11,000.
# Individual order #3 (after 30 minutes): Stop limit buy 0.2 BTC/USD at $9,500, triggering at $11,000.
# Individual order #4 (after 45 minutes): Stop limit buy 0.2 BTC/USD at $9,750, triggering at $11,000.
# Individual order #5 (after 1 hour):     Stop limit buy 0.2 BTC/USD at $10,000, triggering at $11,000.
ftx trade --market btc/usd --side buy --type stop-limit --size 1 --price 9k:10k --trigger-price 11k --split 5 --duration 1h
```

## Scheduled order

```sh
# Market buy 1 BTC/USD on 1 January 2021 at 00:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --schedule 2021-01-01T00:00:00

# Limit buy $1,000 worth of BTC/USD on 18 February 2021 at 18:30:00 (UTC).
ftx trade --market btc-perp --side sell --type market --size 1k --size-currency quote --schedule 2021-02-18T18:30:00Z

# Custom TWAP buy 1 BTC/USD every day at 00:00:00 (local timezone).
ftx trade --market btc/usd --side buy --type market --size 1 --split 10 --duration 5m --schedule daily
```
