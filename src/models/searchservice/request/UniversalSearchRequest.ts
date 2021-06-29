import { Context } from './Context';
import { LatLong } from './LatLong';
import { QueryTrigger } from './QueryTrigger';
import { QuerySource } from './QuerySource';

/**
 * Options which can be specified for a universal search.
 *
 * @public
 */
export interface UniversalSearchRequest {
  /** The search query. */
  query: string;
  /** {@inheritDoc QueryTrigger} */
  queryTrigger?: QueryTrigger;
  /** Disables spellcheck if true. */
  skipSpellCheck?: boolean;
  /** Enables session tracking. */
  sessionTrackingEnabled?: boolean;
  /** {@inheritDoc LatLong} */
  location?: LatLong;
  /** {@inheritDoc Context} */
  context?: Context;
  /**
   * The URl of the page which referred the user to the current page.
   *
   * @example
   * If a user is on https://www.yext.com/ and navigates to https://www.yext.com/answers and perform a search,
   * the referrerPageUrl would be https://www.yext.com/.
   */
  referrerPageUrl?: string;
  /** {@inheritDoc QuerySource} */
  querySource?: QuerySource;
}