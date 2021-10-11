import { HttpServiceMock } from '../mocks/HttpServiceMock';
import { SearchServiceImpl } from '../../src/infra/SearchServiceImpl';
import { AnswersConfig } from '../../src/models/core/AnswersConfig';
import { UniversalSearchRequest } from '../../src/models/searchservice/request/UniversalSearchRequest';
import { HttpService } from '../../src/services/HttpService';
import { QueryTrigger } from '../../src/models/searchservice/request/QueryTrigger';
import { QuerySource } from '../../src/models/searchservice/request/QuerySource';
import { VerticalSearchRequest } from '../../src/models/searchservice/request/VerticalSearchRequest';
import { ApiResponseValidator } from '../../src/validation/ApiResponseValidator';
import { Matcher } from '../../src/models/searchservice/common/Matcher';
import { Direction } from '../../src/models/searchservice/request/Direction';
import { SortType } from '../../src/models/searchservice/request/SortType';

describe('SearchService', () => {
  const configWithRequiredApiKey: AnswersConfig = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'en'
  };

  const configWithRequiredToken: AnswersConfig = {
    token: 'testToken',
    experienceKey: 'testExperienceKey',
    locale: 'en'
  };

  const configWithAllParams: AnswersConfig = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'es',
    experienceVersion: 'PRODUCTION',
    visitor: {
      id: '123',
      idMethod: 'YEXT_AUTH'
    }
  };

  const apiResponseValidator = new ApiResponseValidator();

  let mockHttpService,
    searchServiceWithRequiredApiKey,
    searchServiceWithAllParams,
    searchServiceWithRequiredToken;

  beforeEach(() => {
    mockHttpService = new HttpServiceMock();
    mockHttpService.get.mockResolvedValue({
      response: {},
      meta: {},
    });

    searchServiceWithRequiredApiKey = new SearchServiceImpl(
      configWithRequiredApiKey,
      mockHttpService as HttpService,
      apiResponseValidator
    );

    searchServiceWithAllParams = new SearchServiceImpl(
      configWithAllParams,
      mockHttpService as HttpService,
      apiResponseValidator
    );

    searchServiceWithRequiredToken = new SearchServiceImpl(
      configWithRequiredToken,
      mockHttpService as HttpService,
      apiResponseValidator
    );
  });

  describe('Universal Search', () => {
    const expectedUniversalUrl = 'https://liveapi.yext.com/v2/accounts/me/answers/query';

    it('Query params are correct when only required params (without token) are supplied', async () => {
      const requestWithRequiredParams: UniversalSearchRequest = {
        query: 'testQuery'
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        experienceKey: 'testExperienceKey',
        input: 'testQuery',
        locale: 'en',
        v: 20190101,
        source: 'STANDARD'
      };
      await searchServiceWithRequiredApiKey.universalSearch(requestWithRequiredParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams, undefined);
    });

    it('Query params are correct when only required params (without apikey) are supplied', async () => {
      const requestWithRequiredParams: UniversalSearchRequest = {
        query: 'testQuery'
      };
      const expectedQueryParams = {
        experienceKey: 'testExperienceKey',
        input: 'testQuery',
        locale: 'en',
        v: 20190101,
        source: 'STANDARD'
      };
      await searchServiceWithRequiredToken.universalSearch(requestWithRequiredParams);
      expect(mockHttpService.get)
        .toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams, 'testToken');
    });

    it('Query params are correct when all possible params are supplied', async () => {
      const requestWithAllParams: UniversalSearchRequest = {
        query: 'testQuery',
        queryTrigger: QueryTrigger.Initialize,
        skipSpellCheck: true,
        sessionId: '8ad0cb51-82f6-4ad9-bc62-b358115fde30',
        sessionTrackingEnabled: true,
        location: {
          latitude: 40,
          longitude: 40
        },
        context: {
          key: 'value'
        },
        referrerPageUrl: 'yext.com',
        querySource: QuerySource.Standard,
        limit: { people: 17 },
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        context: JSON.stringify({ key:'value' }),
        experienceKey: 'testExperienceKey',
        limit: JSON.stringify({ people: 17 }),
        input: 'testQuery',
        locale: 'es',
        location: '40,40',
        queryTrigger: 'initialize',
        referrerPageUrl: 'yext.com',
        session_id: '8ad0cb51-82f6-4ad9-bc62-b358115fde30',
        sessionTrackingEnabled: true,
        skipSpellCheck: true,
        v: 20190101,
        version: 'PRODUCTION',
        source: 'STANDARD',
        visitor: JSON.stringify({
          id: '123',
          idMethod: 'YEXT_AUTH'
        })
      };
      await searchServiceWithAllParams.universalSearch(requestWithAllParams);
      expect(mockHttpService.get)
        .toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams, undefined);
    });

    it('A custom universal search service endpoint may be supplied', async () => {
      const customUrl = 'http://custom.endpoint.com/api';
      const config: AnswersConfig = {
        ...configWithRequiredApiKey,
        endpoints: {
          universalSearch: customUrl
        }
      };
      const searchService: SearchServiceImpl = new SearchServiceImpl(
        config,
        mockHttpService as HttpService,
        apiResponseValidator
      );
      await searchService.universalSearch({query: 'test'});
      expect(mockHttpService.get).toHaveBeenCalledWith(customUrl, expect.anything(), undefined);
    });

    it('An arbitrary string may be supplied as a querySource', async () => {
      await searchServiceWithRequiredApiKey.universalSearch({
        query: 'test',
        querySource: 'CUSTOM_SOURCE'
      });
      const expectedQueryParams = expect.objectContaining({
        source: 'CUSTOM_SOURCE'
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams, undefined);
    });
  });

  describe('Vertical Search', ()=> {
    const expectedVerticalUrl = 'https://liveapi.yext.com/v2/accounts/me/answers/vertical/query';

    it('Query params are correct when only required params (without token) are supplied', async () => {
      const requestWithRequiredParams: VerticalSearchRequest = {
        query: 'testQuery',
        verticalKey: 'verticalKey'
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        experienceKey: 'testExperienceKey',
        verticalKey: 'verticalKey',
        input: 'testQuery',
        locale: 'en',
        v: 20190101,
        source: 'STANDARD',
        sortBys: '[]',
      };
      await searchServiceWithRequiredApiKey.verticalSearch(requestWithRequiredParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedVerticalUrl, expectedQueryParams, undefined);
    });

    it('Query params are correct when only required params (without apiKey) are supplied', async () => {
      const requestWithRequiredParams: VerticalSearchRequest = {
        query: 'testQuery',
        verticalKey: 'verticalKey'
      };
      const expectedQueryParams = {
        experienceKey: 'testExperienceKey',
        verticalKey: 'verticalKey',
        input: 'testQuery',
        locale: 'en',
        v: 20190101,
        source: 'STANDARD',
        sortBys: '[]',
      };
      await searchServiceWithRequiredToken.verticalSearch(requestWithRequiredParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedVerticalUrl, expectedQueryParams, 'testToken');
    });

    it('Query params are correct when all possible params are supplied', async () => {
      const requestWithAllParams: VerticalSearchRequest = {
        context: {
          key: 'value'
        },
        facets: [{
          fieldId: 'c_awards',
          options: [{
            matcher: Matcher.Equals,
            value: 'Impact Award'
          }]
        }],
        limit: 10,
        location: {
          latitude: 40,
          longitude: 40
        },
        locationRadius: 100,
        offset: 10,
        query: 'testQuery',
        queryId: '260cc620-7421-44dd-afe8-07d50361e389',
        querySource: QuerySource.Standard,
        queryTrigger: QueryTrigger.Initialize,
        referrerPageUrl: 'yext.com',
        retrieveFacets: true,
        sessionId: '8ad0cb51-82f6-4ad9-bc62-b358115fde30',
        sessionTrackingEnabled: true,
        skipSpellCheck: true,
        sortBys: [{
          direction: Direction.Ascending,
          field: 'name',
          type: SortType.Field
        }],
        staticFilters: {
          fieldId: 'city',
          matcher: Matcher.NotEquals,
          value: 'Arlington'
        },
        verticalKey: 'verticalKey'
      };
      const expectedQueryParams = {
        api_key: 'testApiKey',
        context: JSON.stringify({key: 'value'}),
        experienceKey: 'testExperienceKey',
        facetFilters: JSON.stringify({
          c_awards:[{
            c_awards: { $eq:'Impact Award' }
          }]
        }),
        filters: JSON.stringify({
          city:{['!$eq']: 'Arlington'}
        }),
        input: 'testQuery',
        limit: 10,
        locale: 'es',
        location: '40,40',
        locationRadius: '100',
        offset: 10,
        queryId: '260cc620-7421-44dd-afe8-07d50361e389',
        queryTrigger: 'initialize',
        referrerPageUrl: 'yext.com',
        retrieveFacets: true,
        session_id: '8ad0cb51-82f6-4ad9-bc62-b358115fde30',
        sessionTrackingEnabled: true,
        skipSpellCheck: true,
        sortBys: JSON.stringify([{
          direction:'ASC',
          field:'name',
          type: 'FIELD'
        }]),
        source: 'STANDARD',
        v: 20190101,
        version: 'PRODUCTION',
        verticalKey: 'verticalKey',
        visitor: JSON.stringify({
          id: '123',
          idMethod: 'YEXT_AUTH'
        })
      };
      await searchServiceWithAllParams.verticalSearch(requestWithAllParams);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedVerticalUrl, expectedQueryParams, undefined);
    });

    it('Passes locationRadius = 0 correctly, despite it being a falsy value', async () => {
      const request = {
        query: 'testQuery',
        verticalKey: 'verticalKey',
        locationRadius: 0.0
      };
      await searchServiceWithRequiredApiKey.verticalSearch(request);
      const actualQueryParams = mockHttpService.get.mock.calls[0][1];
      const actualLocationRadius = (actualQueryParams as { locationRadius: string }).locationRadius;
      expect(actualLocationRadius).toEqual('0');
    });

    it('Passes locationRadius with decimal correctly', async () => {
      const request = {
        query: 'testQuery',
        verticalKey: 'verticalKey',
        locationRadius: 1.23
      };
      await searchServiceWithRequiredApiKey.verticalSearch(request);
      const actualQueryParams = mockHttpService.get.mock.calls[0][1];
      const actualLocationRadius = (actualQueryParams as { locationRadius: string }).locationRadius;
      expect(actualLocationRadius).toEqual('1.23');
    });
  });
});

