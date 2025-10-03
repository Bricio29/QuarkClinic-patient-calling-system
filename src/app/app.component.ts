import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
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
    HistoryListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('videoPanelState', [
      // Estado padrão: Vídeo em destaque principal
      state(
        'video-destaque',
        style({
          // Aumentamos o espaçamento de 40px (20 de cada lado) para 80px (40 de cada lado)
          width: 'calc(100% - 420px - 80px)',
          height: 'calc(100% - 80px)',
          // Ajustamos a posição para centralizar com o novo espaçamento
          top: '40px',
          left: '40px',
        })
      ),

      // Estado de chamada: Vídeo reduzido no canto inferior direito
      state(
        'chamada-destaque',
        style({
          width: '380px',
          height: '240px',
          bottom: '20px',
          right: '20px',
          top: 'auto',
          left: 'auto',
        })
      ),

      // Transição suave
      transition('video-destaque <=> chamada-destaque', [
        animate('0.7s ease-in-out'),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(VideoPanelComponent) videoPlayer!: VideoPanelComponent;
  currentCall$!: Observable<Call | null>;
  animationState: 'video-destaque' | 'chamada-destaque' = 'video-destaque';
  isMuted: boolean = true; // Estado local do som (inicia mudo) // REQ_03: Ativa a chamada via teclado (Tecla 'S')

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    if (event.key === 's' || event.key === 'S') {
      this.triggerManualCall();
      event.preventDefault();
    }

    // Controle de Mudo (tecla 'M')
    if (event.key === 'm' || event.key === 'M') {
      this.onToggleVideoMute();
      event.preventDefault();
    }
  } // REQ_08: IDs de vídeo para a playlist
  videoPlaylist: string[] = [
    'WdxYgjjPSjg', // ID do vídeo "Conheça o QuarkClinic"
  ]; // Observable para a DATA

  currentDate$: Observable<string> = interval(1000).pipe(
    map(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      });
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    })
  ); // Observable para a HORA

  currentTime$: Observable<string> = interval(1000).pipe(
    map(() => {
      const now = new Date();
      return now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    })
  );

  private stateSubscription!: Subscription;

  constructor(public callService: CallService) {}

  ngOnInit(): void {
    this.currentCall$ = this.callService.currentCall$;

    this.stateSubscription = this.currentCall$.subscribe((call) => {
      this.animationState = call ? 'chamada-destaque' : 'video-destaque';
    });
  }

  triggerManualCall(): void {
    this.callService.triggerNextCall(); // REQ_05: Habilita o som do vídeo após a primeira interação (se estiver mudo)

    if (this.videoPlayer && this.isMuted) {
      this.videoPlayer.enableSound();
      this.isMuted = false;
    }
  }

  // Lógica para o botão de Mudo/Volume da Sidebar
  onToggleVideoMute(): void {
    if (!this.videoPlayer || !this.videoPlayer.player) return;

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.videoPlayer.player.mute();
    } else {
      this.videoPlayer.enableSound();
    }
  }

  // Lógica para o botão de Ampliar/Reduzir da Sidebar
  onToggleVideoSize(): void {
    // Se houver uma chamada ativa, o botão volta ao estado padrão (REQ_04)
    if (this.animationState === 'chamada-destaque') {
      this.callService.returnToDefaultState();
    } else {
      // Caso contrário, minimiza o vídeo para o canto, sem disparar uma chamada
      this.animationState = 'chamada-destaque';
    }
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }
}
