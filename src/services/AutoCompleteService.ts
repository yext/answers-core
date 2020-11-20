import { AutoCompleteResponse } from '../models/autocompleteservice/AutoCompleteResponse';
import { AutoCompleteRequest } from '../models/autocompleteservice/AutoCompleteRequest';

/**
* An interface for a service that performs query suggestions.
*
*/
export interface AutoCompleteService {

  /**
   * Retrieves query suggestions for universal.
   *
   * @param {AutoCompleteRequest} request
   * @returns {Promise<AutoCompleteData>}
   */
  autoCompleteForUniversal(request: AutoCompleteRequest): Promise<AutoCompleteResponse>;

  /**
   * Retrieves query suggestions for a vertical.
   *
   * @param {AutoCompleteRequest} request
   * @returns {Promise<AutoCompleteData>}
   */
  autoCompleteForVertical(request: AutoCompleteRequest): Promise<AutoCompleteResponse>;

  /**
   * Retrieves query suggestions for filter search.
   *
   * @param {AutoCompleteRequest} request
   * @returns {Promise<AutoCompleteData>}
   */
  autoCompleteForFilter(request: AutoCompleteRequest): Promise<AutoCompleteResponse>;
 }