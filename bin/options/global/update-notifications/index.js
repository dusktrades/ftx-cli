const UPDATE_NOTIFICATIONS = {
  ENABLE: {
    FLAGS: '--update-notifications',
    DESCRIPTION:
      'Enable update notifications. FTX CLI will regularly check for, and notify you of, newly available updates.',
  },
  DISABLE: {
    FLAGS: '--no-update-notifications',
    DESCRIPTION: 'Disable update notifications.',
  },
};

export { UPDATE_NOTIFICATIONS };
