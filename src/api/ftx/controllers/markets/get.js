import { markets } from '../../endpoints/index.js';

async function get({ exchange }) {
  return markets.getMarkets({ exchange });
}

export { get };
