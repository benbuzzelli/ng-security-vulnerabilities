import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs'
import * as $ from 'jquery'
import { MLData, Commit, GitService } from './git.service'
import * as uuid from 'uuid';
import { op } from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class MlServiceService {
  constructor(private gitService: GitService, private http: HttpClient) { }

  private async getMessagesFromFiles(endpoint) {
    let url = 'https://api.github.com/repos/' + this.gitService.getRepoPath(endpoint) + '/commits?per_page=1'
    let messages = []
    await this.http.get<any>(url).toPromise().then( data => {
      data.forEach(element => {
        messages.push(element?.commit?.message)
      });
    })
    return messages.join("benisfuckingawesome")
  }

  async getPrediction(endpoint) {
    let messages = this.getMessagesFromFiles(endpoint)
    let response = await this.http.post("http://127.0.0.1:5000/", messages, {responseType: 'text'})
    console.log(response)
    return response
  }
}
