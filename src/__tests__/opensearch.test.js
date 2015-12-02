'use strict';
/*eslint-disable */
import {expect, assert} from 'chai';

const transform = require('../transformers/opensearch/ResultList.transform');

const facettransform = require('../transformers/opensearch/Facets.transform');

const worktransform = require('../transformers/opensearch/Work.transform');

const openSearchWorkMocks = require('./opensearch.mock.js');



describe('Test transform of OpenSearch responses', () => {
  transform.callServiceClient = () => {};

  it('Check one hit', () => {

    const response = {'result': {'hitCount': '1', 'collectionCount': '1', 'more': 'false', 'sortUsed': 'rank_subject', 'searchResult': {'collection': {'resultPosition': '1', 'numberOfObjects': '1', 'object': {'identifier': '870970-basis:27036031', 'recordStatus': 'active', 'creationDate': '2007-11-26', 'formatsAvailable': {'format': ['dkabm', 'marcxchange']}}}, 'formattedCollection': {'briefDisplay': {'manifestation': {'accessType': 'physical', 'fedoraPid': '870970-basis:27036031', 'identifier': '870970-basis:27036031', 'title': 'Harry Potter og Fønixordenen', 'titleFull': 'Harry Potter og Fønixordenen', 'type': 'Playstation 2', 'workType': 'game'}}}}, 'facetResult': {}, 'statInfo': {'fedoraRecordsCached': '4', 'fedoraRecordsRead': '1', 'time': '0.205224', 'trackingId': 'os:2015-06-15T11:47:46:535154:6359'}}};

    const result = transform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"result": [{"identifiers": ["870970-basis:27036031"], "title": "Harry Potter og Fønixordenen", "workType": "game"}], "info": {"facets": [], "hits": "1", "collections": "1", "more": "false"}, "error": []}), 'One hit in search result');
  });
  it('Check more hits', () => {

    const response = {'result': {'hitCount': '2', 'collectionCount': '2', 'more': 'false', 'sortUsed': 'rank_subject', 'searchResult': [{'collection': {'resultPosition': '1', 'numberOfObjects': '1', 'object': {'identifier': '870970-basis:27036031', 'recordStatus': 'active', 'creationDate': '2007-11-26', 'formatsAvailable': {'format': ['dkabm', 'marcxchange']}}}, 'formattedCollection': {'briefDisplay': {'manifestation': {'accessType': 'physical', 'fedoraPid': '870970-basis:27036031', 'identifier': '870970-basis:27036031', 'title': 'Harry Potter og Fønixordenen', 'titleFull': 'Harry Potter og Fønixordenen', 'type': 'Playstation 2', 'workType': 'game'}}}}, {'collection': {'resultPosition': '2', 'numberOfObjects': '1', 'object': {'identifier': '870970-basis:29317038', 'recordStatus': 'active', 'creationDate': '2012-04-03', 'formatsAvailable': {'format': ['dkabm', 'marcxchange']}}}, 'formattedCollection': {'briefDisplay': {'manifestation': {'accessType': 'physical', 'creator': 'Joanne K. Rowling', 'fedoraPid': '870970-basis:29317038', 'identifier': '870970-basis:29317038', 'language': 'Dansk', 'title': 'Harry Potter og De Vises Sten', 'titleFull': 'Harry Potter og De Vises Sten', 'type': 'Bog', 'workType': 'book'}}}}], 'facetResult': {}, 'statInfo': {'fedoraRecordsCached': '3', 'fedoraRecordsRead': '7', 'time': '1.831044', 'trackingId': 'os:2015-06-15T12:48:15:288498:31926'}}};

    const result = transform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"result":[{"identifiers":["870970-basis:27036031"],"title":"Harry Potter og Fønixordenen","workType":"game"},{"identifiers":["870970-basis:29317038"],"title":"Harry Potter og De Vises Sten","creator":"Joanne K. Rowling","workType":"book"}],"info":{"facets":[],"hits":"2","collections":"2","more":"false"},"error":[]}), 'More hits in search result');

  });
  it('Check more hits one work', () => {

    const response = {'result': {'hitCount': '2', 'collectionCount': '1', 'more': 'false', 'sortUsed': 'rank_subject', 'searchResult': {'collection': {'resultPosition': '1', 'numberOfObjects': '2', 'object': [{'identifier': '870970-basis:22252852', 'recordStatus': 'active', 'creationDate': '2005-03-01', 'formatsAvailable': {'format': ['dkabm', 'marcxchange']}}, {'identifier': '870970-basis:29317038', 'recordStatus': 'active', 'creationDate': '2012-04-03', 'formatsAvailable': {'format': ['dkabm', 'marcxchange']}}]}, 'formattedCollection': {'briefDisplay': {'manifestation': [{'accessType': 'physical', 'creator': 'Joanne K. Rowling', 'fedoraPid': '870970-basis:22252852', 'identifier': '870970-basis:22252852', 'language': 'Dansk', 'title': 'Harry Potter og De Vises Sten', 'titleFull': 'Harry Potter og De Vises Sten', 'type': 'Bog', 'workType': 'book'}, {'accessType': 'physical', 'creator': 'Joanne K. Rowling', 'fedoraPid': '870970-basis:29317038', 'identifier': '870970-basis:29317038', 'language': 'Dansk', 'title': 'Harry Potter og De Vises Sten', 'titleFull': 'Harry Potter og De Vises Sten', 'type': 'Bog', 'workType': 'book'}]}}}, 'facetResult': {}, 'statInfo': {'fedoraRecordsCached': '8', 'fedoraRecordsRead': '0', 'time': '0.307299', 'trackingId': 'os:2015-06-15T12:50:59:869318:31926'}}};

    const result = transform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"result":[{"identifiers":["870970-basis:22252852","870970-basis:29317038"],"title":"Harry Potter og De Vises Sten","creator":"Joanne K. Rowling","workType":"book"}],"info":{"facets":[], "hits":"2","collections":"1","more":"false"},"error":[]}), 'More hits in one work collection');

  });
  it('Check no hits', () => {

    const response = {'result': {'hitCount': '0', 'collectionCount': '0', 'more': 'false', 'sortUsed': 'rank_main_title', 'facetResult': {}, 'statInfo': {'fedoraRecordsCached': '0', 'fedoraRecordsRead': '0', 'time': '0.181227', 'trackingId': 'os:2015-06-15T12:53:41:207552:6791'}}};

    const result = transform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({'result':[],'info':{'facets':[], 'hits':'0','collections':'0','more':'false'},'error':[]}), 'No records found');

  });
  it('Check authentication error', () => {

    const response = {'error': 'authentication_error'};

    const result = transform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({'result':[],'info':{facets:[]},'error':[{'errorcode':1,'errormessage':'Authentication error','serviceerror':'authentication_error'}]}), 'Authentication error');

  });

});

