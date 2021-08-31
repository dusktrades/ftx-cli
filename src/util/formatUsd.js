const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatUsd(value) {
  return formatter.format(value);
}

export { formatUsd };
