function composeSortOptionConfig(choices) {
  return {
    FLAGS: '--sort <method>',
    DESCRIPTION: 'Sorting method.',
    CHOICES: choices,
  };
}

export { composeSortOptionConfig };
