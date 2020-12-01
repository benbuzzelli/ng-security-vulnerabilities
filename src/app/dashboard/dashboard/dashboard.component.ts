import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from  "@angular/router";
import { GitService } from "../../services/git.service"
import { DownloadService } from "../../services/download.service"
import { MlServiceService, Prediction, Repository } from "../../services/ml-service.service"
import { AngularFirestore } from '@angular/fire/firestore';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";  
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export interface DashboardTable {
  position: string;
  date: string;
  commits: number;
  nonVulnerableCommits: number;
  vulnerableCommits: number;
  severity: string;
} 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements  OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('severityIconDiv') severityIconDiv: ElementRef;

  displayedColumns: string[] = ['position','filepath','avg-vuln', 'model', 'date'];
  dataSource: MatTableDataSource<any>

  selected = 'option1'  
  prediction

  constructor(public router: Router,
    private gitService: GitService,
    private spinner: NgxSpinnerService,
    private downloadService: DownloadService,
    private mls: MlServiceService,
    private afs: AngularFirestore) {

  }

  ngOnInit(): void {

  }
  
  ngAfterViewInit(): void {
  }

  pushCommitData(url: String) {
    this.gitService.getCommitsForFiles(url)
  }

  runTest(){
    this.spinner.show();
    setTimeout(() => {
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
    var img = new Image();
    img.src = 'assets/img/whale.png' 
    var newdate = "Date Printed: " + today; 
    const columns = [["File No.", "Files", "No. of Commits", "Severity"]];
    const data = [
      ['1', 'ng-security-vulnerabilities', 11, '10%'],
      ['2', 'ng-security-vulnerabilities', 11, '10%'],
      ['3', 'ng-security-vulnerabilities', 11, '10%'],
      ['4', 'ng-security-vulnerabilities', 11, '10%'],
      ['5', 'ng-security-vulnerabilities', 11, '10%'],
      ['6', 'ng-security-vulnerabilities', 11, '10%'],
      ['7', 'ng-security-vulnerabilities', 11, '10%']
    ];
    pdf.text("Security Whale Vulnerability Assessment", 47, 10);
    pdf.setFontSize(10); 
    pdf.text(newdate, 42, 15);
    var github_link = "github.com/securitywhale"; 
    var newgithub = "Github Link : " + github_link; 
    pdf.text(newgithub, 62, 20);
    pdf.addImage(img, 'png', 10, 78,12, 15 ); 
    autoTable(pdf, {
      margin: { top: 30 },
      head: columns,
      body: data,   
    }); 
    pdf.save("Security-Whale.pdf"); 
  }

  downloadCSV(collectionName) {
    this.downloadService.downloadCSV(collectionName)
  }

  async getPrediction(endpoint: String, filepath: String) {
    await (await this.mls.getPrediction(endpoint, this.selected, filepath)).subscribe(p => {
      console.log(p)
      this.prediction = this.mls.getPredictionData(endpoint, p, filepath, this.selected)
      this.mls.makePrediction(this.prediction)

      let repoRef = this.afs.collection<Repository>("repositories", ref => ref.where('name','==', this.prediction.repository ))
      return repoRef.valueChanges().subscribe(data => {
        this.dataSource = new MatTableDataSource(data[0].predictions)
        this.dataSource.paginator = this.paginator;
      })
    })
  }
}