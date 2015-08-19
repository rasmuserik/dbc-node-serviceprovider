'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var PopSuggestTransform = {

  event: function event() {
    return 'getPopSuggestions';
  },

  getPopSuggestionsRequest: function getPopSuggestionsRequest(query) {
    var requests = [];

    requests.push(this.callServiceClient('popsuggest', 'getPopSuggestions', {
      index: 'display.title',
      query: query,
      fields: ['fedoraPid', 'display.title']
    }));

    requests.push(this.callServiceClient('popsuggest', 'getEntitySuggestions', {
      index: 'creator',
      query: query
    }));

    requests.push(this.callServiceClient('popsuggest', 'getEntitySuggestions', {
      index: 'subject',
      query: query
    }));

    return requests;
  },

  requestTransform: function requestTransform(event, query) {
    if (event === 'getPopSuggestions') {
      return this.getPopSuggestionsRequest(query);
    }
  },

  responseTransform: function responseTransform(response, query) {
    var data = {};

    if (response.error) {
      data = {
        error: true,
        statusCode: response.error.statusCode,
        statusMessage: response.error.statusMessage
      };
    } else if (!(0, _lodash.isEmpty)(response.params.path.method) && response.params.path.method === 'entity-suggest') {
      if ((0, _lodash.isEmpty)(response.response.suggestions)) {
        data.isEmpty = true;
        data.index = this.getEntitySuggestIndex(response.params.path.index);
      } else {
        data = this.parseEntitySuggestData(response);
      }
    } else if ((0, _lodash.isEmpty)(response.response.docs)) {
      data.isEmpty = true;
      data.index = this.getIndex(response);
    } else {
      data = this.parseData(response, query);
      data.query = query;
    }

    return data;
  },

  getIndex: function getIndex(response) {
    var index = '';
    if ((0, _lodash.isArray)(response.responseHeader.qf)) {
      index = response.responseHeader.qf.join();
    } else {
      index = response.responseHeader.qf.join();
    }

    return index.replace(',rec.collectionIdentifier', '');
  },

  /**
   * Parse data coming from the entity-suggest service
   */
  parseEntitySuggestData: function parseEntitySuggestData(response) {
    var query = response.params.path.query;
    var index = this.getEntitySuggestIndex(response.params.path.index);
    var docs = [];

    var numItems = response.response.suggestions.length <= 5 ? response.response.suggestions.length : 5;

    for (var i = 0; i < numItems; i++) {
      if (response.response.suggestions[i]) {
        docs.push({ text: response.response.suggestions[i].suggestion });
      }
    }

    return { index: index, docs: docs, query: query };
  },

  getEntitySuggestIndex: function getEntitySuggestIndex(indx) {
    var index = '';
    if (indx === 'creator') {
      index = 'display.creator';
    } else if (indx === 'subject') {
      index = 'term.subject';
    }
    return index;
  },

  /**
   * Parse data coming from the suggest service
   */
  parseData: function parseData(response, query) {
    var index = this.getIndex(response);
    var data = {
      index: index,
      docs: []
    };

    var parsedDocs = this.parseDocs(response.response.docs, index, query);
    if (parsedDocs.length) {
      data.docs = parsedDocs;
    }

    return data;
  },

  parseDocs: function parseDocs(docs, index, query) {
    var parsedDocs = [];
    var counter = 0;

    docs.forEach(function (value) {
      var shouldStopFilter = false;
      if (value[index] && counter < 5) {
        var text = value[index].filter(function (string) {
          if (!shouldStopFilter && string.toLowerCase().startsWith(query.toLowerCase(), 0)) {
            shouldStopFilter = true;
            return true;
          }
          return false;
        });
        parsedDocs.push({
          text: (0, _lodash.isArray)(text) ? text.pop() : text,
          pid: value.fedoraPid || null
        });
        counter++;
      }
    });

    return parsedDocs;
  }
};

exports['default'] = PopSuggestTransform;
module.exports = exports['default'];