function convertIsoToUnix(timestamp) {
  return Math.floor(new Date(timestamp).getTime() / 1000);
}

export { convertIsoToUnix };
