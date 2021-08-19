const IOC = {
  ENABLE: {
    FLAGS: '--ioc',
    DESCRIPTION:
      'Enable Immediate-or-Cancel (IOC) mode. Limit orders will only be executed as the taker.',
  },
  DISABLE: {
    FLAGS: '--no-ioc',
    DESCRIPTION: 'Disable Immediate-or-Cancel (IOC) mode.',
  },
};

export { IOC };
