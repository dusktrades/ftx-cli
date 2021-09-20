import { API_KEY } from './api-key/index.js';
import { API_SECRET } from './api-secret/index.js';
import { COLOUR } from './colour/index.js';
import { EXCHANGE } from './exchange/index.js';
import { IOC } from './ioc/index.js';
import { OUTPUT } from './output/index.js';
import { POST_ONLY } from './post-only/index.js';
import { PRICE_HOOK } from './price-hook/index.js';
import { RATE_LIMIT } from './rate-limit/index.js';
import { REDUCE_ONLY } from './reduce-only/index.js';
import { RETRY } from './retry/index.js';
import { SCHEDULE } from './schedule/index.js';
import { SIZE_CURRENCY } from './size-currency/index.js';
import { SIZE_HOOK } from './size-hook/index.js';
import { SUBACCOUNT } from './subaccount/index.js';
import { UPDATE_NOTIFICATIONS } from './update-notifications/index.js';

// The order here is the order options will appear in help outputs.
const GLOBAL = [
  // UI.
  OUTPUT,
  COLOUR.ENABLE,
  COLOUR.DISABLE,
  UPDATE_NOTIFICATIONS.ENABLE,
  UPDATE_NOTIFICATIONS.DISABLE,

  // Platform.
  EXCHANGE,

  // Account.
  API_KEY,
  API_SECRET,
  SUBACCOUNT,

  // Behaviour.
  SIZE_CURRENCY,
  SIZE_HOOK,
  PRICE_HOOK,
  SCHEDULE,

  // Command.
  SIZE_CURRENCY,
  SIZE_HOOK,
  PRICE_HOOK,
  IOC.ENABLE,
  IOC.DISABLE,
  POST_ONLY.ENABLE,
  POST_ONLY.DISABLE,
  REDUCE_ONLY.ENABLE,
  REDUCE_ONLY.DISABLE,
  RETRY.ENABLE,
  RETRY.DISABLE,
  RATE_LIMIT,
];

export { GLOBAL };
