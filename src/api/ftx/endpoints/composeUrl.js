function composeTld(exchange) {
  if (exchange === 'ftx-us') {
    return 'us';
  }

  return 'com';
}

function composeApiUrl(exchange) {
  const tld = composeTld(exchange);

  return `https://ftx.${tld}/api`;
}

function composeUrl(exchange, endpoint) {
  const apiUrl = composeApiUrl(exchange);

  return `${apiUrl}/${endpoint}`;
}

export { composeUrl };
