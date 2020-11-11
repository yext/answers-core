/* eslint-disable @typescript-eslint/no-explicit-any */

//import Facet from './Facet';
import { default as ResultFactory, Source } from './ResultFactory';
import Result from './Result';
import AppliedQueryFilter from './AppliedQueryFilter';

// Currently the SDk iterates through the results and constructs a map object shaped like
// { mapCenter: centerCordinates, mapMarkers: mapMarkers }
// Do we also want this functionality?
interface VerticalResultProps {
  appliedQueryFilters: AppliedQueryFilter[];
  encodedState: string;
  // facets: Facet[];
  queryDurationMillis: number;
  results: Result[];
  resultsCount: number;
  source: Source;
  verticalKey: string;
}

/**
 * A result from an individual vertical
 */
export default class VerticalResult{
  constructor(private props: VerticalResultProps) {}

  static from(data: any): VerticalResult {
    const appliedQueryFilters = data.appliedQueryFilters.map((appliedQueryFilter: any) => {
      return AppliedQueryFilter.from(appliedQueryFilter);
    });

    return new VerticalResult({
      appliedQueryFilters: appliedQueryFilters,
      encodedState: data.encodedState,
      // facets: facet.fromArray(data.facets),
      queryDurationMillis: data.queryDurationMillis,
      results: ResultFactory.createResultArray(data.results, data.source),
      resultsCount: data.resultsCount,
      source: data.source,
      verticalKey: data.verticalConfigId,
    });
  }

  get encodedState(): string {
    return this.props.encodedState;
  }

  get queryDurationMillis(): number {
    return this.props.queryDurationMillis;
  }

  get results(): Result[] {
    return this.props.results;
  }

  get resultsCount(): number {
    return this.props.resultsCount;
  }

  get source(): string {
    return this.props.source;
  }

  get verticalKey(): string {
    return this.props.verticalKey;
  }

}
