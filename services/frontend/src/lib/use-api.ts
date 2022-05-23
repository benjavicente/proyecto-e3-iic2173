import { useState, useEffect } from 'react';

// Copy from https://github.com/auth0/nextjs-auth0/tree/main/examples/kitchen-sink-example
function initialState(args: { error?: any; isLoading?: boolean; response?: any }) {
  return {
    response: null,
    error: null,
    isLoading: true,
    ...args
  };
}

const useApi = (
  url: RequestInfo,
  options = {}
): {
  error: unknown;
  isLoading: boolean;
  response: any;
} => {
  const [state, setState] = useState(() => initialState({}));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          ...options
        });

        if (res.status >= 400) {
          setState(
            initialState({
              error: await res.json(),
              isLoading: false
            })
          );
        } else {
          setState(
            initialState({
              response: await res.json(),
              isLoading: false
            })
          );
        }
      } catch (error) {
        setState(
          initialState({
            error: {
              error: error.message
            },
            isLoading: false
          })
        );
      }
    };
    fetchData();
  }, []);
  return state;
};

export default useApi;