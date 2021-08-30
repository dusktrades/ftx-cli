const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 8 });

function formatCurrency(value) {
  return formatter.format(value);
}

export { formatCurrency };
