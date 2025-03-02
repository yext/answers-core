/**
 * Represents the source of a {@link Result}.
 *
 * @public
 */
export enum Source {
  /** The result is from a Knowledge Graph. */
  KnowledgeManager = 'KNOWLEDGE_MANAGER',
  /** The result is from Google Custom Search Engine. */
  Google = 'GOOGLE_CSE',
  /** The result was from a custom source. */
  Custom = 'CUSTOM_SEARCHER',
  /** The result is from a document vertical. */
  DocumentVertical = 'DOCUMENT_VERTICAL',
  /** The result is from a function vertical. */
  FunctionVertical = 'FUNCTION_VERTICAL',
}
