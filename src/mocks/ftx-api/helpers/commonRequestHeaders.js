function isValidUserAgent(userAgent) {
  return /^ftx-cli@(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/.test(
    userAgent
  );
}

const COMMON_REQUEST_HEADERS = {
  'user-agent': isValidUserAgent,
  accept: 'application/json',
  'content-type': 'application/json',
  'x-requested-with': 'XMLHttpRequest',

  // TODO: Fix authentication headers.
  'accept-encoding': 'gzip, deflate, br',
};

export { COMMON_REQUEST_HEADERS };
