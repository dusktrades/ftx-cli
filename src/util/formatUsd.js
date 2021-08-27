const options = {
  style: 'currency',
  currency: 'USD',
};

function formatUsd(value) {
  return new Intl.NumberFormat('en-US', options).format(value);
}

export { formatUsd };
