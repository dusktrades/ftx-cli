const UPDATE_NOTIFICATIONS = {
  ENABLE: {
    name: 'updateNotifications',
    flags: '--update-notifications',
    description:
      'Enable update notifications. When, in table output mode, an update is available: a notification will appear after command execution at most once a day.',
    isConfigurable: true,
  },
  DISABLE: {
    flags: '--no-update-notifications',
    description: 'Disable update notifications.',
  },
};

export { UPDATE_NOTIFICATIONS };
