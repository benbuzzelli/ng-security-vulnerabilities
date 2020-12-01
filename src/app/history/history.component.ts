import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from  "@angular/router";
import { Observable } from 'rxjs';
import { MlServiceService, Prediction, Repository } from "../services/ml-service.service"
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { of } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  repositoryCollection: AngularFirestoreCollection<Repository>

  repository$: Observable<Repository[]>
  displayedColumns: string[] = ['position','filepath', 'repository', 'avg-vuln', 'model', 'date'];
  dataSource: MatTableDataSource<any>

  predictions: Prediction[]
  predictions$: Observable<Prediction[]>

  constructor(private afs: AngularFirestore, public router: Router, private mls: MlServiceService) {
  
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.afs.collection<Repository>("predictions").valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
    })
  }
}

