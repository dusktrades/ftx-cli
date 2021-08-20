function parse(market) {
  return market.toUpperCase();
}

const MARKET = {
  FLAGS: '-m, --market <market>',
  DESCRIPTION: 'Market name.',
  PARSER: parse,
};

export { MARKET };
