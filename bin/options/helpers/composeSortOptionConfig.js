function composeSortOptionConfig(choices) {
  return {
    FLAGS: '--sort <sorting method>',
    DESCRIPTION: 'sorting method',
    CHOICES: choices,
  };
}

export { composeSortOptionConfig };
