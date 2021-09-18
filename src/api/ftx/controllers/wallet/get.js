import { getAllSubaccounts } from './getAllSubaccounts.js';
import { getSubaccount } from './getSubaccount.js';

async function get(options) {
  return options.credentials.subaccount === 'main'
    ? getAllSubaccounts(options)
    : getSubaccount(options);
}

export { get };
