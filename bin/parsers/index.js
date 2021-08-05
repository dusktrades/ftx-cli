import { options } from './options/index.js';

/**
 * Option parsers are static; only values provided as part of user input are
 * parsed, meaning defaults for optional values are not handled here.
 */
const parsers = options;

export { parsers };
