function composeOptionString(command, options) {
  if (options == null) {
    return '';
  }

  return command === 'trade'
    ? ` ${options} --key key --secret secret`
    : ` ${options}`;
}

function composeCommand(command, options) {
  const optionString = composeOptionString(command, options);

  /**
   * Force uncoloured output so we can match output strings without stepping
   * around ANSI colour codes.
   */
  return `node ./bin/cli.js ${command}${optionString} --no-colour`;
}

export { composeCommand };
