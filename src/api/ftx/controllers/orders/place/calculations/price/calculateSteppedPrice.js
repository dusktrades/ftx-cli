function calculateOffset(priceStep, orderIndex) {
  return priceStep.multipliedBy(orderIndex);
}

function calculateSteppedPrice(fromPrice, priceStep, orderIndex) {
  const offset = calculateOffset(priceStep, orderIndex);

  return fromPrice.plus(offset);
}

export { calculateSteppedPrice };
