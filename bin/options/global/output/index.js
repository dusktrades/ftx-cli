import { parseChoice } from '../../helpers/parseChoice.js';

const flags = '-o, --output <format>';

const outputs = [
  { parsed: 'table', options: ['table'] },
  { parsed: 'json', options: ['json'] },
];

const CHOICES = outputs.flatMap(({ options }) => options);

function parse(output) {
  return parseChoice(
    output,
    outputs,
    `${flags} must be one of: ${CHOICES.join(', ')}`
  );
}

const OUTPUT = {
  name: 'output',
  flags,
  description: 'Output format [default: table].',
  parser: parse,
  isConfigurable: true,
};

export { OUTPUT, CHOICES };
