import { parseUppercaseList } from '../../helpers/index.js';

const UNDERLYING = {
  FLAGS: '-u, --underlying <currency>',
  DESCRIPTION: 'Underlying currency symbol(s).',
  PARSER: parseUppercaseList,
};

export { UNDERLYING };
