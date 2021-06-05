function log(level, message) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = level.toUpperCase().padEnd(5);

  console.log(`${formattedTimestamp}  ${formattedLevel}  ${message}`);
}

const Logger = {
  info(message) {
    log('info', message);
  },
  error(message) {
    log('error', message);
  },
};

export { Logger };
