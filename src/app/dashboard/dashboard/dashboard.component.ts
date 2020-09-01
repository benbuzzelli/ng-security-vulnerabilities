import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"
import { GitService } from "../../services/git.service"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public router: Router, 
    private repositoryService: RepositoryService,
    private gitService: GitService) { }

  ngOnInit(): void {
  }

  addRepository(url: String) {
    this.repositoryService.addRepository(url)
  }

  addMLData(jsonString: String) {
    this.gitService.addMLData(jsonString)
  }
}
