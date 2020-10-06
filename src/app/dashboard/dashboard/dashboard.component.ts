import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"
import { GitService } from "../../services/git.service"
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";  
import { url } from 'inspector';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface DashboardTable {
  position: string;
  files: string;
  commits: number;
  severity: string;
} 


const DASHBOARD_DATA: DashboardTable[] = [
  {position: '1', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '2', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '3', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '4', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '5', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '6', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
  {position: '7', files:'ng-security-vulnerabilities', commits: 11, severity: 'LOW' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  constructor(public router: Router, 
    private repositoryService: RepositoryService,
    private gitService: GitService,
    private spinner: NgxSpinnerService) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position','files','commits','severity'];
  dataSource = new MatTableDataSource<DashboardTable>(DASHBOARD_DATA);

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  pushCommitData(url: String) {
    this.gitService.getCommitsForFiles(url)
  }

  runTest(){
    this.spinner.show();
    setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
    }, 5000); 
  }

  Pressed(url){
    this.runTest(); 
    localStorage.setItem('url', url); 
  }

  downloadPdf(dataSource) {
    const doc = new jsPDF();
    var columns = ["Position", "Files", " Num. of Commits", "Severity"]
    doc.autoTable(dataSoure,columns );

  }
}