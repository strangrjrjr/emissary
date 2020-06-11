import ActionCable from 'actioncable';

export default function cableMiddleware() {

  return ({ dispatch, getState }) => next => (action) => {
    if (typeof(action) === 'function') {
      return next(action)
    }

    const {
      channel,
      message,
      leave,
    } = action;
    let { received } = action;

    if (!channel) {
      return next(action);
    }

    if (leave) {
      const subscription = cable.find(
        cable.subscriptions.subscriptions,
        sub => sub.identifier === JSON.stringify({ channel }),
      );

      return cable.subscriptions.remove(subscription);
    }
    // need to change this
    if (typeof(received) === 'string') {
      received = result => dispatch({ type: received, result })
    }

    return cable.subscriptions.create({ channel, message }, { received });
  };
}