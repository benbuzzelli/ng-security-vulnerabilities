import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { Observable } from 'rxjs';
import { MlServiceService, Prediction, Repository } from "../services/ml-service.service"

//import { Prediction } from './ml-service.service.ts';

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

  repository$: Observable<Repository[]>
  displayedColumns: string[] = ['date', 'github', 'description', 'vulnerable', 'severity'];
  dataSource = HISTORY_DATA;

  constructor(public router: Router, private mls: MlServiceService) { }
  ngOnInit(): void {
    this.getRepository()
  }
  
  async getRepository() {
    this.repository$ = await this.mls.getRepository("")
  }

}

