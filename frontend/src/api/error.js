export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const response = error.response?.data;

  if (response?.errors?.length) {
    return response.errors.map((item) => item.message).join(', ');
  }

  if (response?.message) {
    return response.message;
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Cannot connect to the backend. Make sure the API is running on port 5000.';
  }

  return fallback;
};
