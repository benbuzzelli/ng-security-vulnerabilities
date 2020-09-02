import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";

export interface HistoryTable {
  date: string;
  github: string;
  description: string;
  vulnerable: string;
  severity: string;
}

const HISTORY_DATA: HistoryTable[] = [
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 'Test', vulnerable: 'Yes', severity: '100%' },
];

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(public router: Router) { }
  displayedColumns: string[] = ['date', 'github', 'description', 'vulnerable', 'severity'];
  dataSource = HISTORY_DATA;
  ngOnInit(): void {
  }

}
