function parse(market) {
  return market.toUpperCase();
}

const MARKET = {
  FLAGS: '-m, --market <market>',
  DESCRIPTION: 'market symbol',
  PARSER: parse,
};

export { MARKET };
