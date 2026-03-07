import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../../../core/services/auth/auth-services';  // Assurez-vous que le chemin est correct
import { ObservationService } from '../../../core/services/observations/observation-services';
import { StatCard } from "../../../shared/components/stat-card/stat-card";  // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-hseagent-dashboard',
  templateUrl: './hseagent-dashboard.html',
  styleUrls: ['./hseagent-dashboard.scss'],
  imports: [StatCard],
})
export class HseagentDashboard implements OnInit {
  totalObservations: number = 0;  // Variable pour stocker le nombre total d'observations
  currentAgentId: string = '';    // Variable pour l'ID de l'agent

  constructor(
    private authService: AuthServices,  // Injection du service AuthServices
    private observationService: ObservationService  // Injection du service ObservationService
  ) {}

  ngOnInit() {
    // Récupérer les informations de l'utilisateur actuel via le service AuthServices
    this.authService.me().subscribe(
      (response) => {
        // L'ID de l'agent se trouve dans response.user._id
        this.currentAgentId = response.user._id;  // Assurez-vous que _id est l'ID de l'agent
        // Appel de l'API pour obtenir le nombre total d'observations pour cet agent
        this.observationService.getObservationsCountByAgent(this.currentAgentId).subscribe(
          (count) => {
            this.totalObservations = count;  // Assigner le nombre d'observations à la variable
          },
          (error) => {
            console.error('Erreur lors de la récupération du total des observations:', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      }
    );
  }
}