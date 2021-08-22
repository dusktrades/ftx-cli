# Accounts

## Contents

- [`login`](#login)
  - [Options](#options)
  - [Examples](#examples)
  - [Resources](#resources)
- [`logout`](#logout)

![Divider](../../images/divider.png)

## `login`

> ⚠️ If your machine is shared or unsecure, it is recommended that you save your API credentials elsewhere instead of using this command.

```sh
ftx login [options]  Save FTX API credentials on your machine. Previously saved credentials will be overwritten.
```

> ℹ️ Please refer to [Getting started](../../../README.md#getting-started) for instructions on creating and securing your API credentials.

### Options

```
-k, --key <key>                FTX API key.
-x, --secret <secret>          FTX API secret.
-a, --subaccount <subaccount>  FTX subaccount name.
```

---

#### Key

```
-k, --key <key>  FTX API key.
```

Required.

---

#### Secret

```
-x, --secret <secret>  FTX API secret.
```

Required.

---

#### Subaccount

```
-a, --subaccount <subaccount>  FTX subaccount name.
```

Optional (default: main account).

---

### Examples

```sh
# Save API credentials.
ftx login --key API_KEY --secret API_SECRET

# Save API credentials and subaccount.
ftx login --key API_KEY --secret API_SECRET --subaccount SUBACCOUNT
```

### Resources

- [Article: Subaccounts](https://help.ftx.com/hc/en-us/articles/360030861532-Subaccounts)

![Divider](../../images/divider.png)

## `logout`

```sh
ftx logout  Remove FTX API credentials from your machine.
```
