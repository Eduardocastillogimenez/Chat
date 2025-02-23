import Pusher from 'pusher-js';

export function connectToChannel(channelName) {
  let connection = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    activityTimeout: 45000//ping server after 45 sec to check if connection still alive
  });

  return connection.subscribe(channelName);
}

export function disconnectFromChannel (connection, channelName) {
  if(connection) {
    return connection.unsubscribe(channelName);
  }
  return null
}