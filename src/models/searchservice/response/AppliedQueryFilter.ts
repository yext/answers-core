import SimpleFilter from '../request/SimpleFilter';

/**
 * A filter that the Answers API determined should be applied to the search
 */
export default interface AppliedQueryFilter {
  displayKey: string;
  displayValue: string;
  filter: SimpleFilter;
}