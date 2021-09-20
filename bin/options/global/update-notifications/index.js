const UPDATE_NOTIFICATIONS = {
  ENABLE: {
    name: 'updateNotifications',
    FLAGS: '--update-notifications',
    DESCRIPTION:
      'Enable update notifications. When, in table output mode, an update is available: a notification will appear after command execution at most once a day.',
    isConfigurable: true,
  },
  DISABLE: {
    FLAGS: '--no-update-notifications',
    DESCRIPTION: 'Disable update notifications.',
  },
};

export { UPDATE_NOTIFICATIONS };
