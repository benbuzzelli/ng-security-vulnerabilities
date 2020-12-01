import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"
import { GitService } from "../../services/git.service"
import { DownloadService } from "../../services/download.service"
import { MlServiceService, Prediction, Repository } from "../../services/ml-service.service"
import { AngularFirestore } from '@angular/fire/firestore';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";  
import { url } from 'inspector';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface DashboardTable {
  position: string;
  date: string;
  commits: number;
  nonVulnerableCommits: number;
  vulnerableCommits: number;
  severity: string;
} 


// const DASHBOARD_DATA: DashboardTable[] = [
//   {position: '1', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '2', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '3', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '4', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '5', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '6', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
//   {position: '7', date:'ng-security-vulnerabilities', commits: 11, severity: '10%' },
// ];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements  OnInit {
  selected = 'option1'
  prediction

  repository$: Observable<Repository[]>

  @ViewChild('severityIconDiv') severityIconDiv: ElementRef;

  constructor(public router: Router, 
    private repositoryService: RepositoryService,
    private gitService: GitService,
    private spinner: NgxSpinnerService,
    private downloadService: DownloadService,
    private mls: MlServiceService,
    private afs: AngularFirestore,) {

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['position','filepath','avg-vuln', 'model', 'date'];
  dataSource = new MatTableDataSource()

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  async getRepository(repository) {
    // this.mls.getRepository("ng-security-vulnerabilities").subscribe(res =>(this.repository = res))
    this.repository$ = await this.mls.getRepository(repository)
    // console.log(data)

    // let repoRef = this.afs.collection<Repository>("repositories", ref => ref.where('name','==', repository ))
    // return repoRef.snapshotChanges().pipe(map(actions => {
    //   return actions.map(action => {
    //     let repo = action.payload.doc.data() as Repository;
    //     let predictions = repo.predictions
    //     this.dataSource.data = predictions
    //     return repo;
    //   });
    // }));
  }
  
  addRepository(url: String) {
    this.repositoryService.addRepository(url)
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

  // addPrediction(prediction) {
  //   this.mls.addPrediction(prediction)
  //   this.getRepository("ng-security-vulnerabilities")
  // }

  async getPrediction(endpoint: String, filepath: String) {
    await (await this.mls.getPrediction(endpoint, this.selected, filepath)).subscribe(p => {
      console.log(p)
      this.prediction = this.mls.getPredictionData(endpoint, p, filepath, this.selected)
      this.mls.makePrediction(this.prediction)
      this.getRepository(this.prediction.repository)
    })
  }
}