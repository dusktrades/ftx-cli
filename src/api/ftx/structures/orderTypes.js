const ORDER_TYPES = {
  // Market order.
  market: {
    optionArgument: 'market',
    apiArgument: 'market',
    executionType: 'market',
  },

  // Limit order.
  limit: {
    optionArgument: 'limit',
    apiArgument: 'limit',
    executionType: 'limit',
    additionalRequiredOptions: new Set(['price']),
  },

  // Stop market order.
  'stop-market': {
    optionArgument: 'stop-market',
    apiArgument: 'stop',
    executionType: 'market',
    additionalRequiredOptions: new Set(['triggerPrice']),
  },

  // Stop limit order.
  'stop-limit': {
    optionArgument: 'stop-limit',
    apiArgument: 'stop',
    executionType: 'limit',
    additionalRequiredOptions: new Set(['price', 'triggerPrice']),
  },

  // Trailing stop order.
  'trailing-stop': {
    optionArgument: 'trailing-stop',
    apiArgument: 'trailingStop',
    executionType: 'market',
    additionalRequiredOptions: new Set(['trailValue']),
  },

  // Take profit market order.
  'take-profit-market': {
    optionArgument: 'take-profit-market',
    apiArgument: 'takeProfit',
    executionType: 'market',
    additionalRequiredOptions: new Set(['triggerPrice']),
  },

  // Take profit limit order.
  'take-profit-limit': {
    optionArgument: 'take-profit-limit',
    apiArgument: 'takeProfit',
    executionType: 'limit',
    additionalRequiredOptions: new Set(['price', 'triggerPrice']),
  },
};

function requiresOption(type, option) {
  return ORDER_TYPES[type].additionalRequiredOptions?.has(option) ?? false;
}

export { ORDER_TYPES, requiresOption };
