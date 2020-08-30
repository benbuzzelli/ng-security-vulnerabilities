import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public router: Router, private repositoryService: RepositoryService) { }

  ngOnInit(): void {
  }

  addRepository(url: String) {
    this.repositoryService.addRepository(url)
  }

}
