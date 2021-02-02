import { SimpleFilter } from '../../models/searchservice/request/SimpleFilter';

export function createSimpleFilter(filter: any): SimpleFilter {
  const fieldId = Object.keys(filter)[0];
  const comparator = Object.keys(filter[fieldId])[0];

  return {
    fieldId: fieldId,
    comparator: comparator,
    comparedValue: filter[fieldId][comparator] as string | number | boolean
  };
}