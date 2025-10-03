import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// REQ_05: Reprodução de Vídeo em loop e com som.
declare var YT: any;

@Component({
  selector: 'app-video-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.css'],
})
export class VideoPanelComponent implements OnInit, AfterViewInit {
  player: any;

  @Input() playlistIds: string[] = ['WdxYgjjPSjg'];

  private get initialVideoId(): string {
    return this.playlistIds.length > 0 ? this.playlistIds[0] : 'WdxYgjjPSjg';
  }

  @Input() isDestaque: boolean = true;

  ngOnInit() {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }

  ngAfterViewInit() {
    (window as any).onYouTubeIframeAPIReady = () => {
      this.initializePlayer();
    };

    if ((window as any).YT && (window as any).YT.Player) {
      this.initializePlayer();
    }
  }

  private initializePlayer(): void {
    this.player = new YT.Player('player-iframe', {
      height: '100%',
      width: '100%',
      videoId: this.initialVideoId,
      playerVars: {
        autoplay: 1, // Inicia o vídeo
        controls: 0,
        mute: 1, // CHAVE para autoplay funcionar em navegadores
      },
      events: {
        onReady: this.onPlayerReadyForPlaylist.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this),
      },
    });
  }

  // REQ_08 / REQ_05: Carrega a playlist e configura o loop (abordagem robusta)
  private onPlayerReadyForPlaylist(event: any): void {
    event.target.loadPlaylist({
      playlist: this.playlistIds,
      index: 0,
      startSeconds: 0,
    });

    this.player.setLoop(true);
    event.target.playVideo();
  }

  private onPlayerStateChange(event: any): void {
    // Este evento é um backup. Com setLoop(true) ativo, ele não deve ser acionado.
    if (event.data === YT.PlayerState.ENDED) {
      this.player.playVideo();
    }
  } // REQ_05: Método público chamado pelo AppComponent na interação do usuário ('S')

  public enableSound(): void {
    if (this.player && typeof this.player.unMute === 'function') {
      this.player.unMute();
      this.player.setVolume(100);
    }
  }
}
