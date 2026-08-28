import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  names: string;
  email: string;
  username: string;
  role: UserRole;
  recoveryBalance: string;
  recoveredFunds: string;
  pendingFees: string;
  totalPaid: string;
  activePaymentPlan: string;
  phone: string | null;
  countryCode: string | null;
  dialCode: string | null;
  identityDocument: string | null;
  address: string | null;
  fiscalCountry: string | null;
  profileImage: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  names: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  countryCode: string;
  dialCode: string;
  termsAccepted: boolean;
}

export interface RegistrationResponse {
  message: string;
  user: AuthUser;
}

export interface UpdateProfileRequest {
  names: string;
  email: string;
  phone?: string;
  identityDocument?: string;
  address?: string;
  fiscalCountry?: string;
}

export interface UserDocument {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface ChatbotResponse {
  reply: string;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  concept: string;
  amount: string;
  status: string;
  createdAt: string;
}

export type ComplaintStatus = 'En revisión' | 'Solucionada' | 'Anulada' | 'Cancelada';

export interface Complaint {
  id: string;
  reason: string;
  description: string;
  status: ComplaintStatus;
  attachmentName: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; names: string; email: string };
}

export interface PaymentMethod {
  id: string;
  cardType: 'Crédito' | 'Débito';
  cardholderName: string;
  brand: 'Visa' | 'Mastercard' | 'American Express' | 'Otra';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface UserCase {
  id: string;
  caseNumber: string;
  currentPhase: number;
  currentPhaseName: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; names: string; email: string };
}

export type ConfidentialEvaluationStatus = 'Solicitada' | 'En revisión' | 'Contactada' | 'Aprobada' | 'Rechazada' | 'Cancelada';

export interface ConfidentialEvaluation {
  id: string;
  email: string;
  status: ConfidentialEvaluationStatus;
  createdAt: string;
  updatedAt: string;
}

interface PersistedSession {
  accessToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionStorageKey = 'finlex.authSession';
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';
  private readonly token = signal<string | null>(null);
  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = signal(false);

  constructor() {
    this.restoreSession();
    if (this.isAuthenticated()) this.refreshCurrentUser().subscribe({ error: () => undefined });
  }

