const POST_ONLY = {
  ENABLE: {
    name: 'postOnly',
    FLAGS: '--post-only',
    DESCRIPTION:
      'Enable Post-Only mode. Limit orders will only be executed as the maker.',
    isConfigurable: true,
  },
  DISABLE: {
    FLAGS: '--no-post-only',
    DESCRIPTION: 'Disable Post-Only mode.',
  },
};

export { POST_ONLY };
