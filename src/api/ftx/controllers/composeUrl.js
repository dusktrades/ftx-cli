function composeUrl(endpoint, exchange) {
  // If exchange is somehow not 'ftx' or 'ftx-us', fall back to '.com' TLD.
  const FTX_API_TLD = exchange === 'ftx-us' ? 'us' : 'com';
  const FTX_API_URL = `https://ftx.${FTX_API_TLD}/api`;

  return `${FTX_API_URL}/${endpoint}`;
}

export { composeUrl };
