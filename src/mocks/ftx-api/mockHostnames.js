import nock from 'nock';

const hostnamePattern = /ftx\.(com|us)/;

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

const commonRequestHeaders = {
  'user-agent': isValidUserAgent,
  accept: 'application/json',
  'content-type': 'application/json',
  'x-requested-with': 'XMLHttpRequest',
  'ftx-key': 'valid-key',
  'ftx-ts': isValidTimestamp,
  'ftx-sign': isValidSignature,
  'accept-encoding': 'gzip, deflate, br',
};

const noSubaccountRequestHeaders = { ...commonRequestHeaders };

const validSubaccountRequestHeaders = {
  ...commonRequestHeaders,
  'ftx-subaccount': 'valid-subaccount',
};

const invalidSubaccountRequestHeaders = {
  ...commonRequestHeaders,
  'ftx-subaccount': 'invalid-subaccount',
};

const MOCK_HOSTNAME = nock(hostnamePattern).persist();

const MOCK_HOSTNAME_NO_SUBACCOUNT = nock(hostnamePattern, {
  reqheaders: noSubaccountRequestHeaders,
}).persist();

const MOCK_HOSTNAME_VALID_SUBACCOUNT = nock(hostnamePattern, {
  reqheaders: validSubaccountRequestHeaders,
}).persist();

const MOCK_HOSTNAME_INVALID_SUBACCOUNT = nock(hostnamePattern, {
  reqheaders: invalidSubaccountRequestHeaders,
}).persist();

export {
  MOCK_HOSTNAME,
  MOCK_HOSTNAME_NO_SUBACCOUNT,
  MOCK_HOSTNAME_VALID_SUBACCOUNT,
  MOCK_HOSTNAME_INVALID_SUBACCOUNT,
};
