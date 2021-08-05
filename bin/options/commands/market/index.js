function parse(market) {
  return market.toUpperCase();
}

const MARKET = ['-m, --market <market>', 'market symbol', parse];

export { MARKET };
