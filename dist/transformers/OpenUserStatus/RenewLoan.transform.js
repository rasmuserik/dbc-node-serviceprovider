'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _responsePreparationJs = require('./response-preparation.js');

var prep = _interopRequireWildcard(_responsePreparationJs);

var RenewLoanTransform = {

  event: function event() {
    return 'renewLoan';
  },

  cancelOrder: function cancelOrder(request) {
    return this.callServiceClient('openuserstatus', 'renewLoan', request);
  },

  requestTransform: function requestTransform(event, request) {
    return this.renewLoan({
      agencyId: 'DK-' + request.agencyId,
      loanId: request.loanId,
      userId: request.userId,
      pinCode: request.pinCode
    });
  },

  responseTransform: function responseTransform(response) {

    var result = prep.checkRenewLoanResponse(response);

    var error = null;

    var loanRenewed = false;
    var dueDate = null;
    var loanId = null;

    if (result.hasOwnProperty('error')) {
      error = result.error;
    } else if (response['ous:renewLoanResponse']['ous:renewLoanStatus'][0].hasOwnProperty('ous:renewLoanError')) {
      loanRenewed = false;
      error = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0]['ous:renewLoanError'];
      loanId = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0]['ous:loanId'][0];
    } else {
      loanRenewed = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0].hasOwnProperty('ous:dateDue');
      dueDate = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0]['ous:dateDue'][0];
      loanId = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0]['ous:loanId'][0];
    }

    response = { loanId: loanId, loanRenewed: loanRenewed, dueDate: dueDate, error: error };

    return response;
  }

};

exports['default'] = RenewLoanTransform;
module.exports = exports['default'];