function isValidUserAgent(userAgent) {
  return /^ftx-cli@(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/.test(
    userAgent
  );
}

function isValidTimestamp(timestamp) {
  const parsedTimestamp = Number.parseInt(timestamp, 10);

  return typeof parsedTimestamp === 'number' && !Number.isNaN(parsedTimestamp);
}

function isValidSignature(signature) {
  return typeof signature === 'string';
}

const COMMON_REQUEST_HEADERS = {
  'user-agent': isValidUserAgent,
  accept: 'application/json',
  'content-type': 'application/json',
  'x-requested-with': 'XMLHttpRequest',
  'ftx-ts': isValidTimestamp,
  'ftx-sign': isValidSignature,
  'accept-encoding': 'gzip, deflate, br',
};

export { COMMON_REQUEST_HEADERS };
