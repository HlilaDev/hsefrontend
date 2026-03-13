import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URLS } from '../../config/api_urls';

export type ObservationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ObservationStatus = 'open' | 'in_progress' | 'closed';

export interface ObservationImage {
  url: string;
  uploadedAt?: string;
}

export interface ObservationZone {
  _id: string;
  name: string;
}

export interface ObservationReporter {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
}

export interface Observation {
  _id: string;
  title: string;
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  zone: string | ObservationZone;
  reportedBy: string | ObservationReporter;
  images: ObservationImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ObservationCreateDto {
  title: string;
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  zone: string;
  reportedBy: string;
  images?: ObservationImage[];
}

@Injectable({ providedIn: 'root' })
export class ObservationService {
  constructor(private http: HttpClient) {}

  create(dto: ObservationCreateDto): Observable<Observation> {
    return this.http.post<Observation>(
      API_URLS.observations.create,
      dto,
      { withCredentials: true }
    );
  }

  getById(id: string): Observable<Observation> {
    return this.http.get<Observation>(
      API_URLS.observations.byId(id),
      { withCredentials: true }
    );
  }

  addImage(observationId: string, url: string): Observable<Observation> {
    return this.http.post<Observation>(
      API_URLS.observations.addImage(observationId),
      { url },
      { withCredentials: true }
    );
  }

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

  getObservationsCountByAgent(agentId: string): Observable<number> {
    return this.http.get<{ totalCount: number }>(
      API_URLS.observations.totalCountByAgent(agentId),
      { withCredentials: true }
    ).pipe(
      map((response) => response.totalCount)
    );
  }
}