describe('Test transform of OpenSearch Facet responses', () => {
  it('Several facets', () => {

    const response = {"result":{"hitCount":"161","collectionCount":"0","more":"true","facetResult":{"facet":[{"facetName":"facet.type","facetTerm":[{"frequence":"48","term":"bog"},{"frequence":"16","term":"cd (musik)"},{"frequence":"16","term":"lydbog (cd)"},{"frequence":"15","term":"dvd"},{"frequence":"7","term":"lydbog (cd-mp3)"}]},{"facetName":"facet.creator","facetTerm":[{"frequence":"109","term":"joanne k. rowling"},{"frequence":"22","term":"daniel radcliffe"},{"frequence":"22","term":"emma watson"},{"frequence":"22","term":"robbie coltrane"},{"frequence":"22","term":"rupert grint"}]},{"facetName":"facet.subject","facetTerm":[{"frequence":"83","term":"magi"},{"frequence":"83","term":"troldmænd"},{"frequence":"47","term":"fantasy"},{"frequence":"43","term":"computerspil"},{"frequence":"30","term":"adventurespil"}]},{"facetName":"facet.language","facetTerm":[{"frequence":"76","term":"dansk"},{"frequence":"53","term":"blandede sprog"},{"frequence":"24","term":"engelsk"}]},{"facetName":"facet.category","facetTerm":[{"frequence":"148","term":"børnematerialer"},{"frequence":"40","term":"voksenmaterialer"}]},{"facetName":"facet.date","facetTerm":[{"frequence":"18","term":"2011"},{"frequence":"17","term":"2009"},{"frequence":"15","term":"2003"},{"frequence":"13","term":"2004"},{"frequence":"11","term":"2000"}]},{"facetName":"facet.acSource","facetTerm":[{"frequence":"155","term":"bibliotekskatalog"},{"frequence":"6","term":"filmstriben"}]}]},"statInfo":{"fedoraRecordsCached":"0","fedoraRecordsRead":"0","time":"2.472219","trackingId":"2015-12-02T11:15:58:719869:24701"}},"raw":""};

    assert.equal(JSON.stringify(facettransform.responseTransform(response)), JSON.stringify({"result":[{"facetName":"facet.type","terms":[{"term":"bog","count":"48"},{"term":"cd (musik)","count":"16"},{"term":"lydbog (cd)","count":"16"},{"term":"dvd","count":"15"},{"term":"lydbog (cd-mp3)","count":"7"}]},{"facetName":"facet.creator","terms":[{"term":"joanne k. rowling","count":"109"},{"term":"daniel radcliffe","count":"22"},{"term":"emma watson","count":"22"},{"term":"robbie coltrane","count":"22"},{"term":"rupert grint","count":"22"}]},{"facetName":"facet.subject","terms":[{"term":"magi","count":"83"},{"term":"troldmænd","count":"83"},{"term":"fantasy","count":"47"},{"term":"computerspil","count":"43"},{"term":"adventurespil","count":"30"}]},{"facetName":"facet.language","terms":[{"term":"dansk","count":"76"},{"term":"blandede sprog","count":"53"},{"term":"engelsk","count":"24"}]},{"facetName":"facet.category","terms":[{"term":"børnematerialer","count":"148"},{"term":"voksenmaterialer","count":"40"}]},{"facetName":"facet.date","terms":[{"term":"2011","count":"18"},{"term":"2009","count":"17"},{"term":"2003","count":"15"},{"term":"2004","count":"13"},{"term":"2000","count":"11"}]},{"facetName":"facet.acSource","terms":[{"term":"bibliotekskatalog","count":"155"},{"term":"filmstriben","count":"6"}]}],"info":{},"error":[]}), 'Several facets');

  });

});

