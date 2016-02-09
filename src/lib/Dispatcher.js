'use strict';

/**
 * @file
 * The Dispatcher is a wrapper for socket.io. It will handle all communication
 * between server and client
 */

/**
 * Register events when a new connections is made.
 *
 * @param connection
 * @param logger
 * @param provider
 */
function registerEventOnConnection(transform, logger, connection) {
  const event = transform.event();
  connection.on(`${event}Request`, (request) => {
    var startTime = Date.now();
    transform.trigger(request, connection).forEach((responsePromise) => {
      responsePromise
        .then(response => {
          logger.log('info', `${event}Response time`, Date.now() - startTime);
          connection.emit(`${event}Response`, response);
        })
        .catch(error => {
          // in-progress/TODO make emitted/logged error contain more info
          // - we cannot emit the error itself, as it may be a cyclic structure
          logger.log('warning', 'ResponseError', {event: event,
            time: Date.now() - startTime, 'String(error)': String(error)});
          connection.emit(`${event}Response`, {error: 'server error'});
        });
    });
  });
}
/**
 * Register events from the provider on new connections
 *
 * @param socket
 * @param provider
 * @param logger
 * @constructor
 */
export default function Dispatcher(transforms, logger, io) {
  io.use((connection, next) => {
    transforms.forEach((transform) => registerEventOnConnection(transform, logger, connection));
    next();
  });
}