  login(email: string, password: string, termsAccepted: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, { email, password, termsAccepted }).pipe(tap(response => this.setSession(response)));
  }

  register(request: RegisterRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiBaseUrl}/auth/register`, request);
  }

  authorizationHeader(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  listUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.apiBaseUrl}/users`, { headers: this.authorizationHeader() });
  }

  updateFinancialSummary(userId: string, recoveryBalance: number, recoveredFunds: number): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.apiBaseUrl}/users/${userId}/financial-summary`, { recoveryBalance, recoveredFunds }, { headers: this.authorizationHeader() });
  }

  updatePaymentSummary(userId: string, pendingFees: number, totalPaid: number, activePaymentPlan: string): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.apiBaseUrl}/users/${userId}/payment-summary`, { pendingFees, totalPaid, activePaymentPlan }, { headers: this.authorizationHeader() });
  }

  refreshCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiBaseUrl}/users/me`, { headers: this.authorizationHeader() }).pipe(tap(user => {
      this.currentUser.set(user);
      this.persistCurrentSession();
    }));
  }

  updateProfile(request: UpdateProfileRequest): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.apiBaseUrl}/users/me/profile`, request, { headers: this.authorizationHeader() })
      .pipe(tap(user => {
        this.currentUser.set(user);
        this.persistCurrentSession();
      }));
  }

  uploadProfileImage(file: File): Observable<AuthUser> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<AuthUser>(`${this.apiBaseUrl}/users/me/profile-image`, formData, { headers: this.authorizationHeader() })
      .pipe(tap(user => { this.currentUser.set(user); this.persistCurrentSession(); }));
  }

  removeProfileImage(): Observable<AuthUser> {
    return this.http.delete<AuthUser>(`${this.apiBaseUrl}/users/me/profile-image`, { headers: this.authorizationHeader() })
      .pipe(tap(user => { this.currentUser.set(user); this.persistCurrentSession(); }));
  }

  listDocuments(): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(`${this.apiBaseUrl}/documents`, { headers: this.authorizationHeader() });
  }

  uploadDocument(file: File): Observable<UserDocument> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UserDocument>(`${this.apiBaseUrl}/documents`, formData, { headers: this.authorizationHeader() });
  }

  sendChatMessage(message: string): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(`${this.apiBaseUrl}/chatbot/message`, { message }, { headers: this.authorizationHeader() });
  }

  listPaymentHistory(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.apiBaseUrl}/payments/history`, { headers: this.authorizationHeader() });
  }

  createComplaint(reason: string, description: string, file?: File): Observable<Complaint> {
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('description', description);
    if (file) formData.append('file', file);
    return this.http.post<Complaint>(`${this.apiBaseUrl}/complaints`, formData, { headers: this.authorizationHeader() });
  }

  listMyComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiBaseUrl}/complaints/mine`, { headers: this.authorizationHeader() });
  }

  listAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiBaseUrl}/complaints/admin`, { headers: this.authorizationHeader() });
  }

  updateComplaintStatus(id: string, status: ComplaintStatus): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiBaseUrl}/complaints/${id}/status`, { status }, { headers: this.authorizationHeader() });
  }

  requestPasswordChange(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiBaseUrl}/auth/request-password-change`, {}, { headers: this.authorizationHeader() });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiBaseUrl}/auth/reset-password`, { token, password });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiBaseUrl}/auth/forgot-password`, { email });
  }

  listPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiBaseUrl}/payments/methods`, { headers: this.authorizationHeader() });
  }

  createPaymentMethod(method: Omit<PaymentMethod, 'id' | 'isDefault' | 'createdAt'>): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.apiBaseUrl}/payments/methods`, method, { headers: this.authorizationHeader() });
  }

  getMyCase(): Observable<UserCase[]> {
    return this.http.get<UserCase[]>(`${this.apiBaseUrl}/cases/mine`, { headers: this.authorizationHeader() });
  }

  createCase(): Observable<UserCase> {
    return this.http.post<UserCase>(`${this.apiBaseUrl}/cases`, {}, { headers: this.authorizationHeader() });
  }

  listAllCases(): Observable<UserCase[]> {
    return this.http.get<UserCase[]>(`${this.apiBaseUrl}/cases/admin`, { headers: this.authorizationHeader() });
  }

  updateCasePhase(id: string, currentPhase: number): Observable<UserCase> {
    return this.http.patch<UserCase>(`${this.apiBaseUrl}/cases/${id}/phase`, { currentPhase }, { headers: this.authorizationHeader() });
  }

  requestConfidentialEvaluation(email: string): Observable<ConfidentialEvaluation> {
    return this.http.post<ConfidentialEvaluation>(`${this.apiBaseUrl}/confidential-evaluations`, { email });
  }

  listConfidentialEvaluations(): Observable<ConfidentialEvaluation[]> {
    return this.http.get<ConfidentialEvaluation[]>(`${this.apiBaseUrl}/confidential-evaluations/admin`, { headers: this.authorizationHeader() });
  }

  updateConfidentialEvaluationStatus(id: string, status: ConfidentialEvaluationStatus): Observable<ConfidentialEvaluation> {
    return this.http.patch<ConfidentialEvaluation>(`${this.apiBaseUrl}/confidential-evaluations/${id}/status`, { status }, { headers: this.authorizationHeader() });
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.sessionStorageKey);
  }

  private setSession(response: AuthResponse): void {
    this.token.set(response.accessToken);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(response));
  }

  private restoreSession(): void {
    const storedSession = localStorage.getItem(this.sessionStorageKey);
    if (!storedSession) return;
    try {
      const session = JSON.parse(storedSession) as PersistedSession;
      if (!session.accessToken || !session.user?.id || this.isTokenExpired(session.accessToken)) {
        this.logout();
        return;
      }
      this.token.set(session.accessToken);
      this.currentUser.set(session.user);
      this.isAuthenticated.set(true);
    } catch {
      this.logout();
    }
  }

  private persistCurrentSession(): void {
    const accessToken = this.token();
    const user = this.currentUser();
    if (accessToken && user) localStorage.setItem(this.sessionStorageKey, JSON.stringify({ accessToken, user }));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
      return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
