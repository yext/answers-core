import { Result } from '../../models/searchservice/response/Result';
import { Source } from '../../models/searchservice/response/Source';
import { HighlightedValueFactory } from './HighlightedValueFactory';

/**
 * A factory which creates results from different sources
 */
export class ResultsFactory {
  public static create(results: any, source: Source): Result[] {
    if (!results) {
      return [];
    }

    return results.map((result: any, index: number) => {
      result = {
        ...result,
        index: index + 1
      };

      switch (source) {
        case Source.KnowledgeManager:
          return this.fromKnowledgeManager(result);
        case Source.Google:
          return this.fromGoogleCustomSearchEngine(result);
        case Source.Bing:
          return this.fromBingCustomSearchEngine(result);
        case Source.Zendesk:
          return this.fromZendeskSearchEngine(result);
        case Source.Algolia:
          return this.fromAlgoliaSearchEngine(result);
        default:
          return this.fromGeneric(result);
      }
    });
  }

  private static fromKnowledgeManager(result: any): Result {
    const rawData = result.data ?? {};
    return {
      rawData: rawData,
      source: Source.KnowledgeManager,
      index: result.index,
      name: rawData.name,
      description: rawData.description,
      link: rawData.website,
      id: rawData.id,
      distance: result.distance,
      distanceFromFilter: result.distanceFromFilter,
      highlightedValues: HighlightedValueFactory.create(result.highlightedFields),
      entityType: rawData.type
    };
  }

  private static fromGoogleCustomSearchEngine(result: any): Result {
    return {
      rawData: result,
      source: Source.Google,
      index: result.index,
      name: result.htmlTitle.replace(/(<([^>]+)>)/ig, ''),
      description: result.htmlSnippet,
      link: result.link
    };
  }

  private static fromBingCustomSearchEngine(result: any): Result {
    return {
      rawData: result,
      source: Source.Bing,
      index: result.index,
      name: result.name,
      description: result.snippet,
      link: result.url
    };
  }

  private static fromZendeskSearchEngine(result: any): Result {
    return {
      rawData: result,
      source: Source.Zendesk,
      index: result.index,
      name: result.title,
      description: result.snippet,
      link: result.html_url
    };
  }

  private static fromAlgoliaSearchEngine(result: any): Result {
    return {
      rawData: result,
      source: Source.Algolia,
      index: result.index,
      name: result.name,
      id: result.objectID
    };
  }

  private static fromGeneric(result: any): Result {
    return {
      rawData: result,
      source: Source.Generic,
      index: result.index,
      name: result.name,
      description: result.description, // Do we want to truncate this like in the SDK?
      link: result.website,
      id: result.id,
    };
  }

  public static fromDirectAnswer(result: any): Result {
    const rawData = result.fieldValues ?? {};
    return {
      rawData: rawData,
      source: Source.KnowledgeManager,
      name: rawData.name,
      description: rawData.description,
      link: result.website,
      id: result.id,
      entityType: result.type,
    };
  }
}