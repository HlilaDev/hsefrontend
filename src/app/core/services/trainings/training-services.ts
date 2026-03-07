import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError, map, catchError } from 'rxjs';

import { API_URLS } from '../../config/api_urls';
import { AuthServices } from '../auth/auth-services';

type UserLite = { _id: string };

@Injectable({ providedIn: 'root' })
export class TrainingServices {
  private http = inject(HttpClient);
  private auth = inject(AuthServices);

  getAllTrainings(): Observable<any> {
    return this.http.get(API_URLS.trainings.allTrainings);
  }

  getTrainingById(id: string): Observable<any> {
    return this.http.get(API_URLS.trainings.getTrainingById(id));
  }

  deleteTraining(id: string): Observable<any> {
    return this.http.delete(API_URLS.trainings.deleteTraining(id));
  }

  // ✅ ICI: createdBy auto via me()
createTraining(dto: any): Observable<any> {
  return this.auth.me().pipe(
    switchMap((response: { user: UserLite }) => {  // Réponse structurée avec { user: UserLite }
      const me = response.user;  // Extraire l'objet 'user' de la réponse

      if (!me?._id) {
        return throwError(() => new Error('Utilisateur non authentifié (me() vide).'));
      }

      const payload = { ...dto, createdBy: me._id };  // Utilisation de _id depuis 'user'
      return this.http.post(API_URLS.trainings.createTraining, payload);
    }),
    catchError((err) => throwError(() => err))
  );
}

  editTraining(id: string, dto: any): Observable<any> {
    return this.http.put(API_URLS.trainings.editTraining(id), dto);
  }

  addParticipant(id: string, participantData: any): Observable<any> {
    return this.http.post(API_URLS.trainings.addParticipant(id), participantData);
  }

  updateParticipant(id: string, participantId: string, participantData: any): Observable<any> {
    return this.http.patch(API_URLS.trainings.updateParticipant(id, participantId), participantData);
  }

  removeParticipant(id: string, participantId: string): Observable<any> {
    return this.http.delete(API_URLS.trainings.removeParticipant(id, participantId));
  }
}