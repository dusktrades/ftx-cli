const IOC = {
  ENABLE: {
    name: 'ioc',
    flags: '--ioc',
    description:
      'Enable Immediate-or-Cancel (IOC) mode. Limit orders will only be executed as the taker.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-ioc',
    description: 'Disable Immediate-or-Cancel (IOC) mode.',
  },
};

export { IOC };
