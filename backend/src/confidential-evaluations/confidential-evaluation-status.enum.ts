export enum ConfidentialEvaluationStatus {
  Requested = 'Solicitada',
  InReview = 'En revisión',
  Contacted = 'Contactada',
  Approved = 'Aprobada',
  Rejected = 'Rechazada',
  Cancelled = 'Cancelada',
}

export const ACTIVE_CONFIDENTIAL_EVALUATION_STATUSES = [
  ConfidentialEvaluationStatus.Requested,
  ConfidentialEvaluationStatus.InReview,
  ConfidentialEvaluationStatus.Contacted,
  ConfidentialEvaluationStatus.Approved,
];
