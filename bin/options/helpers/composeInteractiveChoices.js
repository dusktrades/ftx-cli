function composeInteractiveChoices(choices) {
  return choices.map(({ parsed, human }) => ({
    title: human,
    value: parsed,
  }));
}

export { composeInteractiveChoices };
