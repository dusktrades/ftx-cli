import { parseUppercaseList } from '../../helpers/index.js';

const UNDERLYING = {
  name: 'underlying',
  flags: '-u, --underlying <currency>',
  description: 'Underlying currency symbol(s).',
  parser: parseUppercaseList,
};

export { UNDERLYING };
