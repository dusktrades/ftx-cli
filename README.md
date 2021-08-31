# [![FTX CLI](docs/images/banner.png)](https://github.com/dusktrades/ftx-cli)

> 💱 The power of FTX meets the power of the command line.

[![Version](https://flat.badgen.net/npm/v/ftx-cli?cache=300)](https://www.npmjs.com/package/ftx-cli) [![Node.js](https://flat.badgen.net/npm/node/ftx-cli?cache=300)](https://www.npmjs.com/package/ftx-cli) [![License](https://flat.badgen.net/npm/license/ftx-cli?cache=300)](LICENSE) [![Total downloads](https://flat.badgen.net/npm/dt/ftx-cli?cache=300)](https://www.npmjs.com/package/ftx-cli) [![Discord](https://flat.badgen.net/discord/members/v3MW4TeXtZ?cache=300)](https://discord.gg/v3MW4TeXtZ) [![Twitter](https://flat.badgen.net/twitter/follow/dusktrades?cache=300)](https://twitter.com/dusktrades)

![Demo](docs/images/demo.png)

## Contents

- [Why FTX CLI?](#why-ftx-cli)
- [Installation](#installation)
  - [Try it out](#try-it-out)
  - [Global package](#global-package)
  - [Alternative methods](#alternative-methods)
- [Getting started](#getting-started)
  - [Create API credentials](#create-api-credentials)
  - [Secure API credentials](#secure-api-credentials)
- [Usage](#usage)
  - [Global options](#global-options)
  - [Topics](#topics)
- [FAQ](#faq)
- [Support the project](#support-the-project)
  - [Contribute](#contribute)
  - [Share](#share)
  - [Referral](#referral)
  - [Donate](#donate)
- [Contact](#contact)
- [Disclaimer](#disclaimer)
- [Licence](#licence)

![Divider](docs/images/divider.png)

## Why FTX CLI?

🆓 **Free:** no ads, no trackers, no paid licences, no subscriptions, no added fees.\
📖 **Open source:** _'not your (API) keys, not your coins'._\
🔐 **Self-hosted:** no intermediary servers and no extra downtime; you're in control.\
⚡ **Fast:** place complex orders in the heat of the moment.\
🔌 **Powerful:** try scheduled commands, new advanced orders, auto-compounding lending, and more.\
🎨 **Customisable:** configure the UI and collate exchange data to create custom interfaces.\
👨‍💻 **Extensible:** combine input, output, or behaviour with other CLIs or custom scripts.\
🌍 **Global:** [FTX](https://ftx.com/#a=dusktrades), with or without the [US](https://ftx.us/#a=dusktrades).\
👤 **Multiple accounts:** switch account and subaccount on the fly.

![Divider](docs/images/divider.png)

## Installation

[Node.js](https://nodejs.org/) v14.13.0+ is required. Run the following command to display your installed Node.js version:

```sh
node --version
```

If you are running Node.js v14.13.0 or later, run the following command to install FTX CLI:

```sh
npm install -g ftx-cli
```

If you are running an older version of Node.js, or don't have it installed, please follow the instructions for your operating system.

Once you have installed FTX CLI, run the following command to verify:

```sh
ftx --version
```

### Linux and macOS

> ℹ️ Please follow these instructions if you are running any Unix-like environment (e.g. Linux, macOS, Windows Subsystem for Linux, Git Bash, Cygwin).

Run the following command block to install [nvm](https://github.com/nvm-sh/nvm), latest Node.js LTS, and FTX CLI:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash &&
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" &&
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" &&
nvm install --lts &&
npm install -g ftx-cli
```

### Windows

Download and follow the [latest Node.js LTS Windows installer](https://nodejs.org/en/download/) and then run the following command to install FTX CLI:

```sh
npm install -g ftx-cli
```

### Alternative methods

Advanced users may want to try one of the [alternative installation methods](./docs/guides/alternative-installation-methods.md).

![Divider](docs/images/divider.png)

## Getting started

> ℹ️ Planning on using FTX CLI purely for displaying exchange data? You can ignore this section for now; API credentials (key and secret) are only required for authenticated, account-related parts of the platform, such as trading and lending.

### Create API credentials

1. If you don't have an FTX account yet, [create one](https://ftx.com/#a=dusktrades) ([click here](https://ftx.us/#a=dusktrades) for FTX US)
2. Select 'Main Account' (account-wide) or the specific subaccount that FTX CLI can access:
   - [Subaccounts](https://ftx.com/subaccounts#a=dusktrades) → 'CREATE SUBACCOUNT' or 'Select Account'
3. If you want to margin trade or lend, make sure to enable [spot margin trading](https://help.ftx.com/hc/en-us/articles/360053007671):
   - [Settings](https://ftx.com/profile#a=dusktrades) → Margin → 'ENABLE SPOT MARGIN TRADING'
4. Create your API key and secret:
   - [Settings](https://ftx.com/profile#a=dusktrades) → Api → 'CREATE API KEY'

### Save API credentials

> ⚠️ If your machine is shared or unsecure, it is recommended that you save your API credentials elsewhere instead of using the [`login`](./docs/topics/accounts/README.md#login) command.
>
> ℹ️ API credentials and subaccount names are case-sensitive, as they are used to authenticate with the FTX platform. API credentials can be copy and pasted after you create them, and subaccount names from the [subaccounts page](https://ftx.com/subaccounts#a=dusktrades).

```sh
# Account-wide access (requires API credentials not linked to a specific subaccount).
ftx login --key YOUR_API_KEY --secret YOUR_API_SECRET

# Subaccount-only access.
ftx login --key YOUR_API_KEY --secret YOUR_API_SECRET --subaccount YOUR_SUBACCOUNT
```

### Secure API credentials

Here are some best practices for keeping your API credentials secure:

1. Edit API key permissions to the minimum required for FTX CLI to function properly:
   - Disable 'Read-only'
   - Disable 'Withdrawals enabled'
   - Disable 'Internal transfers enabled'
2. If you know the static IP address(es) you will be using, you can further improve security by whitelisting them:
   - 'WHITELIST IP'

![Divider](docs/images/divider.png)

## Usage

### Global options

You can include these options with any command to modify its behaviour.

```
General:
  -v, --version                  Output the version number.
  -h, --help                     Display help for command.

Platform:
  -e, --exchange <exchange>      FTX exchange platform.

Account:
  -k, --key <key>                FTX API key.
  -x, --secret <secret>          FTX API secret.
  -a, --subaccount <subaccount>  FTX subaccount name.

Behaviour:
  --schedule <schedule>          Schedule command to run at a future date and time or periodically, according to a given interval, until manually aborted.

UI:
  --[no-]colour                  Toggle coloured output.
  --[no-]update-notifications    Toggle update notifications. When enabled and an update is available, a notification will appear after command execution at most once a day.
```

> ℹ️ Inline options take priority over saved credentials (via [`login`](./docs/topics/accounts/README.md#login)) and configuration (via [`config`](./docs/topics/configuration/README.md#config)), meaning you can set your defaults and then override them on a per-command basis where necessary.

---

#### Exchange

```
-e, --exchange <exchange>  FTX exchange platform.
```

Optional (default: `ftx`).

| Choice   |
| -------- |
| `ftx`    |
| `ftx-us` |

---

#### Key

```
-k, --key <key>  FTX API key.
```

Optional.

---

#### Secret

```
-x, --secret <secret>  FTX API secret.
```

Optional.

---

#### Subaccount

```
-a, --subaccount <subaccount>  FTX subaccount name.
```

Optional (default: main account).

---

#### Schedule

```
--schedule <schedule>  Schedule command to run at a future date and time or periodically, according to a given interval, until manually aborted.
```

Optional (default: disabled).

[Learn more about scheduled commands](./docs/guides/scheduled-commands.md).

---

#### Colour

```
--colour     Enable coloured output.
--no-colour  Disable coloured output.
```

Optional (default: enabled).

---

#### Update notifications

```
--update-notifications     Enable update notifications. When an update is available, a notification will appear after command execution at most once a day.
--no-update-notifications  Disable update notifications.
```

Optional (default: enabled).

---

### Topics

Visit the documentation for a topic to learn more about related commands:

- [Accounts](./docs/topics/accounts/README.md)
  - [`login`](./docs/topics/accounts/README.md#login)
  - [`logout`](./docs/topics/accounts/README.md#logout)
  - [`🔐 wallet`](./docs/topics/accounts/README.md#-wallet)
- [Configuration](./docs/topics/configuration/README.md)
  - [`config`](./docs/topics/configuration/README.md#config)
- [Markets](./docs/topics/markets/README.md)
  - [`spot`](./docs/topics/markets/README.md#spot)
  - [`futures`](./docs/topics/markets/README.md#futures)
- [Trading](./docs/topics/trading/README.md)
  - [🔐 `trade`](./docs/topics/trading/README.md#-trade)
  - [🔐 `cancel`](./docs/topics/trading/README.md#-cancel)
- [Lending](./docs/topics/lending/README.md)
  - [`rates`](./docs/topics/lending/README.md#rates)
  - [🔐 `offers`](./docs/topics/lending/README.md#-offers)
  - [🔐 `earnings`](./docs/topics/lending/README.md#-earnings)
  - [🔐 `lend`](./docs/topics/lending/README.md#-lend)
  - [🔐 `stop`](./docs/topics/lending/README.md#-stop)

> ℹ️ You can utilise subaccounts to isolate margin and manage risk.

### Guides

- [Power users](./docs/guides/power-users.md): features aimed at increasing efficiency.
- [Scheduled commands](./docs/guides/scheduled-commands.md): for when now is not the time.

![Divider](docs/images/divider.png)

## FAQ

### Why do I need Node.js v14.13.0+?

FTX CLI runs on Node.js – which is constantly evolving – and v14.13.0 just happens to have a slick, modern feature set that we like (notably: [named imports from CommonJS modules](https://github.com/nodejs/node/pull/35249)) while being LTS, and without the need to transpile or use experimental flags. We could certainly increase backwards compatibility by forgoing some of these built-in features, but we would still have to draw the line somewhere: so why not here? Please let us know about your use case if this is an issue.

### How are my API credentials used?

[See for yourself](https://github.com/dusktrades/ftx-cli/search?q=secret)! TL;DR: FTX CLI only communicates with FTX or FTX US, and your API credentials will be stored on your machine if you decide to [`login`](./docs/topics/accounts/README.md#login).

### Why did I get rate-limited?

It is possible to hit the [rate limits set out by FTX](https://help.ftx.com/hc/en-us/articles/360052595091-Ratelimits-on-FTX) if you attempt to execute large amounts of commands in a short period of time. Slow down!

### What's the screenshot setup?

We use a custom theme on [Carbon](https://carbon.now.sh/) to replicate our favourite terminal: [Hyper](https://hyper.is/) with [Fira Code](https://github.com/tonsky/FiraCode) (font ligatures enabled).

![Divider](docs/images/divider.png)

## Support the project

### Contribute

Please feel free to [create a GitHub issue](https://github.com/dusktrades/ftx-cli/issues/new) or [join our Discord server](https://discord.gg/v3MW4TeXtZ) to report bugs, suggest features, or ask questions.

### Share

Share the project with your friends and followers (here's a free [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fdusktrades%2Fftx-cli&via=dusktrades&text=I%27m%20using%20FTX%20CLI%20to%20trade%20and%20more%20on%20@FTX_Official%21%0A%0A)!).

### Referral

Create an [FTX](https://ftx.com/#a=dusktrades) or [FTX US](https://ftx.us/#a=dusktrades) account using our referral links – as a bonus, you will receive 5% off your trading fees.

### Donate

**BTC:** `bc1q5f323q4399s3plle9t33j7czv5knj90ujyg3ys`\
**ETH/ERC-20:** `0x07324D924CA0C9Fbe933AE7E958e47Dd7d040C4d`\
**SOL/SPL:** `32Jwe936XEN5NEvbWusapYeqwFcuPQkSgCuzduQEkfCV`

![Divider](docs/images/divider.png)

## Contact

[Website](https://dusktrades.com) • [Twitter](https://twitter.com/dusktrades) • [Email](mailto:dusktrades@protonmail.com)

![Divider](docs/images/divider.png)

## Disclaimer

FTX CLI is not affiliated with FTX. Your account(s) and funds are your responsibility. Trading involves a high degree of risk and is not suitable for all persons. FTX CLI is an FTX [External Referral Program](https://help.ftx.com/hc/en-us/articles/360044373831-External-Referral-Programs); we may receive a fraction of the trading fees that are generated by the software (this does not affect the trading fees that you pay).

![Divider](docs/images/divider.png)

## Licence

[MIT](./LICENCE) © [Dusk](https://dusktrades.com)
