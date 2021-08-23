# Power users

The following examples target Unix-like, macOS, WSL, etc. operating systems.

## Contents

- [Number shorthands](#number-shorthands)
  - [Usage](#usage)
  - [Examples](#examples)
- [Aliases](#aliases)
  - [Usage](#usage-1)
  - [Examples](#examples-1)

![Divider](../images/divider.png)

## Number shorthands

Most number arguments accept shorthand formats, which makes typing large numbers more efficient and accurate. This can be useful for size and price options due to vastly inconsistent denomination across currencies and markets.

### Usage

| Suffix | Aliases | Description                             |
| ------ | ------- | --------------------------------------- |
| `k`    | `K`     | Number will be multiplied by 1,000.     |
| `m`    | `M`     | Number will be multiplied by 1,000,000. |

### Examples

| Shorthand arguments | Expanded argument |
| ------------------- | ----------------- |
| `1k`                | `1000`            |
| `500k`, `0.5m`      | `500000`          |
| `12.34m`            | `12340000`        |
| `-10k`              | `-10000`          |

![Divider](../images/divider.png)

## Aliases

> ⚠️ This guide assumes you are competent with the command line. If you have never used shell aliases before, you may want to find a more beginner-friendly guide.

Aliasing commands with your operating system's native method allows you to assign a personal shortcut to any single command or command sequence. This can be useful on a scale from reducing repetition of your favourite command to creating completely custom behaviours and parameterised syntaxes.

### Usage

---

#### List aliases

```sh
alias
```

---

#### Temporary alias

These can be used in the shell session that they are created in.

```sh
# Create a temporary alias.
alias YOUR_ALIAS="YOUR_COMMAND"

# Remove a temporary alias.
unalias YOUR_ALIAS
```

---

#### Permanent alias

These can be used in any shell session and managed in, or referenced from, your shell configuration file (e.g. `~/.bashrc`).

```sh
# ~/.ftx-cli-aliases
alias YOUR_ALIAS="YOUR_COMMAND"

YOUR_COMPLEX_ALIAS() {
  # Custom script.
}

# ~/.bashrc
source ~/.ftx-cli-aliases
```

---

### Examples

```sh
# Alias the `cancel` command.
#
# Usage: `x [options]`
alias x="ftx cancel"

# Display USD and USDT spot markets, futures markets, and lending rates.
#
# Usage: `stables`
stables() {
  ftx spot --currency usdt
  ftx futures --currency usdt
  ftx rates --currency usd,usdt
}

# Place simultaneous orders:
#
# 1. Market buy <size> BTC-PERP.
# 2. Trailing stop sell <size> BTC-PERP, trailing by -$1,000.
#
# Usage: `mb <size>`
# Example: `mb 1k`
mb() {
  ftx trade --market btc-perp --side buy --type market --size "$1" &
  ftx trade --market btc-perp --side sell --type trailing-stop --size "$1" --trail-value -1k &
}
```
