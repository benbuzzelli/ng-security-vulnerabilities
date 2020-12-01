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
  model: String

  constructor(repository, filepath, date, avg, model) {
    this.repository = repository
    this.filepath = filepath
    this.date = date
    this.avgVulnerability = avg
    this.model = model
  }
}

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

    var headers_object = new HttpHeaders();
    headers_object.append("Authorization", "Basic " + btoa("username:password"));

    const httpOptions = {
      headers: headers_object,
    };

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

    var headers_object = new HttpHeaders();
    headers_object.append('Response-Type', 'text');
    headers_object.append("Authorization", "Basic " + btoa("username:password"));

    const httpOptions = {
      headers: headers_object,
      responseType: 'text' as 'text'
    };

    let response = await this.http.post("https://127.0.0.1:5000/", messages, httpOptions)
    console.log(response)
    return response
  }

  getPredictionData(endpoint, predictionString, filepath, model) {
    console.log("Prediction string: " + predictionString)
    let values = predictionString.split(",")
    let repo = this.gitService.getRepoPath(endpoint).split("/")[1]
    let date = formatDate(new Date(), 'dd/MM/yyyy-hh:mm:ss', 'en');
    let prediction = new Prediction(repo, filepath, date, Number(values[0]), model)

    console.log(prediction)
    return prediction
  }

  makePrediction(prediction) {
    console.log("making prediction")
    let repoRef = this.afs.collection<Repository>('repositories');
    let document = repoRef.doc(prediction.repository)
    document.set({
      name: prediction.repository,
      predictions: firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(prediction)))
    }, { merge: true });

    this.addPredictionsToDatabase(prediction)
  }

  addPredictionsToDatabase(prediction) {
    let timestamp = firestore.FieldValue.serverTimestamp
    let repoRef = this.afs.collection('predictions');
    repoRef.add({ ...prediction, createdAt: timestamp() })
  }

  async getRepository(repository) {
    let repoRef = this.afs.collection<Repository>("repositories", ref => ref.where('name','==', repository ))
    return repoRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Repository;
        return data;
      });
    }));
  }
}
