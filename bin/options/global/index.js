import { API_KEY } from './api-key/index.js';
import { API_SECRET } from './api-secret/index.js';
import { COLOUR } from './colour/index.js';
import { EXCHANGE } from './exchange/index.js';
import { IOC } from './ioc/index.js';
import { ORDER_INTERVAL } from './order-interval/index.js';
import { ORDER_QUOTA } from './order-quota/index.js';
import { POST_ONLY } from './post-only/index.js';
import { REDUCE_ONLY } from './reduce-only/index.js';
import { REPEAT } from './repeat/index.js';
import { RETRY } from './retry/index.js';
import { SUBACCOUNT } from './subaccount/index.js';

// The order here is the order options will appear in help outputs.
const GLOBAL = [
  // Exchange/account options.
  EXCHANGE,
  API_KEY,
  API_SECRET,
  SUBACCOUNT,

  // Behaviour options.
  REPEAT,

  // Trading options.
  IOC.ENABLE,
  IOC.DISABLE,
  POST_ONLY.ENABLE,
  POST_ONLY.DISABLE,
  REDUCE_ONLY.ENABLE,
  REDUCE_ONLY.DISABLE,
  RETRY.ENABLE,
  RETRY.DISABLE,
  ORDER_INTERVAL,
  ORDER_QUOTA,

  // UI customisation options.
  COLOUR.ENABLE,
  COLOUR.DISABLE,
];

export { GLOBAL };
