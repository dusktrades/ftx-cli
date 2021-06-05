function handleError(error) {
  const parsedResponseBody = JSON.parse(error.response.body);
  const message = parsedResponseBody?.error;

  if (message == null) {
    // Error isn't handled by API, stop execution and forcefully report.
    throw new Error(error);
  }

  return { error: message };
}

export { handleError };
