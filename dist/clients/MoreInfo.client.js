'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _dbcNodeMoreinfoClient = require('dbc-node-moreinfo-client');

var MoreInfo = _interopRequireWildcard(_dbcNodeMoreinfoClient);

var _ProviderJs = require('../Provider.js');

var ServiceProvider = _interopRequireWildcard(_ProviderJs);

exports['default'] = ServiceProvider.registerClient({
  name: 'moreinfo',
  init: function init(config) {
    MoreInfo.init(config);
    return { getMoreInfoResult: MoreInfo.getMoreInfoResult };
  }
});
module.exports = exports['default'];