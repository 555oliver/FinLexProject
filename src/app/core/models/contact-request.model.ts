export interface ContactRequest {
  fullName: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  privacyAccepted: boolean;
}
