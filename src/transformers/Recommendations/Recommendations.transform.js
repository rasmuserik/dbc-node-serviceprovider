'use strict';

const RecommendationsTransform = {
  event() {
    return 'getRecommendations';
  },

  requestTransform(event, params) {
    return this.callServiceClient('recommend', 'getRecommendations', params);
  },

  responseTransform(data) {
    console.log(data);
    return this.extractWorkInformation(data.result);
  },

  extractWorkInformation(result) {
    return result.map((element) => {
      return {
        identifiers: [element[0]],
        title: element[1].title,
        creator: element[1].creator,
        workType: 'book' // @todo Hardcoded for now, change to real worktype
      };
    });
  }
};

export default RecommendationsTransform;
