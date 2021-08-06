import { composeOption } from '../../helpers/index.js';

function parse(market) {
  return market.toUpperCase();
}

const CONFIG = {
  FLAGS: '-m, --market <market>',
  DESCRIPTION: 'market symbol',
  PARSER: parse,
};

const MARKET = composeOption(CONFIG);

export { MARKET };
