import { wallet } from '../../endpoints/index.js';
import { collateSubaccountBalances } from './helpers/collateSubaccountBalances.js';

async function getSubaccount({ exchange, credentials, sortBy }) {
  const data = await wallet.getBalances({ exchange, credentials });

  return collateSubaccountBalances(data, sortBy);
}

export { getSubaccount };
