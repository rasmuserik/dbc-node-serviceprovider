'use strict';

import request from 'dbc-node-ddbcontent-client/node_modules/request';
import {assert, expect} from 'chai';
import sinon from 'sinon';
import Provider from '../../../Provider.js';
import DdbContentClient from '../../../clients/DdbContent.client.js';
import NewsTransform from '../news.transform.js';
import newsListResponse from './data/newslistReponse.js';

describe('Test News transform', () => {
  const config = {
    services: {
      ddbcontent: {
        endpoint: 'http://am.fs_rest.dev.inlead.dk/web',
        agency: '100000',
        key: 'b2573a3ea77a938fa86dc9fa05c99888f26992e9'
      }
    }
  };
  const provider = Provider(config);
  provider.registerServiceClient(DdbContentClient);
  provider.registerTransform(NewsTransform);

  before('setup provider', () => {
    sinon
      .stub(request, 'get')
      .yields(null, {statusCode: 200}, JSON.stringify(newsListResponse));
  });
  after('setup provider', () => {
    request.get.restore();
  });

  it('Trigger getNewsList', (done) => {
    const request = provider.trigger('getNewsList', {
      amount: 2,
      sort: 'nid'
    });

    request[0].then(response => {
      const expected = [
        {
          id: 'id1',
          title: 'title 1',
          lead: 'lead 1',
          body: '<p>body 1</p>',
          image: null
        }, {
          id: 'id2',
          title: 'title 2',
          lead: 'lead 2',
          body: '<p>body 2</p>',
          image: 'imagedata',
        }
      ];
      expect(response).to.deep.equal(expected);

      done();
    }).catch(err => done(err));
  });
});
