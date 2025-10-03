import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Call } from '../../services/call.service';

@Component({
  selector: 'app-call-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call-panel.component.html',
  styleUrls: ['./call-panel.component.css'],
})
export class CallPanelComponent {
  @Input({ required: true }) call!: Call;
}
