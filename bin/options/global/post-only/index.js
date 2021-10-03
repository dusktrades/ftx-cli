const POST_ONLY = {
  ENABLE: {
    name: 'postOnly',
    flags: '--post-only',
    description:
      'Enable Post-Only mode. Limit orders will only be executed as the maker.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-post-only',
    description: 'Disable Post-Only mode.',
  },
};

export { POST_ONLY };
