import { promisify } from 'util';

const sleep = promisify(setTimeout);

export { sleep };
