const REDUCE_ONLY = {
  ENABLE: {
    name: 'reduceOnly',
    FLAGS: '--reduce-only',
    DESCRIPTION:
      'Enable Reduce-Only mode. Orders will only reduce your position.',
    isConfigurable: true,
  },
  DISABLE: {
    FLAGS: '--no-reduce-only',
    DESCRIPTION: 'Disable Reduce-Only mode.',
  },
};

export { REDUCE_ONLY };
