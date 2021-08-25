const UPDATE_NOTIFICATIONS = {
  ENABLE: {
    FLAGS: '--update-notifications',
    DESCRIPTION:
      'Enable update notifications. When an update is available, a notification will appear after command execution at most once a day.',
  },
  DISABLE: {
    FLAGS: '--no-update-notifications',
    DESCRIPTION: 'Disable update notifications.',
  },
};

export { UPDATE_NOTIFICATIONS };
