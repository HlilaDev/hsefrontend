import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../../config/api_urls';

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type?: string;
  action?: string;
  severity?: 'info' | 'success' | 'warning' | 'critical';
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
  zone?: string | { _id: string; name?: string };
  device?: string | { _id: string; name?: string; deviceId?: string; status?: string };
  rule?: string | { _id: string; name?: string; metric?: string; operator?: string; threshold?: number };
  alert?: string | { _id: string; title?: string };
  report?: string | { _id: string; title?: string; status?: string };
  observation?: string | { _id: string; title?: string; status?: string };
  incident?: string | { _id: string; title?: string; status?: string };
  audit?: string | { _id: string; title?: string; status?: string };
  training?: string | { _id: string; title?: string; status?: string };
  actor?: string | { _id: string; fullName?: string; firstName?: string; lastName?: string; email?: string };
  user?: string | { _id: string; fullName?: string; firstName?: string; lastName?: string; email?: string };
  meta?: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationServices {
  private http = inject(HttpClient);
  private api = `${BASE_API_URL}/notifications`;

  getAll(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.api);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.api}/unread-count`);
  }

  markAsRead(id: string): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(`${this.api}/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/mark-all-read`, {});
  }

  deleteOne(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}