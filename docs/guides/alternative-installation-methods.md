# Alternative installation methods

> ⚠️ This is for advanced users only.

## Contents

- [Versioned npm package](#versioned-npm-package)
- [Build from release source](#build-from-release-source)
- [Build from repository source](#build-from-repository-source)

![Divider](../images/divider.png)

## Versioned npm package

Install a specific version from [npm](https://www.npmjs.com/package/ftx-cli).

```sh
# List available versions.
npm view ftx-cli versions

# Install package globally. Example version: `1.0.0`.
npm install -g ftx-cli@<version>
```

![Divider](../images/divider.png)

## Build from release source

Manually install a specific [GitHub release](https://github.com/dusktrades/ftx-cli/releases).

```sh
# Install package globally. Example version: `v1.0.0`.
npm install -g https://github.com/dusktrades/ftx-cli/archive/refs/tags/<version>.tar.gz
```

![Divider](../images/divider.png)

## Build from repository source

> ⚠️ You should not need to install using this method unless you are actively developing. Source code that is not part of an official release may be unstable.

Manually install the current source code as-is from a repository branch. Here's what that may look like:

```sh
# Clone source code.
git clone https://github.com/dusktrades/ftx-cli

# Enter package directory.
cd ftx-cli

# Install package globally.
npm install -g
```