describe('additionalQueryParams are passed through', () => {
  const coreConfig: AnswersConfig = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'en',
    additionalQueryParams: {
      jsLibVersion: 'LIB_VERSION'
    }
  };

  let mockHttpService, apiResponseValidator, searchService;
  beforeEach(() => {
    mockHttpService = new HttpServiceMock();
    mockHttpService.get.mockResolvedValue({
      response: {},
      meta: {},
    });
    apiResponseValidator = new ApiResponseValidator();
    searchService = new SearchServiceImpl(
      coreConfig,
      mockHttpService as HttpService,
      apiResponseValidator
    );
  });

  it('universalSearch', async () => {
    const request: UniversalSearchRequest = {
      query: 'testQuery'
    };
    await searchService.universalSearch(request);
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    expect(mockHttpService.get.mock.calls[0][1]).toEqual(expect.objectContaining({
      jsLibVersion: 'LIB_VERSION'
    }));
  });

  it('verticalSearch', async () => {
    const request: VerticalSearchRequest = {
      query: 'testQuery',
      verticalKey: 'verticalKey'
    };

    await searchService.verticalSearch(request);
    expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    expect(mockHttpService.get.mock.calls[0][1]).toEqual(expect.objectContaining({
      jsLibVersion: 'LIB_VERSION'
    }));
  });
});