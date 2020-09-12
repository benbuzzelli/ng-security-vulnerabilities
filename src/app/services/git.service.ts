import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { RepositoryService } from "./repository.service"
import { AngularFirestore } from '@angular/fire/firestore';
import * as uuid from 'uuid';

export class MLData {
  url: String
  publishedDate: String
  severity: String
  vulnerable: boolean
  commits: []

  constructor(url, publishedDate, severity, vulnerable, commits) {
    this.url = url
    this.publishedDate = publishedDate
    this.severity = severity
    this.vulnerable = vulnerable
    this.commits = commits
  }
}

export class Commit {
  date: String
  message: String
  committer: String
  site_admin: boolean

  constructor(date, message, committer, site_admin) {
    this.date = date
    this.message = message
    this.committer = committer
    this.site_admin = site_admin
  }
}

@Injectable({
  providedIn: 'root'
})
export class GitService {

  constructor(private afs: AngularFirestore, private repositoryService: RepositoryService, private http: HttpClient) { }

  private getIndexOfNthOccurence(searchString, pattern, n) {
      let index = -1;
      for (let i = 0; i < n; i++) {
          index = searchString.indexOf(pattern, index + 1)
      }
      console.log(n + ": " + index)
      return index
  }

  private getPath(url) {
    let index = this.getIndexOfNthOccurence(url, '/', 5)
    index = index == -1 ? url.length : index
    return url.substring(this.getIndexOfNthOccurence(url, '/', 3), index)
  }

  private getSha(url) {
    let index = this.getIndexOfNthOccurence(url, '/', 5)
    index = index == -1 ? url.length : index
    return url.substring(this.getIndexOfNthOccurence(url, '/', 3), index)
  }

  private getUrl(jsonObj) {
    console.log(this.getPath(jsonObj.url))
    return 'https://api.github.com/repos' + this.getPath(jsonObj.url) + '/commits?until=' + jsonObj.publishedDate + '&per_page=100'
  }

  private getSingleCommitUrl(jsonObj) {
    console.log(this.getPath(jsonObj.url))
    let urlStrings = jsonObj.url.split("/");

    // return 'https://api.github.com/repos' + this.getPath(jsonObj.url) + '/commits' + 
  }

  private extractCommits(data: any) {
    let commits = []
    data.forEach(element => {
      // console.log(JSON.parse(JSON.stringify(element)))
      let commit = new Commit(element?.commit?.author?.date, element?.commit?.message, element?.committer?.type, element?.committer?.site_admin)
      commits.push(commit)
    });
    return commits
  }

  addMLData(jsonString) {
    let jsonObj = JSON.parse(jsonString)
    let url = this.getUrl(jsonObj)
    let myId = uuid.v4();

    this.http.get<any>(url).subscribe( data => {
      console.log(data)
      let commits = this.extractCommits(data)
      let mlData = new MLData(jsonObj.url, jsonObj.publishedDate, jsonObj.severity, jsonObj.vulnerable, commits)
      this.afs.collection<MLData>('ml-data').doc(myId).set(JSON.parse(JSON.stringify(mlData)));
    })
  }

  getFilePathsFromCommit(jsonString) {
    let jsonObj = JSON.parse(jsonString)
    let url = this.getUrl(jsonObj)
    let myId = uuid.v4();

    this.http.get<any>(url).subscribe( data => {
      console.log(data)
      let commits = this.extractCommits(data)
      let mlData = new MLData(jsonObj.url, jsonObj.publishedDate, jsonObj.severity, jsonObj.vulnerable, commits)
      this.afs.collection<MLData>('ml-data').doc(myId).set(JSON.parse(JSON.stringify(mlData)));
    })
  }
}
