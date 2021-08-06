import { composeCommand } from '../composeCommand.js';

// eslint-disable-next-line no-underscore-dangle
const _CONFIG = {
  NAME: 'config',
  DESCRIPTION: 'store option preferences locally',
};

const CONFIG = composeCommand(_CONFIG);

export { CONFIG };
