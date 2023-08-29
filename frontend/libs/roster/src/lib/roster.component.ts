import { Component } from '@angular/core';
import { RosterService } from './roster.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
})
export class RosterComponent {
  userStats$: Observable<any[]> = this.rosterService.getUserStats();

  constructor(private rosterService: RosterService) {}
}
