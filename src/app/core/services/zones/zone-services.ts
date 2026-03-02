import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../config/api_urls';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Zone {
  _id: string;
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateZonePayload {
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  isActive: boolean;
}

export interface UpdateZonePayload {
  name?: string;
  description?: string;
  riskLevel?: RiskLevel;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ZoneServices {
  constructor(private http: HttpClient) {}

  // ✅ GET all zones
  getAllZones(): Observable<{ zones: Zone[] }> {
    return this.http.get<{ zones: Zone[] }>(API_URLS.zones.allZones, {
      withCredentials: true,
    });
  }

  // ✅ GET zone by id
  getZoneById(id: string): Observable<{ zone: Zone }> {
    return this.http.get<{ zone: Zone }>(API_URLS.zones.getZoneById + id, {
      withCredentials: true,
    });
  }

  // ✅ POST create zone
  createZone(payload: CreateZonePayload): Observable<{ zone: Zone }> {
    return this.http.post<{ zone: Zone }>(API_URLS.zones.allZones, payload, {
      withCredentials: true,
    });
  }

  // ✅ PUT update zone
  updateZone(id: string, payload: UpdateZonePayload): Observable<{ zone: Zone }> {
    return this.http.put<{ zone: Zone }>(API_URLS.zones.editZone + id, payload, {
      withCredentials: true,
    });
  }

  // ✅ DELETE zone
  deleteZone(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(API_URLS.zones.deleteZone + id, {
      withCredentials: true,
    });
  }

  // ✅ PATCH quick toggle active (si ton backend accepte PUT, tu peux l’utiliser)
  toggleActive(id: string, isActive: boolean): Observable<{ zone: Zone }> {
    return this.updateZone(id, { isActive });
  }
}