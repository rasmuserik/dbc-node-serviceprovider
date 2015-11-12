'use strict';

import {forEach, isArray} from 'lodash';

/**
 * @file
 * @type {{
 * event: (function()),
 * requestTransform: (function(string, string, Object): *),
 * responseTransform: (function({userId: string, requestStatus: string, raw: XML}): (response.requestStatus|{statusEnum, errorText}))
 * }}
 */
const CheckBorrower = {

  event() {
    return 'checkBorrower';
  },

  /**
   * @param {string} event
   * @param {string} query
   * @param {Object} connection
   * @return {*}
   */
  requestTransform(event, query) { // eslint-disable-line no-unused-vars

    let promises = [];

    let borchkPromise = this.callServiceClient('borchk', 'getBorrowerCheckResult', {
      userId: query.loanerID,
      userPincode: query.pincode,
      libraryCode: query.agencyID
    });
    promises.push(borchkPromise);

    let openAgencyPromise = this.callServiceClient('openagency', 'getAgencyBranches', {
      id: [query.agencyID]
    });
    promises.push(openAgencyPromise);

    return promises;
  },

  /**
   * @param {{userId: string, requestStatus: string, raw: XML}} response
   * @return {response.requestStatus|{statusEnum, errorText}}
   */
  responseTransform(response) {

    let finalResponse;

    if (response.library) {
      // Transforming OpenAgency response
      const branchNames = {};
      forEach(response.library.pickupAgency, (lib) => {
        const name = isArray(lib.branchName) ? lib.branchName[0].$value : lib.branchName.$value;
        branchNames[lib.branchId] = name;
      });
      // save branchNames to session
      finalResponse = {branchNames: branchNames};
    } else {
      // Transforming Borchk response
      finalResponse = {requestStatus: response.requestStatus};
    }
    return finalResponse;
  }
};

export default CheckBorrower;
