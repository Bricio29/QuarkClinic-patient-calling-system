import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

// REQ_05: Reprodução de Vídeo em loop e com som.
declare var YT: any; 

@Component({
  selector: 'app-video-panel',
  standalone: true,
  imports: [CommonModule],
  // O caminho do template foi ajustado para './video-panel.component.html'
  templateUrl: './video-panel.component.html', 
  styleUrls: ['./video-panel.component.css']
})
export class VideoPanelComponent implements OnInit, AfterViewInit {
  player: any;

  // CORREÇÃO: @Input() garantido (resolve o erro NG8002)
  @Input() playlistIds: string[] = ['WdxYgjjPSjg']; 

  private get initialVideoId(): string {
    // Usa o primeiro ID da playlist como vídeo inicial.
    return this.playlistIds.length > 0 ? this.playlistIds[0] : 'WdxYgjjPSjg';
  }
  
  // A playlistString não é mais necessária, pois passaremos o array diretamente no loadPlaylist.
  // private get playlistString(): string {
  //   return this.playlistIds.join(',');
  // }

  @Input() isDestaque: boolean = true; 

  ngOnInit() {
    // 1. Carrega o script da API do YouTube Iframe
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }

  ngAfterViewInit() {
    // 2. Define a função de callback global
    (window as any).onYouTubeIframeAPIReady = () => {
      this.initializePlayer();
    };

    // Caso o script já tenha sido carregado antes do ngAfterViewInit
    if ((window as any).YT && (window as any).YT.Player) {
      this.initializePlayer();
    }
  }

  private initializePlayer(): void {
    this.player = new YT.Player('player-iframe', { 
      height: '100%',
      width: '100%',
      // Definimos o primeiro ID como vídeo inicial
      videoId: this.initialVideoId, 
      playerVars: {
        autoplay: 1, // Inicia o vídeo (mudo)
        controls: 0, // Oculta os controles
        mute: 1, // CHAVE para autoplay funcionar em navegadores
        // REMOVEMOS 'loop' e 'playlist' daqui para evitar o erro de inicialização
      },
      events: {
        // NOVO MANIPULADOR: Carrega a playlist após o player estar pronto
        'onReady': this.onPlayerReadyForPlaylist.bind(this), 
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

  // REQ_08 / REQ_05: Carrega a playlist e configura o loop (abordagem robusta)
  private onPlayerReadyForPlaylist(event: any): void {
      // 1. Carrega a playlist com o array de IDs
      event.target.loadPlaylist({
          playlist: this.playlistIds, // Passa o array de strings
          index: 0, // Começa no primeiro vídeo
          startSeconds: 0
      });
      
      // 2. Configura o loop manualmente
      this.player.setLoop(true); 
      
      // 3. Garante que toque (se o autoplay: 1 não tiver funcionado)
      event.target.playVideo(); 
  }


  private onPlayerStateChange(event: any): void {
    // Este evento é um backup. Com setLoop(true) ativo, ele não deve ser acionado.
    if (event.data === YT.PlayerState.ENDED) {
      this.player.playVideo();
    } 
  }

  // REQ_05: Método público chamado pelo AppComponent na interação do usuário ('S')
  public enableSound(): void {
    if (this.player && typeof this.player.unMute === 'function') {
      // Tenta desmutar o vídeo
      this.player.unMute();
      this.player.setVolume(100); 
    }
  }
}