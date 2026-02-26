import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
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