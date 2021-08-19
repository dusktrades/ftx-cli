import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PACKAGE = require('../../package.json');

export { PACKAGE };
