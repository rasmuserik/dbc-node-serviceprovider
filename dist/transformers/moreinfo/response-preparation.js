"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkResponse = checkResponse;
/**
 * Checks the response from the MoreInfo webservice, to see
 * if any errors are returned from the service.
 *
 * @param {Object} the requestStatus from the webservice
 * @return {Object} either empty if everything was ok, otherwise error
 * code and error messages
 */

function checkResponse(response) {

	var error = {};

	var serviceError = "";

	if (response.errorText != undefined) {
		serviceError = response.errorText;
	}

	switch (response.requestStatus.statusEnum) {
		case "ok":
			error = {};
			break;
		case "authentication_error":
			error = {
				errorcode: 1,
				errormessage: "Authentication error",
				serviceerror: serviceError
			};
			break;
		case "error_in_request":
			error = {
				errorcode: 2,
				errormessage: "Error in request",
				serviceerror: serviceError
			};
			break;
		case "service_unavailable":
			error = {
				errorcode: 3,
				errormessage: "Service unavailable",
				serviceerror: serviceError
			};
			break;
		default:
			error = {
				errorcode: 0,
				errormessage: "Error",
				serviceerror: serviceError
			};
			break;
	}

	return error;
}