import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from  "@angular/router";
import { RepositoryService } from "../../services/repository.service"
import { GitService } from "../../services/git.service"
import { DownloadService } from "../../services/download.service"
import { MlServiceService } from "../../services/ml-service.service"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  prediction = ''

  @ViewChild('severityIconDiv') severityIconDiv: ElementRef;

  scalables = {
    severityIcon: {
      elementRefKey: 'severityIconDiv',
      refKey: 'clientWidth',
      attributes: ['font-size', 'width', 'height'],
      unit: 'px',
      scaleFactor: .5,
      style: {
        'height': '64px',
        'width': '64px',
        'font-size': '64px',
        'position': 'relative',
        'top': '10%'
      }
    }
  }

  constructor(public router: Router, 
    private repositoryService: RepositoryService,
    private gitService: GitService,
    private downloadService: DownloadService,
    private mls: MlServiceService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.resizeScalables()
  }

  addRepository(url: String) {
    this.repositoryService.addRepository(url)
  }

  getUrl(url: String) {
    this.gitService.getCommitsForFiles(url)
  }

  downloadCSV(collectionName) {
    this.downloadService.downloadCSV(collectionName)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeScalables()
  }

  resizeScalables() {
    Object.keys(this.scalables).forEach(key => {
      this.resizeScalable(this.scalables[key])
    });
  }

  resizeScalable(scalable) {
    let ref = this[scalable.elementRefKey]
    let scalar = ref.nativeElement[scalable.refKey]
    console.log(scalar)
    scalable.attributes.forEach(attribute => {
      scalable.style[attribute] = (scalar * scalable.scaleFactor).toString() + scalable.unit
    });
  }

  async getPrediction(endpoint: String) {
    (await this.mls.getPrediction(endpoint)).subscribe(prediction => {
      this.prediction = prediction
    })
  }
}
