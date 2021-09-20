function calculateDelayMilliseconds(intervalMilliseconds, orderIndex) {
  return intervalMilliseconds.multipliedBy(orderIndex);
}

export { calculateDelayMilliseconds };
