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
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 1.0079, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 4.0026, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 6.941, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 9.0122, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 10.811, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 12.0107, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 14.0067, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 15.9994, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 18.9984, vulnerable: 'Yes', severity: '100%' },
  { date: '09/02/2020', github: 'https://github.com/benbuzzelli/ng-security-vulnerabilities', description: 20.1797, vulnerable: 'Yes', severity: '100%' },
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
