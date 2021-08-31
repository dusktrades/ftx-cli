# Accounts

## Contents

- [`login`](#login)
  - [Options](#options)
  - [Examples](#examples)
  - [Resources](#resources)
- [`logout`](#logout)
- [`🔐 wallet`](#-wallet)

![Divider](../../images/divider.png)

## `login`

> ⚠️ If your machine is shared or unsecure, it is recommended that you save your API credentials elsewhere instead of using this command.
>
> ℹ️ Please refer to the [getting started section](../../../README.md#getting-started) for instructions on creating and securing your API credentials.

```
ftx login <options>                     Save FTX API credentials and subaccount locally.

Options:
-k, --key <key>                         FTX API key.
-x, --secret <secret>                   FTX API secret.
-a, --subaccount (<subaccount> | main)  FTX subaccount name [default: main].
```

### Examples

#### Account-wide access

```sh
# Save API credentials.
ftx login --key YOUR_API_KEY --secret YOUR_API_SECRET

# Save API credentials and subaccount.
ftx login --key YOUR_API_KEY --secret YOUR_API_SECRET --subaccount YOUR_SUBACCOUNT

# Change to main account.
ftx login --subaccount main

# Change to subaccount.
ftx login --subaccount YOUR_SUBACCOUNT
```

#### Subaccount-only access

```sh
# Save API credentials and subaccount.
ftx login --key YOUR_API_KEY --secret YOUR_API_SECRET --subaccount YOUR_SUBACCOUNT
```

### Resources

- [Article: Subaccounts](https://help.ftx.com/hc/en-us/articles/360030861532-Subaccounts)

![Divider](../../images/divider.png)

## `logout`

```
ftx logout  Remove local FTX API credentials and subaccount.
```

![Divider](../../images/divider.png)

## 🔐 `wallet`

```sh
ftx wallet [options]  Display wallet balances.
```

### Options

```
--sort <method>  Sorting method.
```

---

#### Sort

```
--sort <method>  Sorting method.
```

Optional (default: `currency`).

| Choice                        | Aliases | Description                                               |
| ----------------------------- | ------- | --------------------------------------------------------- |
| `currency`                    | `c`     | Sort by currency symbol (A-Z).                            |
| `available-with-borrowing`    | `awb`   | Sort by available balance including borrowing (high-low). |
| `available-without-borrowing` | `awob`  | Sort by available balance excluding borrowing (high-low). |
| `borrowed`                    | `b`     | Sort by borrowed balance (high-low).                      |
| `total`                       | `t`     | Sort by total balance (high-low).                         |
| `total-usd`                   | `u`     | Sort by total balance (USD) (high-low).                   |

---

### Examples

```sh
# Display wallet balances.
ftx wallet

# Display wallet balances, sorted by total balance (USD).
ftx wallet --sort total-usd
```
