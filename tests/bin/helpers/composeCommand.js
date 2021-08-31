function composeCommand(command, options) {
  const optionString = options == null ? '' : ` ${options}`;

  /**
   * Force uncoloured output so we can match output strings without stepping
   * around ANSI colour codes.
   */
  return `node ./bin/cli.js ${command}${optionString} --no-colour`;
}

export { composeCommand };
