import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../../config/api_urls';

export interface LiveAlert {
  _id?: string;
  type?: string;
  title?: string;
  message?: string;
  severity?: 'info' | 'warning' | 'critical';
  status?: 'open' | 'acknowledged' | 'resolved';
  readingValue?: number;
  threshold?: number;
  createdAt?: string;
  updatedAt?: string;
  zone?: string | { _id: string; name?: string };
  device?:
    | string
    | { _id: string; name?: string; deviceId?: string; status?: string };
  rule?:
    | string
    | {
        _id: string;
        name?: string;
        metric?: string;
        operator?: string;
        threshold?: number;
        severity?: string;
      };
}

@Injectable({
  providedIn: 'root',
})
export class SocketServices {
  private socket: Socket | null = null;

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  onNewAlert(): Observable<LiveAlert> {
    return new Observable<LiveAlert>((observer) => {
      if (!this.socket) {
        this.connect();
      }

      const handler = (data: LiveAlert) => {
        observer.next(data);
      };

      this.socket?.on('alert:new', handler);

      return () => {
        this.socket?.off('alert:new', handler);
      };
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getZoneName(zone: LiveAlert['zone']): string {
    if (!zone) return '-';
    return typeof zone === 'string' ? zone : zone.name || zone._id;
  }

  getDeviceName(device: LiveAlert['device']): string {
    if (!device) return '-';
    if (typeof device === 'string') return device;
    return device.name || device.deviceId || device._id;
  }
}