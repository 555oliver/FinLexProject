import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequest } from '../models/contact-request.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact-requests';

  submit(request: ContactRequest): Observable<void> {
    return this.http.post<void>(this.endpoint, request);
  }
}
