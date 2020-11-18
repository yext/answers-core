/**
 * Options for a QuestionSubmission createQuestion request
 */
export default interface QuestionSubmissionRequest {
  email: string
  entityId: string
  name: string
  questionText: string
  questionDescription?: string
  sessionTrackingEnabled?: boolean
}

