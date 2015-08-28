'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var GetProfileTransform = {

  event: function event() {
    return 'getProfile';
  },

  requestTransform: function requestTransform(event, query, connection) {
    // eslint-disable-line no-unused-vars
    var params = {
      accessToken: connection.request.session.passport.user.id,
      id: connection.request.session.passport.user.uid
    };
    var promise = this.callServiceClient('profile', 'getProfile', params);
    return promise;
  },

  responseTransform: function responseTransform(response, query, connection) {
    // eslint-disable-line no-unused-vars
    return JSON.parse(response.body);
  }
};

exports['default'] = GetProfileTransform;
module.exports = exports['default'];