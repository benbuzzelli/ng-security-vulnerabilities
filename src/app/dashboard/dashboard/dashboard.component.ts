import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"
import { GitService } from "../../services/git.service"
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";  
import { url } from 'inspector';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; 

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

  DownloadPdf(dataSource) {
    var pdf = new jsPDF();
    var today = new Date(); 
    var newdate = "Date Printed: " + today; 
    const columns = [["File No.", "Files", "No. of Commits", "Severity"]];
    const data = [
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW'],
      ['1', 'ng-security-vulnerabilities', 11, 'LOW']
    ];
    pdf.text("Security Whale Vulnerability Assessment", 47, 10);
    pdf.setFontSize(10); 
    pdf.text(newdate, 42, 15);
    var github_link = "github.com/securitywhale"; 
    var newgithub = "Github Link : " + github_link; 
    pdf.text(newgithub, 62, 20);
    autoTable(pdf, {
      margin: { top: 30 },
      head: columns,
      body: data,   
    }); 
    pdf.save("Security-Whale.pdf"); 
  }
}