import { DirectAnswer } from './DirectAnswer';
import { DirectAnswerType } from './DirectAnswerType';
import { Snippet } from '../Snippet';
import { BuiltInFieldType } from './BuiltInFieldType';
import { EnumOrLiteral } from '../../../utils/EnumOrLiteral';
import {
  MultiLineTextSnippetDirectAnswer,
  RichTextSnippetDirectAnswer,
  RichTextV2SnippetDirectAnswer,
  HTMLSnippetDirectAnswer,
  MarkdownSnippetDirectAnswer
} from './featuredsnippetdirectanswers';

/**
 * A direct answer which was found within a document.
 *
 * @public
 */
export interface BaseFeaturedSnippetDirectAnswer<T = unknown> extends DirectAnswer<T> {
  /** {@inheritDoc DirectAnswerType.FeaturedSnippet} */
  type: DirectAnswerType.FeaturedSnippet,
  /** {@inheritDoc DirectAnswer.fieldType} */
  fieldType: EnumOrLiteral<
  BuiltInFieldType.MultiLineText |
  BuiltInFieldType.RichText |
  BuiltInFieldType.RichText_v2 |
  BuiltInFieldType.Html |
  BuiltInFieldType.Markdown>,
  /** The snippet where the direct answer was found. */
  snippet: Snippet
}

/**
 * All possible built-in {@link BaseFeaturedSnippetDirectAnswer} interfaces.
 *
 * @public
 */
export type FeaturedSnippetDirectAnswer =
  MultiLineTextSnippetDirectAnswer |
  RichTextSnippetDirectAnswer |
  RichTextV2SnippetDirectAnswer |
  HTMLSnippetDirectAnswer |
  MarkdownSnippetDirectAnswer;
