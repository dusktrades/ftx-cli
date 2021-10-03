function validateAnswer(answer, parse) {
  try {
    return Boolean(parse(answer));
  } catch ({ message }) {
    return message;
  }
}

export { validateAnswer };
