import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import {formatDate} from '@angular/common';
import { firestore } from 'firebase';
import * as tf from '@tensorflow/tfjs'
import * as $ from 'jquery'
import { MLData, Commit, GitService } from './git.service'
import * as uuid from 'uuid';
import { op } from '@tensorflow/tfjs';
import { map } from 'rxjs/operators';

export class Repository {
  name: string
  predictions: []

  constructor(name, predictions) {
    this.name = name
    this.predictions = predictions
  }
}

export class Prediction {
  repository: string
  filepath: string
  date: string
  avgVulnerability: Number

  constructor(repository, filepath, date, avg) {
    this.repository = repository
    this.filepath = filepath
    this.date = date
    this.avgVulnerability = avg
  }
}

// export class Prediction {
//   repository: string
//   date: string
//   numCommits: string
//   isVulnerable: boolean
//   numNonVulnerable: number
//   numVulnerable: number

//   constructor(repository, date, numCommits, isVulnerable, numNonVulnerable, numVulnerable) {
//     this.repository = repository
//     this.date = date
//     this.numCommits = numCommits
//     this.isVulnerable = isVulnerable
//     this.numNonVulnerable = numNonVulnerable
//     this.numVulnerable = numVulnerable
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class MlServiceService {
  private myIpAddress = ''

  constructor(private afs: AngularFirestore, private gitService: GitService, private http: HttpClient) { }

  ngOnInit() {
    this.getIPAddress();
  }



  getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.myIpAddress = res.ip;
      console.log("your ip is: " + this.myIpAddress)
    });
  }

  private async getMessagesFromFiles(endpoint, filepath) {
    let url = 'https://api.github.com/repos/' + this.gitService.getRepoPath(endpoint) + '/commits?per_page=100&path=' + filepath
    let messages = []
    await this.http.get<any>(url).toPromise().then( data => {
      data.forEach(element => {
        messages.push(element?.commit?.message)
      });
    })
    return messages.join("s3cur!tywh@l3")
  }

  async getPrediction(endpoint, modelSelection, filepath) {
    let messages = await this.getMessagesFromFiles(endpoint, filepath)

    messages += "x23model!t@ype!x56" + modelSelection

    // console.log(messages)
    let response = await this.http.post("http://0.0.0.0:8080/", messages, {responseType: 'text'})
    console.log(response)
    return response
  }

  // getPredictionData(endpoint, predictionString, filepath) {
  //   console.log("Prediction string: " + predictionString)
  //   let values = predictionString.split(",")
  //   let repo = this.gitService.getRepoPath(endpoint).split("/")[1]
  //   console.log("repo: " + repo)
  //   let nV = parseInt(values[0])
  //   let nN = parseInt(values[1])
  //   let nCommits = nV + nN
  //   let isV = nV > nN
  //   let date = formatDate(new Date(), 'dd/MM/yyyy-hh:mm:ss', 'en');
  //   let prediction = new Prediction(repo, date, nCommits, isV, nN, nV)

  //   console.log(prediction)
  //   // localStorage.setItem('repository', prediction.repository)
  //   // let repoRef = this.afs.collection<Repository>('repositories');
  //   // let document = repoRef.doc(prediction.repository)
  //   // // document.set(JSON.parse(JSON.stringify(mlData)), {merge: true})
  //   // document.set({
  //   //   name: prediction.repository,
  //   //   predictions: firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(prediction)))
  //   // }, { merge: true });
  //   return prediction
  // }

  getPredictionData(endpoint, predictionString, filepath) {
    console.log("Prediction string: " + predictionString)
    let values = predictionString.split(",")
    let repo = this.gitService.getRepoPath(endpoint).split("/")[1]
    let date = formatDate(new Date(), 'dd/MM/yyyy-hh:mm:ss', 'en');
    let prediction = new Prediction(repo, filepath, date, Number(values[0]))

    console.log(prediction)
    return prediction
  }

  makePrediction(prediction) {
    console.log("making prediction")
    let repoRef = this.afs.collection<Repository>('repositories');
    let document = repoRef.doc(prediction.repository)
    // document.set(JSON.parse(JSON.stringify(mlData)), {merge: true})
    document.set({
      name: prediction.repository,
      predictions: firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(prediction)))
    }, { merge: true });
  }

  getRepository(repository) {
    let repoRef = this.afs.collection<Repository>("repositories", ref => ref.where('name','==', repository ))
    return repoRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Repository;
        return data;
      });
    }));
    // return this.afs.collection<Repository>("repositories", ref => ref.where('name','==', repository )).snapshotChanges();
  }
}
