import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URLS } from '../../config/api_urls';

export type ObservationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ObservationStatus = 'open' | 'in_progress' | 'closed';

export interface ObservationCreateDto {
  title: string;
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  zone: string;       // zoneId
  reportedBy: string; // userId (agent)
  images?: { url: string; uploadedAt?: string }[];
}

@Injectable({ providedIn: 'root' })
export class ObservationService {
  constructor(private http: HttpClient) {}

  // =========================
  // CREATE
  // =========================
  create(dto: ObservationCreateDto): Observable<any> {
    return this.http.post(
      API_URLS.observations.create,
      dto,
      { withCredentials: true }
    );
  }

  // =========================
  // GET BY ID
  // =========================
  getById(id: string): Observable<any> {
    return this.http.get(
      API_URLS.observations.byId(id),
      { withCredentials: true }
    );
  }

  // =========================
  // ADD IMAGE
  // =========================
  addImage(observationId: string, url: string): Observable<any> {
    return this.http.post(
      API_URLS.observations.addImage(observationId),
      { url },
      { withCredentials: true }
    );
  }

  // =========================
  // LIST WITH FILTERS
  // =========================
  list(filters?: {
    zone?: string;
    status?: string;
    severity?: string;
    q?: string;
    page?: number;
    limit?: number;
    reportedBy?: string;
  }): Observable<any> {

    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get(
      API_URLS.observations.list,
      { params, withCredentials: true }
    );
  }

  // =========================
  // GET TOTAL COUNT FOR AGENT
  // =========================
  getObservationsCountByAgent(agentId: string): Observable<number> {
    return this.http.get<{ totalCount: number }>(
      API_URLS.observations.totalCountByAgent(agentId),  // Nouvelle API pour obtenir le nombre total d'observations d'un agent
      { withCredentials: true }
    ).pipe(
      map((response: { totalCount: any; }) => response.totalCount)
    );
  }
}