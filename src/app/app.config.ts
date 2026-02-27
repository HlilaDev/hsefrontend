import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { credentialsInterceptor } from './interceptors/credentials.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
            withInterceptors([credentialsInterceptor])

    ),
    provideRouter(routes),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',   // <-- si tes json sont dans src/assets/i18n
        suffix: '.json',
      }),
      fallbackLang: 'en',
    }),
  ],
};