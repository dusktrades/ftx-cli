function parse(market) {
  return market.toUpperCase();
}

const MARKET = {
  name: 'market',
  flags: '-m, --market <market>',
  description: 'Market name.',
  parser: parse,
};

export { MARKET };
