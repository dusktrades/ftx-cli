import chalk from 'chalk';

function formatLevel(level, options) {
  const formattedLevel = level.text.toUpperCase().padEnd(5);

  // User doesn't want coloured outputs.
  if (!options.global.enableColours) {
    return formattedLevel;
  }

  // Level hasn't been assigned a colour.
  if (level.colour == null) {
    return formattedLevel;
  }

  return chalk[level.colour](formattedLevel);
}

function log(level, message, options) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level, options);

  console.log(`${formattedTimestamp}  ${formattedLevel}  ${message}`);
}

const Logger = {
  info(message, options) {
    log({ text: 'info' }, message, options);
  },
  error(message, options) {
    log({ text: 'error', colour: 'red' }, message, options);
  },
};

export { Logger };
