import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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

  working: Boolean = false

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
    return 'https://api.github.com/repos/' + httpObj.repoPath + '/commits?until=' + httpObj.publishedDate + '&per_page=100&path=' + path
  }

  getSingleCommitUrl(url) {
    let urlStrings = url.split("/");
    return 'https://api.github.com/repos/' + urlStrings[3] + '/' + urlStrings[4] + '/commits/' + urlStrings[6]
  }

  private isValidUrl(url) {
    let urlStrings = url.split("/");
    return (urlStrings.length == 7 && urlStrings[0] == "https:" && urlStrings[1] == "" && urlStrings[2] == "github.com" && urlStrings[5] == "commit")
  }

  public extractCommits(data: any) {
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
    
    mlData.commits.forEach( commit => {
      document.update({commits: firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(commit)))})
    })
  }

  public getRepoPath(url) {
    let urlStrings = url.split("/");
    return urlStrings[3] + '/' + urlStrings[4]
  }

  async getCommitsForFiles(jsonString) {
    this.working = false
    let jsonObjArray = JSON.parse(jsonString)

    for (let i = 0; i < jsonObjArray.length; i++) {
      // console.log("Next iteration")
      if (!this.isValidUrl(jsonObjArray[i].url)) {
        console.log("Not a valid commit url!")
        continue;
      }
  
      let endpoint = this.getSingleCommitUrl(jsonObjArray[i].url)
  
      let httpObj = {
        repoPath: this.getRepoPath(jsonObjArray[i].url), 
        publishedDate: jsonObjArray[i].publishedDate
      }
      console.log("Getting commits for url: " + jsonObjArray[i].url)
      await this.getCommitsFromFiles(endpoint, httpObj, jsonObjArray[i])
      console.log("Finished for: " + jsonObjArray[i].url)
    }
  }

  async getCommitsFromFiles(endpoint, httpObj, jsonObj) {
    await this.http.get<any>(endpoint).toPromise().then( async data => {
      let filepaths = this.getFilePathsFromCommit(data)

      await this.loopThroughFiles(filepaths, httpObj, jsonObj)
    })
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async loopThroughFiles(filepaths, httpObj, jsonObj) {
    for (let i = 0; i < filepaths.length; i++) {
      let url = this.getUrl(httpObj, filepaths[i])
      console.log("specific file endpoint: " + url)
      await this.http.get<any>(url).toPromise().then( data => {
        this.addMLData(jsonObj, data)
      })
      // console.log("waiting...")
      await this.delay(1000)
      // console.log("Done waiting")
    }
  }
}
