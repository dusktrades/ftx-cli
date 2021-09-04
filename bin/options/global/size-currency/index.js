const SIZE_CURRENCY = {
  name: 'sizeCurrency',
  FLAGS: '--size-currency <source>',
  DESCRIPTION: 'Source currency for calculating size [default: base].',
  CHOICES: ['base', 'quote'],
  isConfigurable: true,
};

export { SIZE_CURRENCY };
