import chalk from 'chalk';

function formatLevel(level, enableColours) {
  const formattedLevel = level.text.toUpperCase().padEnd(5);

  if (!enableColours) {
    return formattedLevel;
  }

  // Level hasn't been assigned a colour.
  if (level.colour == null) {
    return formattedLevel;
  }

  return chalk[level.colour](formattedLevel);
}

function log(level, message, enableColours) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level, enableColours);

  console.log(`${formattedTimestamp}  ${formattedLevel}  ${message}`);
}

const Logger = {
  info(message, { enableColours }) {
    log({ text: 'info' }, message, enableColours);
  },
  error(message, { enableColours }) {
    log({ text: 'error', colour: 'red' }, message, enableColours);
  },
};

export { Logger };
