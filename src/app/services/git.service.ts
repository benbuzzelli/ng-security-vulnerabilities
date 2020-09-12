import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { RepositoryService } from "./repository.service"
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
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

  private getUrl(httpObj, path) {
    return 'https://api.github.com/repos/' + httpObj.repoPath + '/commits?until=' + httpObj.publishedDate + '&per_page=10&path=' + path
  }

  getSingleCommitUrl(url) {
    let urlStrings = url.split("/");
    return 'https://api.github.com/repos/' + urlStrings[3] + '/' + urlStrings[4] + '/commits/' + urlStrings[6]
  }

  private isValidUrl(url) {
    let urlStrings = url.split("/");
    return (urlStrings.length == 7 && urlStrings[0] == "https:" && urlStrings[1] == "" && urlStrings[2] == "github.com" && urlStrings[5] == "commit")
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

  private getFilePathsFromCommit(data: any) {
    let filepaths = []

    data.files.forEach(file => {
      filepaths.push(file?.filename)
    })

    return filepaths
  }

  addMLData(jsonObj, data) {
    let myId = uuid.v4();
    let commits = this.extractCommits(data)
    let mlData = new MLData(jsonObj.url, jsonObj.publishedDate, jsonObj.severity, jsonObj.vulnerable, commits)

    let repoName = this.getRepoPath(jsonObj.url).split("/")[1]

    // this.afs.collection<MLData>('ml-data').doc(myId).set(JSON.parse(JSON.stringify(mlData)));
    let repoRef = this.afs.collection<MLData>('ml-data');
    let document = repoRef.doc(repoName)
    // document.set(JSON.parse(JSON.stringify(mlData)), {merge: true})
    document.set({
      url: mlData.url,
      publishedDate: mlData.publishedDate,
      severity: mlData.severity,
      vulnerable: mlData.vulnerable
    }, { merge: true });

    console.log("LENGTH = " + mlData.commits.length)

    mlData.commits.forEach( commit => {
      document.update({commits: firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(commit)))})
    })
  }

  private getRepoPath(url) {
    let urlStrings = url.split("/");
    return urlStrings[3] + '/' + urlStrings[4]
  }

  getCommitsForFiles(jsonString) {
    let jsonObj = JSON.parse(jsonString)
  
    if (!this.isValidUrl(jsonObj.url)) {
      console.log("Not a valid commit url!")
      return;
    }

    let endpoint = this.getSingleCommitUrl(jsonObj.url)

    let httpObj = {
      repoPath: this.getRepoPath(jsonObj.url), 
      publishedDate: jsonObj.publishedDate
    }

    this.http.get<any>(endpoint).subscribe( data => {
      let filepaths = this.getFilePathsFromCommit(data)
      console.log(filepaths)

      filepaths.forEach(path => {
        let url = this.getUrl(httpObj, path)
        console.log(url)
        this.http.get<any>(url).subscribe( data => {
          console.log(data)
          this.addMLData(jsonObj, data)
        })
      })
    })
  }
}
