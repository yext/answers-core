import { createVerticalSearchResponse } from '../transformers/searchservice/createVerticalSearchResponse';
import { SearchService } from '../services/SearchService';
import { defaultApiVersion, defaultEndpoints } from '../constants';
import { QueryParams } from '../models/http/params';
import { QueryTrigger } from '../models/searchservice/request/QueryTrigger';
import { QuerySource } from '../models/searchservice/request/QuerySource';
import { UniversalSearchRequest } from '../models/searchservice/request/UniversalSearchRequest';
import { UniversalSearchResponse } from '../models/searchservice/response/UniversalSearchResponse';
import { createUniversalSearchResponse } from '../transformers/searchservice/createUniversalSearchResponse';
import { HttpService } from '../services/HttpService';
import { AnswersConfig } from '../models/core/AnswersConfig';
import { VerticalSearchRequest } from '../models/searchservice/request/VerticalSearchRequest';
import { VerticalSearchResponse } from '../models/searchservice/response/VerticalSearchResponse';
import { serializeStaticFilters } from '../serializers/serializeStaticFilters';
import { serializeFacets } from '../serializers/serializeFacets';
import { ApiResponseValidator } from '../validation/ApiResponseValidator';
import { ApiResponse } from '../models/answersapi/ApiResponse';

/**
 * Represents the query params which may be sent in a universal search.
 *
 * @internal
 */
interface UniversalSearchQueryParams extends QueryParams {
  input: string,
  experienceKey: string,
  api_key: string,
  v: number,
  version?: string | number,
  location?: string,
  locale?: string,
  skipSpellCheck?: boolean,
  sessionTrackingEnabled?: boolean
  queryTrigger?: QueryTrigger,
  context?: string;
  referrerPageUrl?: string,
  source?: QuerySource
}

/**
 * Represents the query params which may be sent in a vertical search.
 *
 * @internal
 */
interface VerticalSearchQueryParams extends QueryParams {
  experienceKey: string,
  api_key: string,
  v: number,
  version?: string | number,
  locale?: string,
  input: string,
  location?: string,
  verticalKey: string,
  filters?: string,
  limit?: number,
  offset?: number,
  retrieveFacets?: boolean,
  facetFilters?: string,
  skipSpellCheck?: boolean,
  queryTrigger?: QueryTrigger,
  sessionTrackingEnabled?: boolean,
  sortBys?: string,
  context?: string,
  referrerPageUrl?: string,
  source?: QuerySource,
  locationRadius?: string,
  queryId?: string
}

/**
 * The implementation of SearchService which hits LiveAPI.
 *
 * @internal
 */
export class SearchServiceImpl implements SearchService {
  private config: AnswersConfig;
  private httpService: HttpService;
  private apiResponseValidator: ApiResponseValidator;
  private verticalSearchEndpoint: string;
  private universalSearchEndpoint: string;

  constructor(
    config: AnswersConfig,
    httpService: HttpService,
    apiResponseValidator: ApiResponseValidator
  ) {
    this.config = config;
    this.httpService = httpService;
    this.apiResponseValidator = apiResponseValidator;
    this.universalSearchEndpoint = config.endpoints?.universalSearch
      ?? defaultEndpoints.universalSearch;
    this.verticalSearchEndpoint = config.endpoints?.verticalSearch
      ?? defaultEndpoints.verticalSearch;
  }

  async universalSearch(request: UniversalSearchRequest): Promise<UniversalSearchResponse> {
    this.injectToStringMethods(request);

    const queryParams: UniversalSearchQueryParams = {
      input: request.query,
      experienceKey: this.config.experienceKey,
      api_key: this.config.apiKey,
      v: defaultApiVersion,
      version: this.config.experienceVersion,
      location: request.location?.toString(),
      locale: this.config.locale,
      skipSpellCheck: request.skipSpellCheck,
      sessionTrackingEnabled: request.sessionTrackingEnabled,
      queryTrigger: request.queryTrigger,
      context: JSON.stringify(request.context || undefined),
      referrerPageUrl: request.referrerPageUrl,
      source: request.querySource || QuerySource.Standard,
      ...this.config?.additionalQueryParams
    };

    const response =
      await this.httpService.get<ApiResponse>(this.universalSearchEndpoint, queryParams);

    const validationResult = this.apiResponseValidator.validate(response);
    if (validationResult instanceof Error) {
      return Promise.reject(validationResult);
    }

    return createUniversalSearchResponse(response);
  }

  async verticalSearch(request: VerticalSearchRequest): Promise<VerticalSearchResponse> {
    this.injectToStringMethods(request);

    const queryParams: VerticalSearchQueryParams = {
      experienceKey: this.config.experienceKey,
      api_key: this.config.apiKey,
      v: defaultApiVersion,
      version: this.config.experienceVersion,
      locale: this.config.locale,
      input: request.query,
      location: request.location?.toString(),
      verticalKey: request.verticalKey,
      filters: request.staticFilters && serializeStaticFilters(request.staticFilters),
      limit: request.limit,
      offset: request.offset,
      retrieveFacets: request.retrieveFacets,
      facetFilters: request.facets && serializeFacets(request.facets),
      skipSpellCheck: request.skipSpellCheck,
      queryTrigger: request.queryTrigger,
      sessionTrackingEnabled: request.sessionTrackingEnabled,
      sortBys: JSON.stringify(request.sortBys || []),
      context: JSON.stringify(request.context || undefined),
      referrerPageUrl: request.referrerPageUrl,
      source: request.querySource || QuerySource.Standard,
      locationRadius: request.locationRadius?.toString(),
      queryId: request.queryId,
      ...this.config?.additionalQueryParams
    };

    const response =
      await this.httpService.get<ApiResponse>(this.verticalSearchEndpoint, queryParams);

    const validationResult = this.apiResponseValidator.validate(response);
    if (validationResult instanceof Error) {
      return Promise.reject(validationResult);
    }

    return createVerticalSearchResponse(response);
  }

  /**
   * Injects toString() methods into the request objects that require them
   */
  private injectToStringMethods(request: UniversalSearchRequest): void {
    if (request.location) {
      request.location.toString = function() {
        return `${this.latitude},${this.longitude}`;
      };
    }
  }
}