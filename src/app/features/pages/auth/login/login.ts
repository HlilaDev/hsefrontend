import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule , TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
