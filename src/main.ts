import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Esta é a função que inicializa a aplicação Angular
bootstrapApplication(AppComponent, {
  providers: [
    // Habilita o módulo de animações para toda a aplicação (essencial para REQ_02)
    provideAnimations(), 
    
    // Provedores para módulos que não têm funções 'provide' nativas (ex: HttpClientModule)
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));