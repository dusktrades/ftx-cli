import { userRewards } from '../../endpoints/index.js';

async function get({ exchange, credentials }) {
  return userRewards.getUserRewards({ exchange, credentials });
}

export { get };
