function formatPrice(price) {
  if (price == null) {
    return '-';
  }

  /**
   * API will return price precision based on price increments; don't need to
   * override decimal places.
   */
  return `$${price}`;
}

export { formatPrice };
