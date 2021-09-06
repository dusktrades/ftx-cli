function getServerTime(options) {
  return {
    ...options,
    subdomain: 'otc',
    rawEndpoint: 'time',
    method: 'get',
  };
}

export { getServerTime };
