import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Call } from '../../services/call.service';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent {
  @Input() history: Call[] = [];

  trackByCallId(index: number, call: Call): string {
    return call.id;
  }
}