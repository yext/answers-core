import { Endpoints } from './models/core/Endpoints';
import { Environment } from './models/core/Environment';
import { CloudRegion } from './models/core/CloudRegion';
import { ServingConfig } from './models/core/SearchConfig';
import { CloudChoice } from './models/core/CloudChoice';

export const defaultApiVersion = 20220511;

/**
 * Provides methods for getting various endpoints.
 *
 * @internal
 */
export class EndpointsFactory {
  private readonly environment: Environment;
  private readonly cloudRegion: CloudRegion;
  private readonly cloudChoice: CloudChoice;

  constructor(config?: ServingConfig) {
    this.environment = config?.environment || Environment.PROD;
    this.cloudRegion = config?.cloudRegion || CloudRegion.US;
    this.cloudChoice = config?.cloudChoice || CloudChoice.GLOBAL_MULTI;
  }

  /** Provides the domain based on environment and cloud region. */
  getDomain() {
    const cloudChoiceSuffix = this.cloudChoice === CloudChoice.GLOBAL_GCP ? '-gcp' : '';
    return `https://${this.environment}-cdn${cloudChoiceSuffix}.${this.cloudRegion}.yextapis.com`;
  }

  /** Provides all endpoints based on environment and cloud region. */
  getEndpoints() {
    return {
      universalSearch: `${this.getDomain()}/v2/accounts/me/search/query`,
      verticalSearch: `${this.getDomain()}/v2/accounts/me/search/vertical/query`,
      questionSubmission: `${this.getDomain()}/v2/accounts/me/createQuestion`,
      status: 'https://answersstatus.pagescdn.com',
      universalAutocomplete: `${this.getDomain()}/v2/accounts/me/search/autocomplete`,
      verticalAutocomplete: `${this.getDomain()}/v2/accounts/me/search/vertical/autocomplete`,
      filterSearch: `${this.getDomain()}/v2/accounts/me/search/filtersearch`,
    };
  }
}

/**
 * The endpoints to use for sandbox experiences.
 *
 * @deprecated Set the appropriate environment and cloud region in {@link ServingConfig} instead.
 *
 * @public
 */
export const SandboxEndpoints: Required<Endpoints> =
  new EndpointsFactory({ environment: Environment.SANDBOX, cloudRegion: CloudRegion.US, cloudChoice: CloudChoice.GLOBAL_MULTI })
    .getEndpoints();
