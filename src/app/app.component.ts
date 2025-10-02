import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, Subscription, interval, map } from 'rxjs';
import { CallService, Call } from './services/call.service'; 
import { VideoPanelComponent } from './components/video-panel/video-panel.component';
import { CallPanelComponent } from './components/call-panel/call-panel.component';
import { HistoryListComponent } from './components/history-list/history-list.component';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule, 
    VideoPanelComponent, 
    CallPanelComponent, 
    HistoryListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  animations: [
    trigger('videoPanelState', [
      // Estado padrão: Vídeo em destaque principal
      state('video-destaque', style({
        // Ajusta a largura para o espaço principal (total - largura da sidebar)
        width: 'calc(100% - 390px)', // Considerando 350px de sidebar + 40px de padding/margem
        height: 'calc(100% - 40px)', // Considerando 20px top + 20px bottom do main-content
        top: '20px',
        left: '20px',
      })),

      // Estado de chamada: Vídeo reduzido no canto
      state('chamada-destaque', style({
        width: '380px', 
        height: '240px', 
        bottom: '20px', 
        right: '20px', // Posição relativa ao main-content
        top: 'auto', // Garante que o bottom: 20px seja respeitado
        left: 'auto' // Garante que o right: 20px seja respeitado
      })),

      // Transição suave (REQ_02)
      transition('video-destaque <=> chamada-destaque', [
        animate('0.7s ease-in-out') 
      ]),
    ]),
  ],
})
// CORREÇÃO ESSENCIAL: Adicionar 'export' para que a classe possa ser importada pelo main.ts
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(VideoPanelComponent) videoPlayer!: VideoPanelComponent;
  currentCall$!: Observable<Call | null>;
  animationState: 'video-destaque' | 'chamada-destaque' = 'video-destaque';

  // REQ_03: Ativa a chamada via teclado (Tecla 'S')
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 's' || event.key === 'S') {
      this.triggerManualCall();
    }
  } 

  // REQ_08: IDs de vídeo para a playlist
  videoPlaylist: string[] = [
    'WdxYgjjPSjg', // ID CORRETO do vídeo "Conheça o QuarkClinic"
    'yq-oN_X7lXs', // Exemplo de segundo vídeo
    'zR_n96I_lO8', // Exemplo de terceiro vídeo
  ];

  // Observable para a DATA (ex: "Segunda-feira, 29 de setembro")
  currentDate$: Observable<string> = interval(1000).pipe(
    map(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long' 
      });
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    })
  );

  // Observable para a HORA (ex: "20:30")
  currentTime$: Observable<string> = interval(1000).pipe(
    map(() => {
      const now = new Date();
      // CÓDIGO COMPLETADO: Fechamento do retorno e do pipe
      return now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    })
  );

  private stateSubscription!: Subscription;

  constructor(public callService: CallService) {} 

  ngOnInit(): void {
    this.currentCall$ = this.callService.currentCall$;

    // Lógica para mudar o estado da animação com base na chamada ativa
    this.stateSubscription = this.currentCall$.subscribe(call => {
      this.animationState = call ? 'chamada-destaque' : 'video-destaque';
    });
  }

  triggerManualCall(): void {
    // Dispara a lógica de chamada no serviço (REQ_03)
    this.callService.triggerNextCall();
    
    // Contorno para REQ_05 (Som): Habilita o som do vídeo após a primeira interação
    if (this.videoPlayer) {
      this.videoPlayer.enableSound();
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }
}