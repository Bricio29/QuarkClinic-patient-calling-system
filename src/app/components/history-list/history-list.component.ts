import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Call } from '../../services/call.service';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css'],
})
export class HistoryListComponent {
  @Output() toggleMute = new EventEmitter<void>();
  @Output() toggleVideoSize = new EventEmitter<void>();

  isMuted: boolean = false;
  onToggleMute(): void {
    this.isMuted = !this.isMuted;
    this.toggleMute.emit();
  }

  onToggleVideoSize(): void {
    this.toggleVideoSize.emit();
  }

  @Input() history: Call[] = [];

  trackByCallId(index: number, call: Call): string {
    return call.id;
  }
}
