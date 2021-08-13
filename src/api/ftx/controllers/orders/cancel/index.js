import { orders } from '../../../endpoints/index.js';

function composeRequestBody({ market, side }) {
  return {
    ...(market != null && { market }),
    ...(side != null && { side }),
  };
}

async function cancel({ filters, ...options }) {
  const requestBody = composeRequestBody(filters);

  return orders.cancelOrders({ ...options, requestBody });
}

export { cancel };
