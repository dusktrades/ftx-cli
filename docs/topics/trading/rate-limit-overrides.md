# Rate limit overrides

> ⚠️ This is for advanced users only. Please use responsibly; abusing rate limits may result in penalties imposed on your FTX account(s).

The rate limit can be overridden to change the effective speed that order placement requests are sent.

Rate limits have the following format: `--rate-limit X/Y`

The default rate limit is 6 order placement requests per 200ms (`6/200`), which allows most accounts (Tier 1-5) to place orders quickly without many rejections under normal exchange load.

If a request hits the FTX platform rate limit (e.g. unstable connection, high exchange load) then it is rejected and will be requeued with increased priority until it is accepted.

It is recommended that you only override the rate limit under certain circumstances:

- There is a higher rate limit on your account(s), allowing you to send order placement requests quicker (e.g. Tier 6, VIP, MM)
- FTX have changed their rate limits and you don't want to update to the latest version of this package, therefore the default rate limit may no longer be optimal

## Speed-critical strategies

Overriding the rate limit with a setting that is faster than the rate limit linked to your FTX account(s) may result in increased order placement speed, however the network will be busier as it has to handle more request rejections/retries.

## Resources

- [Ratelimits on FTX (Article)](https://help.ftx.com/hc/en-us/articles/360052595091-Ratelimits-on-FTX)
