export default function clientMiddleware(restClient) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      // thunk
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;

    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    return promise(restClient).then(
      result => next({ ...rest, result, type: SUCCESS, ok: true }),
      error => next({ ...rest, error, type: FAILURE, ok: false })
    ).catch((error) => {
      console.error('MIDDLEWARE ERROR:', error);
      next({ ...rest, error, type: FAILURE, ok: false });
    });
  };
}
