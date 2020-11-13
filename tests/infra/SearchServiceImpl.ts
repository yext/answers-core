import HttpServiceMock from '../mocks/HttpServiceMock';
import mockUniversalResponse from '../fixtures/universalresponse.json';
import SearchServiceImpl from '../../src/infra/SearchServiceImpl';
import Config from '../../src/models/core/Config';
import UniversalSearchRequest from '../../src/models/searchservice/request/UniversalSearchRequest';
import HttpService from '../../src/services/HttpService';
import { QueryTrigger } from '../../src/models/searchservice/request/QueryTrigger';

describe('SearchService', () => {
  const configWithRequiredParams: Config = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey'
  };

  const configWithAllParams: Config = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'es',
    configurationLabel: 'PRODUCTION'
  };

  const mockHttpService = new HttpServiceMock();

  describe('Universal Search', () => {
    mockHttpService.setMockResponse(mockUniversalResponse);
    const expectedUniversalUrl = 'https://liveapi.yext.com/v2/accounts/me/answers/query';
    it('Query params are correct when only required params are supplied', async () => {
      const requestWithRequiredParams: UniversalSearchRequest = {
        query: 'testQuery'
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        context: undefined,
        experienceKey: 'testExperienceKey',
        input: 'testQuery',
        locale: undefined,
        location: undefined,
        queryTrigger: undefined,
        referrerPageUrl: undefined,
        sessionTrackingEnabled: undefined,
        skipSpellCheck: true,
        v: 20190101,
        version: undefined
      };
      const searchService: SearchServiceImpl = new SearchServiceImpl(
        configWithRequiredParams,
        mockHttpService as HttpService
      );
      await searchService.universalSearch(requestWithRequiredParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams);
    });

    it('Query params are correct when all possible params are supplied', async () => {
      const requestWithAllParams: UniversalSearchRequest = {
        query: 'testQuery',
        queryTrigger: QueryTrigger.Initialize,
        spellCheckEnabled: true,
        sessionTrackingEnabled: true,
        coordinates: {
          latitude: '40',
          longitude: '40'
        },
        context: {
          key: 'value'
        },
        referrerPageUrl: 'yext.com'
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        context: '{\"key\":\"value\"}',
        experienceKey: 'testExperienceKey',
        input: 'testQuery',
        locale: 'es',
        location: '40,40',
        queryTrigger: 'initialize',
        referrerPageUrl: 'yext.com',
        sessionTrackingEnabled: true,
        skipSpellCheck: false,
        v: 20190101,
        version: 'PRODUCTION'
      };
      const searchService: SearchServiceImpl = new SearchServiceImpl(
        configWithAllParams,
        mockHttpService as HttpService
      );
      await searchService.universalSearch(requestWithAllParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams);
    });
  });
});
