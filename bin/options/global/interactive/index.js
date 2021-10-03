const INTERACTIVE = {
  ENABLE: {
    name: 'interactive',
    flags: '--interactive',
    description:
      'Enable interactive mode. If the command supports interactive mode, prompts will guide you through its usage.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-interactive-mode',
    description: 'Disable interactive mode.',
  },
};

export { INTERACTIVE };
