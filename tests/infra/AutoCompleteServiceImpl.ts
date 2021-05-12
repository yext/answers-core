import { HttpServiceMock } from '../mocks/HttpServiceMock';
import { AnswersConfig } from '../../src/models/core/AnswersConfig';
import {
  UniversalAutocompleteRequest,
  VerticalAutocompleteRequest,
  FilterSearchRequest
} from '../../src/models/autocompleteservice/AutocompleteRequest';
import { HttpService } from '../../src/services/HttpService';
import { AutocompleteServiceImpl } from '../../src/infra/AutocompleteServiceImpl';
import mockAutocompleteResponse from '../fixtures/autocompleteresponse.json';
import mockAutocompleteResponseWithSections from '../fixtures/autocompleteresponsewithsections.json';
import { defaultEndpoints } from '../../src/constants';
import { ApiResponseValidator } from '../../src/validation/ApiResponseValidator';

const expectedVerticalUrl = defaultEndpoints.verticalAutocomplete;
const expectedUniversalUrl = defaultEndpoints.universalAutocomplete;
const expectedFilterUrl = defaultEndpoints.filterSearch;

describe('AutocompleteService', () => {
  const config: AnswersConfig = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'en',
  };
  const mockHttpService = new HttpServiceMock();
  const apiResponseValidator = new ApiResponseValidator();

  describe('Universal Autocomplete', () => {
    it('query params are correct', async () => {
      mockHttpService.get.mockResolvedValue(mockAutocompleteResponse);
      const request: UniversalAutocompleteRequest = {
        input: '',
        sessionTrackingEnabled: false
      };
      const expectedQueryParams = {
        input: '',
        experienceKey: 'testExperienceKey',
        api_key: 'testApiKey',
        v: 20190101,
        locale: 'en',
        sessionTrackingEnabled: false
      };
      const autocompleteService = new AutocompleteServiceImpl(
        config,
        mockHttpService as HttpService,
        apiResponseValidator
      );
      await autocompleteService.universalAutocomplete(request);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams);
    });
  });

  describe('Vertical Autocomplete', () => {
    it('query params are correct', async () => {
      mockHttpService.get.mockResolvedValue(mockAutocompleteResponse);
      const request: VerticalAutocompleteRequest = {
        input: 'salesforce',
        sessionTrackingEnabled: false,
        verticalKey: 'verticalKey'
      };
      const expectedQueryParams = {
        input: 'salesforce',
        experienceKey: 'testExperienceKey',
        api_key: 'testApiKey',
        v: 20190101,
        locale: 'en',
        sessionTrackingEnabled: false,
        verticalKey: 'verticalKey'
      };
      const autocompleteService = new AutocompleteServiceImpl(
        config,
        mockHttpService as HttpService,
        apiResponseValidator
      );
      await autocompleteService.verticalAutocomplete(request);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedVerticalUrl, expectedQueryParams);
    });
  });

  describe('FilterSearch', () => {
    it('query params are correct', async () => {
      mockHttpService.get.mockResolvedValue(mockAutocompleteResponseWithSections);
      const convertedSearchParams = {
        sectioned: false,
        fields: [{
          fieldId: 'field',
          entityTypeId: 'location',
          shouldFetchEntities: false
        }]
      };
      const request: FilterSearchRequest = {
        input: 'salesforce',
        sessionTrackingEnabled: false,
        verticalKey: 'verticalKey',
        sectioned: false,
        fields: [{
          fieldApiName: 'field',
          entityType: 'location',
          fetchEntities: false
        }]
      };
      const expectedQueryParams = {
        input: 'salesforce',
        experienceKey: 'testExperienceKey',
        api_key: 'testApiKey',
        v: 20190101,
        locale: 'en',
        sessionTrackingEnabled: false,
        verticalKey: 'verticalKey',
        search_parameters: JSON.stringify(convertedSearchParams)
      };
      const autocompleteService = new AutocompleteServiceImpl(
        config,
        mockHttpService as HttpService,
        apiResponseValidator
      );
      await autocompleteService.filterSearch(request);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedFilterUrl, expectedQueryParams);
    });
  });
});

describe('additionalQueryParams are passed through', () => {
  const config: AnswersConfig = {
    apiKey: 'testApiKey',
    experienceKey: 'testExperienceKey',
    locale: 'en',
    additionalQueryParams: {
      jsLibVersion: 'LIB_VERSION'
    }
  };
  const mockHttpService = new HttpServiceMock();
  const apiResponseValidator = new ApiResponseValidator();

  it('Universal Autocomplete', async () => {
    mockHttpService.get.mockResolvedValue(mockAutocompleteResponse);
    const request: UniversalAutocompleteRequest = {
      input: ''
    };
    const expectedQueryParams = {
      input: '',
      experienceKey: 'testExperienceKey',
      api_key: 'testApiKey',
      v: 20190101,
      locale: 'en',
      jsLibVersion: 'LIB_VERSION'
    };
    const autocompleteService = new AutocompleteServiceImpl(
      config,
      mockHttpService as HttpService,
      apiResponseValidator
    );
    await autocompleteService.universalAutocomplete(request);
    expect(mockHttpService.get).toHaveBeenCalledWith(expectedUniversalUrl, expectedQueryParams);
  });

  it('Vertical Autocomplete', async () => {
    mockHttpService.get.mockResolvedValue(mockAutocompleteResponse);
    const request: VerticalAutocompleteRequest = {
      input: 'salesforce',
      verticalKey: 'verticalKey'
    };
    const expectedQueryParams = {
      input: 'salesforce',
      experienceKey: 'testExperienceKey',
      api_key: 'testApiKey',
      v: 20190101,
      locale: 'en',
      verticalKey: 'verticalKey',
      jsLibVersion: 'LIB_VERSION'
    };
    const autocompleteService = new AutocompleteServiceImpl(
      config,
      mockHttpService as HttpService,
      apiResponseValidator
    );
    await autocompleteService.verticalAutocomplete(request);
    expect(mockHttpService.get).toHaveBeenCalledWith(expectedVerticalUrl, expectedQueryParams);
  });

  it('FilterSearch', async () => {
    mockHttpService.get.mockResolvedValue(mockAutocompleteResponseWithSections);
    const convertedSearchParams = {
      sectioned: false,
      fields: [{
        fieldId: 'field',
        entityTypeId: 'location',
        shouldFetchEntities: false
      }]
    };
    const request: FilterSearchRequest = {
      input: 'salesforce',
      verticalKey: 'verticalKey',
      sectioned: false,
      fields: [{
        fieldApiName: 'field',
        entityType: 'location',
        fetchEntities: false
      }]
    };
    const expectedQueryParams = {
      input: 'salesforce',
      experienceKey: 'testExperienceKey',
      api_key: 'testApiKey',
      v: 20190101,
      locale: 'en',
      verticalKey: 'verticalKey',
      search_parameters: JSON.stringify(convertedSearchParams),
      jsLibVersion: 'LIB_VERSION'
    };
    const autocompleteService = new AutocompleteServiceImpl(
      config,
      mockHttpService as HttpService,
      apiResponseValidator
    );
    await autocompleteService.filterSearch(request);
    expect(mockHttpService.get).toHaveBeenCalledWith(expectedFilterUrl, expectedQueryParams);
  });
});