describe('Test transform of OpenSearch Work responses', () => {
  it('Eight manifestations in a work', () => {

    const response = openSearchWorkMocks['870970-basis:22629344'];

    assert.equal(JSON.stringify(worktransform.responseTransform(response)), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:22629344","title":"Harry Potter og De Vises Sten","fullTitle":"Harry Potter og De Vises Sten","alternativeTitle":"Harry Potter og De Vises Sten","creator":"Joanne K. Rowling","contributers":["Hanna Lützen","Jesper Christensen","Henrik Emmer"],"abstract":"Fantasy. Den 11-årige forældreløse dreng Harry Potter bliver adopteret af sin onkel og tante som ikke bryder sig om ham. Han har trolddomsblod i årerne og bliver optaget på en skole for trolddomskyndige. Her får han nye venner og fjender","isbns":["87-00-39836-5","9788700398368","9788702113990","87-00-34654-3","87-02-02769-0","87-02-01276-6","87-605-7377-5","9788702075380","87-605-8571-4"],"extent":"303 sider","actors":[],"series":"Samhørende: Harry Potter og De Vises Sten ; Harry Potter og Hemmelighedernes Kammer ; Harry Potter og fangen fra Azkaban ; Harry Potter og Flammernes Pokal ; Harry Potter og Fønixordenen ; Harry Potter og halvblodsprinsen ; Harry Potter og dødsregalierne","subjects":["fantasy","magi","troldmænd","eventyrlige fortællinger"],"dk5s":[{"text":"Skønlitteratur","value":"sk"}],"audience":{"age":["for 12 år","for 13 år","for 14 år","for 15 år","for 16 år","for 11 år","for 10 år","for 9 år"],"pegi":"","medieraad":"","type":"børnematerialer"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"physical","creator":"Joanne K. Rowling","date":"1999","edition":"2. udgave","extent":"303 sider","identifier":"870970-basis:22629344","isbns":["87-00-39836-5","9788700398368"],"link":[],"publisher":"Gyldendal","title":"Harry Potter og De Vises Sten","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Joanne K. Rowling","date":"2012","edition":"5. udgave","extent":"303 sider","identifier":"870970-basis:29317038","isbns":["9788702113990"],"link":[],"publisher":"Gyldendal","title":"Harry Potter og De Vises Sten","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Joanne K. Rowling","date":"1998","edition":"","extent":"303 sider","identifier":"870970-basis:22252852","isbns":["87-00-34654-3"],"link":[],"publisher":"Gyldendal","title":"Harry Potter og De Vises Sten","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Joanne K. Rowling","date":"2004","edition":"3. udgave","extent":"303 sider","identifier":"870970-basis:25194853","isbns":["87-02-02769-0"],"link":[],"publisher":"Gyldendal","title":"Harry Potter og De Vises Sten","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Jesper Christensen (f. 1948)","date":"2002","edition":"","extent":"9 t., 40 min.","identifier":"870970-basis:24168638","isbns":["87-02-01276-6"],"link":[],"publisher":"Gyldendal","title":"Harry Potter og De Vises Sten","type":"Lydbog (cd)","workType":"audiobook"},{"accessType":"physical","creator":"Joanne K. Rowling","date":"2000","edition":"","extent":"10 t., 25 min.","identifier":"870970-basis:23195151","isbns":["87-605-7377-5"],"link":[],"publisher":"Gyldendal Lydbøger","title":"Harry Potter og De Vises Sten","type":"Lydbog (cd)","workType":"audiobook"},{"accessType":"physical","creator":"Jesper Christensen (f. 1948)","date":"2009","edition":"","extent":"9 t., 40 min.","identifier":"870970-basis:27638708","isbns":["9788702075380"],"link":[],"publisher":"Gyldendal Lyd","title":"Harry Potter og De Vises Sten","type":"Lydbog (cd-mp3)","workType":"audiobook"},{"accessType":"physical","creator":"Joanne K. Rowling","date":"1999","edition":"","extent":"10 t., 27 min.","identifier":"870970-basis:22513354","isbns":["87-605-8571-4"],"link":[],"publisher":"Gyldendal Lydbøger","title":"Harry Potter og De Vises Sten","type":"Lydbog (bånd)","workType":"audiobook"}],"relations":[]}}), '8 manifestations in work');

  });

  it('Get tracks', () => {

    const response = openSearchWorkMocks['870970-basis:29572801'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:29572801","title":"A map of all our failures","fullTitle":"A map of all our failures","alternativeTitle":"","creator":"My Dying Bride","contributers":[],"abstract":"","isbns":[],"extent":"ca. 70 min.","actors":[],"series":"","subjects":[],"dk5s":[{"text":"Rock (Beat). Moderne folkemusik (Folk)","value":"78.794:5"}],"audience":{"age":[],"pegi":"","medieraad":"","type":"voksenmaterialer"},"tracks":["Kneel til doomsday","The poorest waltz","A tapestry scorned","Like a perpetual funeral","A map of all our failures","Hail Odysseus","Within the presence of absence","Abandoned as Christ","My faults are your reward"],"languages":["Engelsk"],"editions":[{"accessType":"physical","creator":"My Dying Bride","date":"2012","edition":"","extent":"ca. 70 min.","identifier":"870970-basis:29572801","isbns":[],"link":[],"publisher":"Peaceville Records","title":"A map of all our failures","type":"Cd (musik)","workType":"music"}],"relations":[]}}), 'Music has tracks');

  });

  it('Movie', () => {

    const response = openSearchWorkMocks['870970-basis:26593123'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:26593123","title":"Sandtrolden","fullTitle":"Sandtrolden","alternativeTitle":"Five children and It","creator":"John Stephenson (instruktør)","contributers":[],"abstract":"Fem børn møder Sandtrolden, som er en selvoptaget og lettere krakilsk herre, men kan dog som enhver trold opfylde ønsker. Men børnenes ønsker bringer dem hver gang i store vanskeligheder, for Sandtrolden er også en udspekuleret filur","isbns":[],"extent":"85 min.","actors":["Freddie Highmore","Jonathan Bailey","Jessica Claridge","Poppy Rogers","Alec & Zak Muggleton","Alexander Pownall","Eddie Izzard","Kenneth Branagh"],"series":"","subjects":["børn","trolde"],"dk5s":[{"text":"Børnefilm","value":"77.74"}],"audience":{"age":[],"pegi":"","medieraad":"Mærkning: Tilladt for alle men frarådes børn under 7 år","type":"Mærkning: Tilladt for alle men frarådes børn under 7 år"},"tracks":[],"languages":["Flere sprog","Engelsk"],"editions":[{"accessType":"physical","creator":"","date":"2006","edition":"","extent":"85 min.","identifier":"870970-basis:26593123","isbns":[],"link":[],"publisher":"Scanbox","title":"Sandtrolden","type":"Dvd","workType":"movie"}],"relations":[]}}), 'Movie');

  });

  it('Series', () => {

    const response = openSearchWorkMocks['870970-basis:28179030'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:27986404","title":"Daggry","fullTitle":"Daggry","alternativeTitle":"Breaking dawn","creator":"Stephenie Meyer","contributers":["Tina Sakura Bestle","Vibeke Nielsen","Karin Rørbech"],"abstract":"Den 18-årige Bella er nu blevet gift med sin elskede vampyrkæreste, Edward. På bryllupsrejsen bliver Bella gravid - men der er noget galt","isbns":["9788711435830","9788711391471","9788711415344","9788711404980","9788711420751"],"extent":"850 sider","actors":[],"series":"Tusmørke-serien ; 4. del","subjects":["dark fantasy","kærlighed","unge","vampyrer","varulve"],"dk5s":[{"text":"Skønlitteratur","value":"sk"}],"audience":{"age":["for 13 år","for 14 år","for 15 år"],"pegi":"","medieraad":"","type":"børnematerialer"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"physical","creator":"Stephenie Meyer","date":"2009","edition":"1. udgave","extent":"850 sider","identifier":"870970-basis:27986404","isbns":["9788711435830"],"link":[],"publisher":"Carlsen","title":"Daggry","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Stephenie Meyer","date":"2012","edition":"4. udgave","extent":"850 sider","identifier":"870970-basis:29253153","isbns":["9788711391471"],"link":[],"publisher":"Carlsen","title":"Daggry","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Stephenie Meyer","date":"2010","edition":"2. udgave","extent":"850 sider","identifier":"870970-basis:28554346","isbns":["9788711415344"],"link":[],"publisher":"Carlsen","title":"Daggry","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Stephenie Meyer","date":"2011","edition":"3. udgave","extent":"850 sider","identifier":"870970-basis:29039569","isbns":["9788711404980"],"link":[],"publisher":"Carlsen","title":"Daggry","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Stephenie Meyer","date":"2009","edition":"","extent":"20 t., 35 min.","identifier":"870970-basis:28179030","isbns":["9788711420751"],"link":[],"publisher":"Carlsen","title":"Daggry","type":"Lydbog (cd-mp3)","workType":"audiobook"}],"relations":[]}}), 'Series');

  });

  it('Audience age', () => {

    const response = openSearchWorkMocks['870970-basis:27036031'];

    assert.equal(JSON.stringify(worktransform.responseTransform(response)), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:27036031","title":"Harry Potter og Fønixordenen","fullTitle":"Harry Potter og Fønixordenen (Playstation 2)","alternativeTitle":"Harry and the Order of the Phoenix","creator":"","contributers":[],"abstract":"Adventurespil. Harry og hans venner opdager, at Dødsgardisterne og Lord Voldemort er vendt tilbage. I deres søgen efter Voldemort, udforsker de sammen Hogwartsskolen. Man kan gå på opdagelse på alle etagerne, i hemmelige rum og i skjulte gange","isbns":[],"extent":"","actors":[],"series":"","subjects":[],"dk5s":[{"text":"Computerspil","value":"79.41"}],"audience":{"age":[],"pegi":"PEGI-mærkning: 7+","medieraad":"","type":"PEGI-mærkning: 7+"},"tracks":[],"languages":["Flere sprog","Engelsk","Hollandsk","Svensk","Norsk","Dansk","Finsk"],"editions":[{"accessType":"physical","creator":"","date":"2007","edition":"","extent":"","identifier":"870970-basis:27036031","isbns":[],"link":[],"publisher":"EA","title":"Harry Potter og Fønixordenen","type":"Playstation 2","workType":"game"},{"accessType":"physical","creator":"","date":"2007","edition":"","extent":"","identifier":"870970-basis:27036082","isbns":[],"link":[],"publisher":"EA","title":"Harry Potter og Fønixordenen","type":"Playstation 3","workType":"game"},{"accessType":"physical","creator":"","date":"2007","edition":"","extent":"","identifier":"870970-basis:27036228","isbns":[],"link":[],"publisher":"EA","title":"Harry Potter og Fønixordenen","type":"Wii","workType":"game"},{"accessType":"physical","creator":"","date":"2007","edition":"","extent":"","identifier":"870970-basis:27036155","isbns":[],"link":[],"publisher":"EA","title":"Harry Potter og Fønixordenen","type":"Xbox 360","workType":"game"}],"relations":[]}}), 'Audience age');

  });

  it('Audience remove text', () => {

    const response = openSearchWorkMocks['870970-basis:28478321'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:29106312","title":"Karlas kabale","fullTitle":"Karlas kabale","alternativeTitle":"Karlas kabale","creator":"Renée Toft Simonsen","contributers":["Lars Gabel","Renée Toft Simonsen","Gunvor Reynberg"],"abstract":"9-årige Karla bor sammen med sin mor, sin papfar og to små brødre. Hun er glad for sin nye familie, men tænker også meget på sin rigtige, noget drikfældige far","isbns":["9788740004373","87-567-8299-3","9788756782999","9788756787826","9788778657947","87-567-6967-9","9788756769679"],"extent":"158 sider","actors":[],"series":"Samhørende: Karlas kabale ; Karla og Katrine ; Karlas svære valg ; Karla og Jonas ; Karla superstjerne ; Karlas kamp","subjects":["alkoholisme","familien","følelser","sammenbragte familier","skilsmissebørn","svigt","tyve"],"dk5s":[{"text":"Skønlitteratur","value":"sk"}],"audience":{"age":["for 10 år","for 11 år","for 8 år","for 9 år","for højtlæsning","for 6 år","for 7 år"],"pegi":"","medieraad":"","type":"børnematerialer"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"physical","creator":"Renée Toft Simonsen","date":"2011","edition":"6. udgave","extent":"158 sider","identifier":"870970-basis:29106312","isbns":["9788740004373"],"link":[],"publisher":"Politiken","title":"Karlas kabale","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Renée Toft Simonsen","date":"2006","edition":"2. udgave, 3. oplag","extent":"158 sider","identifier":"870970-basis:26486548","isbns":["87-567-8299-3","9788756782999"],"link":[],"publisher":"Politiken","title":"Karlas kabale","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Renée Toft Simonsen","date":"2007","edition":"3. udgave, 3. oplag","extent":"158 sider","identifier":"870970-basis:27006116","isbns":["9788756787826"],"link":[],"publisher":"Politiken","title":"Karlas kabale","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Gunvor Reynberg","date":"2010","edition":"","extent":"82 sider","identifier":"870970-basis:28478321","isbns":["9788778657947"],"link":[],"publisher":"Drama","title":"Karlas kabale","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Renée Toft Simonsen","date":"2003","edition":"1. udgave","extent":"158 sider","identifier":"870970-basis:24929604","isbns":["87-567-6967-9","9788756769679"],"link":[],"publisher":"Politiken","title":"Karlas kabale","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Renée Toft Simonsen","date":"2004","edition":"","extent":"2 t., 22 min.","identifier":"870970-basis:25499832","isbns":[],"link":[],"publisher":"Audioteket","title":"Karlas kabale","type":"Lydbog (cd)","workType":"audiobook"}],"relations":[]}}), 'Audience remove text');

  });

  it('Audience sort age', () => {

    const response = openSearchWorkMocks['870970-basis:28246692'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:28427263","title":"På eventyr med Sigge","fullTitle":"På eventyr med Sigge","alternativeTitle":"","creator":"Lin Hallberg","contributers":["Margareta Nordqvist","Charlotte A.E. Glahn","Benedikte Biørn"],"abstract":"9 årige Elina får den allerbedste fødselsdagsgave af vennen Erik. En rigtig eventyrtur på hesteryg med telt. Men veninden Marie bliver misundelig. Kan Elina være ven med dem begge to?","isbns":["9788702098587","9788764454642"],"extent":"136 sider","actors":[],"series":"RAP : Rideskolen Agersøs Ponyer ; 7. bog","subjects":["heste","piger","rideskoler"],"dk5s":[{"text":"Skønlitteratur","value":"sk"}],"audience":{"age":["for 10 år","for 8 år","for 9 år"],"pegi":"","medieraad":"","type":"børnematerialer"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"physical","creator":"Margareta Nordqvist","date":"2010","edition":"1. udgave, 1. oplag","extent":"136 sider","identifier":"870970-basis:28427263","isbns":["9788702098587"],"link":[],"publisher":"Gyldendal","title":"På eventyr med Sigge","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Lin Hallberg","date":"2011","edition":"","extent":"76 min.","identifier":"870970-basis:28246692","isbns":["9788764454642"],"link":[],"publisher":"Biblioteksmedier","title":"På eventyr med Sigge","type":"Lydbog (cd)","workType":"audiobook"}],"relations":[]}}), 'Audience sort age');

  });

  it('Links to Filmstriben', () => {

    const response = openSearchWorkMocks['870970-basis:50687589'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:50687589","title":"Drengelejren","fullTitle":"Drengelejren","alternativeTitle":"Drengelejren","creator":"Cathrine Marchen Asmussen","contributers":[],"abstract":"En gruppe drenge fra 11-14 år, som mødes og finder hinanden på en sommerlejr arrangeret af Red Barnet. Drengene kommer fra hjem uden overskud og med en hverdag præget af marginalisering og mobning. I løbet af den uge lejren varer nærmer de sig hinanden og finder ressourcer i sig selv, som hverken de selv eller andre troede de havde","isbns":[],"extent":"38 min.","actors":[],"series":"","subjects":[],"dk5s":[{"text":"Forsorg for børn","value":"38.51"}],"audience":{"age":[],"pegi":"","medieraad":"Mærkning: Tilladt for alle men frarådes børn under 7 år","type":"Mærkning: Tilladt for alle men frarådes børn under 7 år"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"online","creator":"","date":"2013","edition":"","extent":"38 min.","identifier":"870970-basis:50687589","isbns":[],"link":["http://www.filmstriben.dk/bibliotek/film/details.aspx?id=9000000917","http://www.filmstriben.dk/fjernleje/film/details.aspx?id=9000000917","http://filmcentralen.dk/grundskolen/film/drengelejren","http://filmcentralen.dk/gymnasiet/film/drengelejren"],"publisher":"Det danske Filminstitut","title":"Drengelejren","type":"Film (net)","workType":"movie"}],"relations":[{"link":"http://www.filmstriben.dk/bibliotek/film/details.aspx?id=9000000917","type":"dbcaddi:hasOnlineAccess","access":"onsite","accessType":"streaming","collection":["150021-bibliotek","870970-basis","870970-bibdk"]},{"link":"http://www.filmstriben.dk/fjernleje/film/details.aspx?id=9000000917","type":"dbcaddi:hasOnlineAccess","access":"remote","accessType":"streaming","collection":["150021-fjern","870970-basis","870970-bibdk"]}]}}), 'Links to Filmstriben');

  });

  it('Links to Ereolen', () => {

    const response = openSearchWorkMocks['870970-basis:28116047'];

    const result = worktransform.responseTransform(response);
    assert.equal(JSON.stringify(result), JSON.stringify({"info":{"hits":"1","collections":"1"},"error":[],"work":{"pid":"870970-basis:28116047","title":"Løbeild","fullTitle":"Løbeild","alternativeTitle":"Catching fire","creator":"Suzanne Collins","contributers":["Camilla Schierbeck","Grete Tulinius","Maria Stokholm"],"abstract":"Science fiction. Kattua og Peeta vandt ganske vist Dødsspillet, men Capitols ledere er ikke tilfredse med måden, og oprør ulmer i distrikterne","isbns":["9788702074567","9788702094206","9788702167085","9788703053691","9788702175257","9788702128376","9788702130560"],"extent":"315 sider","actors":[],"series":"2. del af: Dødsspillet","subjects":["fremtidsfortællinger","kærlighed","science fiction","spændende bøger","venskab"],"dk5s":[{"text":"Skønlitteratur","value":"sk"},{"text":"Skønlitteratur","value":"99.4 Collins, Suzanne"}],"audience":{"age":["for 12 år","for 13 år","for 14 år","for 15 år","for 16 år","for 13-16 år"],"pegi":"","medieraad":"","type":"børnematerialer"},"tracks":[],"languages":["Dansk"],"editions":[{"accessType":"physical","creator":"Suzanne Collins","date":"2010","edition":"1. udgave, 1. oplag","extent":"315 sider","identifier":"870970-basis:28116047","isbns":["9788702074567"],"link":[],"publisher":"Gyldendal","title":"Løbeild","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Suzanne Collins","date":"2010","edition":"2. udgave","extent":"396 sider","identifier":"870970-basis:28290926","isbns":["9788702094206"],"link":[],"publisher":"Gyldendal","title":"Løbeild","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Suzanne Collins","date":"2014","edition":"3. udgave","extent":"369 sider","identifier":"870970-basis:51367502","isbns":["9788702167085"],"link":[],"publisher":"Gyldendal","title":"Løbeild","type":"Bog","workType":"book"},{"accessType":"physical","creator":"Suzanne Collins","date":"2012","edition":"1. bogklubudgave","extent":"396 sider","identifier":"870970-basis:29400512","isbns":["9788703053691"],"link":[],"publisher":"Gyldendals Bogklubber","title":"Løbeild","type":"Bog","workType":"book"},{"accessType":"online","creator":"Suzanne Collins","date":"2011","edition":"","extent":"","identifier":"874310-katalog:DBB0711104","isbns":[],"link":["http://www.e17.dk/bog/711104"],"publisher":"Nota","title":"Løbeild","type":"Ebog","workType":"book"},{"accessType":"online","creator":"Suzanne Collins","date":"2014","edition":"1. i.e. ny e-bogsudgave","extent":"","identifier":"870970-basis:51398491","isbns":["9788702175257"],"link":["https://ereolen.dk/ting/object/870970-basis:51398491"],"publisher":"Gyldendal","title":"Løbeild","type":"Ebog","workType":"book"},{"accessType":"online","creator":"Suzanne Collins","date":"2012","edition":"1. e-bogsudgave","extent":"","identifier":"870970-basis:29284814","isbns":["9788702128376"],"link":[],"publisher":"Gyldendal","title":"Løbeild","type":"Ebog","workType":"book"},{"accessType":"online","creator":"Suzanne Collins","date":"2012","edition":"","extent":"","identifier":"870970-basis:29363323","isbns":["9788702130560"],"link":["https://ereolen.dk/ting/object/870970-basis:29363323"],"publisher":"Gyldendal Lyd","title":"Løbeild","type":"Lydbog (net)","workType":"audiobook"},{"accessType":"online","creator":"Maria Stokholm","date":"2011","edition":"","extent":"11 t., 15 min.","identifier":"874310-katalog:DBB0036776","isbns":[],"link":["http://www.e17.dk/bog/36776"],"publisher":"Nota","title":"Løbeild","type":"Lydbog (net)","workType":"audiobook"},{"accessType":"physical","creator":"Suzanne Collins","date":"2011","edition":"","extent":"9 bind","identifier":"874310-katalog:DBB0411104","isbns":[],"link":["http://www.e17.dk/bog/411104"],"publisher":"Nota","title":"Løbeild","type":"Punktskrift","workType":"book"}],"relations":[{"link":"870976-anmeld:30855914","type":"dbcaddi:hasReview","access":"","accessType":"","collection":[]},{"link":"870971-anmeld:34596344","type":"dbcaddi:hasReview","access":"","accessType":"","collection":[]},{"link":"870976-anmeld:30855914","type":"dbcaddi:hasReview","access":"","accessType":"","collection":[]},{"link":"870976-anmeld:30855914","type":"dbcaddi:hasReview","access":"","accessType":"","collection":[]},{"link":"http://www.e17.dk/bog/711104","type":"dbcaddi:hasOnlineAccess","access":"","accessType":"","collection":["874310-katalog","870970-forsk"]},{"link":"870971-avis:35299254","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:35686940","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:36339721","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"https://ereolen.dk/ting/object/870970-basis:51398491","type":"dbcaddi:hasOnlineAccess","access":"remote","accessType":"streaming","collection":["150015-erelic","870970-basis","870970-bibdk"]},{"link":"150015-forlag:9788702128376","type":"dbcaddi:hasDescriptionFromPublisher","access":"","accessType":"","collection":[]},{"link":"150015-forlag:9788702130560","type":"dbcaddi:hasDescriptionFromPublisher","access":"","accessType":"","collection":[]},{"link":"http://www.e17.dk/bog/36776","type":"dbcaddi:hasOnlineAccess","access":"","accessType":"","collection":["874310-katalog","870970-forsk"]},{"link":"870971-avis:35299254","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:35686940","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:36339721","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"http://www.e17.dk/bog/411104","type":"dbcaddi:hasOnlineAccess","access":"","accessType":"","collection":["874310-katalog","870970-forsk"]},{"link":"870971-avis:35299254","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:35686940","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]},{"link":"870971-tsart:36339721","type":"dbcaddi:hasCreatorDescription","access":"","accessType":"","collection":[]}]}}), 'Links to Ereolen');

  });

});
/* eslint-enable */
