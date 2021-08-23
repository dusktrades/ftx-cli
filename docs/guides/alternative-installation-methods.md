# Alternative installation methods

> ⚠️ This is for advanced users only.

The following examples target Unix-like, macOS, WSL, etc. operating systems.

## Contents

- [Versioned global package](#versioned-global-package)
- [Build from release source](#build-from-release-source)
- [Build from repository source](#build-from-repository-source)

![Divider](../images/divider.png)

## Versioned global package

Install a specific version of the package from npm.

```sh
# List available versions.
npm view ftx-cli versions

# Install package globally. Example version: `1.0.0`.
npm install -g ftx-cli@<version>
```

![Divider](../images/divider.png)

## Build from release source

Download, install, and update the package manually from a [release](https://github.com/dusktrades/ftx-cli/releases). Here's what that may look like:

```sh
# Download release gzipped tarball. Example version: `v1.0.0`.
wget https://github.com/dusktrades/ftx-cli/archive/refs/tags/<version>.tar.gz

# Install package globally.
npm install -g ./<version>.tar.gz
```

![Divider](../images/divider.png)

## Build from repository source

> ⚠️ You should not need to install using this method unless you are actively developing. Source code that is not part of an official release may be unstable.

Download, install, and update the package manually directly from the repository. Here's what that may look like:

```sh
# Clone source code.
git clone https://github.com/dusktrades/ftx-cli

# Enter the package directory.
cd ftx-cli

# Install package globally.
npm install -g

# When it's time to update: pull the updated source code and reinstall.
git pull
npm install -g
```
