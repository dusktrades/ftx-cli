import { parseChoice } from '../../helpers/parseChoice.js';

const flags = '-e, --exchange <exchange>';

const exchanges = [
  { parsed: 'ftx', options: ['ftx'] },
  { parsed: 'ftx-us', options: ['ftx-us'] },
];

const CHOICES = exchanges.flatMap(({ options }) => options);

function parse(exchange) {
  return parseChoice(
    exchange,
    exchanges,
    `${flags} must be one of: ${CHOICES.join(', ')}`
  );
}

const EXCHANGE = {
  name: 'exchange',
  flags,
  description: 'FTX exchange platform [default: ftx].',
  parser: parse,
  isConfigurable: true,
};

export { EXCHANGE, CHOICES };
