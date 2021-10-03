import { Option } from 'commander';

function composeOption(config) {
  // Flags and description are required.
  const option = new Option(config.flags, config.description);

  // Options with argument(s) need to have them parsed.
  if (config.parser != null) {
    option.argParser(config.parser);
  }

  return option;
}

export { composeOption };
