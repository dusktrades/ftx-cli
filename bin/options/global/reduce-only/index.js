const REDUCE_ONLY = {
  ENABLE: {
    name: 'reduceOnly',
    flags: '--reduce-only',
    description:
      'Enable Reduce-Only mode. Orders will only reduce your position.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-reduce-only',
    description: 'Disable Reduce-Only mode.',
  },
};

export { REDUCE_ONLY };
