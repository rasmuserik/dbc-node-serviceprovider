'use strict';

import SocketProvider from './SocketProvider.js';

import * as api from './api.js';

export function init(config = null, socket = null) {
  if (!config) {
    throw new Error('No config provided');
  }

  api.init(config);

  if (socket) { // if no socket is provided an alternative shuld be set up TODO non-socket.io setup
    console.log('Setting up socket');
    SocketProvider.setUpSocket(socket, api.services);
  }
}
