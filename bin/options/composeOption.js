import { Option } from 'commander';

function composeOption(config, isRequired = false) {
  // Flags and description are required.
  const option = new Option(config.FLAGS, config.DESCRIPTION);

  /**
   * Options where the argument is a simple 'one-of-list' do not require custom
   * parsers.
   */
  if (config.CHOICES != null) {
    option.choices(config.CHOICES);
  }

  /**
   * Option parsers are static; only values provided as part of user input are
   * parsed, meaning defaults for optional values are not handled here.
   */
  if (config.PARSER != null) {
    option.argParser(config.PARSER);
  }

  if (config.DEFAULT != null) {
    option.default(config.DEFAULT);
  }

  if (isRequired) {
    option.makeOptionMandatory();
  }

  return option;
}

export { composeOption };
