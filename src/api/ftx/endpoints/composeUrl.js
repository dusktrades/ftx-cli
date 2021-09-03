function composeSubdomainString(subdomain) {
  return subdomain == null ? '' : `${subdomain}.`;
}

function composeTld(exchange) {
  return exchange === 'ftx-us' ? 'us' : 'com';
}

function composeApiUrl(subdomain, exchange) {
  const subdomainString = composeSubdomainString(subdomain);
  const tld = composeTld(exchange);

  return `https://${subdomainString}ftx.${tld}/api`;
}

function composeUrl({ subdomain, exchange, endpoint }) {
  const apiUrl = composeApiUrl(subdomain, exchange);

  return `${apiUrl}/${endpoint}`;
}

export { composeUrl };
