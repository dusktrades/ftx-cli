import { RateLimitError } from '../../../../../common/errors/index.js';

function handleError(error, retryQueueOrderRequest) {
  if (error instanceof RateLimitError) {
    // Order failed due to exceeding rate limit; retry with increased priority.
    return retryQueueOrderRequest();
  }

  // Order failed due to some other reason; rethrow.
  throw error;
}

function queueOrderRequest(request, queue, priority = 0) {
  function retryQueueOrderRequest() {
    return queueOrderRequest(request, queue, priority + 1);
  }

  return queue
    .add(request, { priority })
    .catch((error) => handleError(error, retryQueueOrderRequest));
}

export { queueOrderRequest };
