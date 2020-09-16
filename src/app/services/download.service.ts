import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MLData } from './git.service';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

export class MlCsvData {
  url: String
  message: String
  vulnerable: Boolean
  severity: String
  commitDate: String
  fixDate: String

  constructor(r, m, v, s, d, fd) {
    this.url = r
    this.message = m
    this.vulnerable = v
    this.severity = s
    this.commitDate = d
    this.fixDate = fd
  }
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private afs: AngularFirestore) { }

  downlsoadCSV() {
    console.log("HERE")
    let mlDataRef1 = this.afs.collection<MLData>('ml-data').get();
    let mlDataRef = this.afs.collection<MLData>('ml-data').doc("linux");

    mlDataRef.get().toPromise().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })

    // let mlData = mlDataRef.snapshotChanges().pipe(map(actions => {
    //   return actions.map(action => {
    //     console.log("Yo")
    //     let data = action.payload.doc.data() as MLData;
    //     console.log("Found data: " + data)
    //     let id = action.payload.doc.id;
    //     return { id, ...data };
    //   });
    // }));
  }

  downloadFile(data, filename='data') {
    let csvData = this.convertToCSV(data, ['url','message','vulnerable','severity','commitDate','fixDate']);
    // console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  async downloadCSV(collectionName) {
    let data = await this.getCollectionData(collectionName)
    let formattedJson = []

    data.forEach(repo => {
      repo.commits.forEach(commit => {
        let message = commit.message.replace(/[\n\r,]+/g, '');
        formattedJson.push(new MlCsvData(repo.url, message, repo.vulnerable, repo.severity, commit.date, repo.publishedDate))
      });
    })

    console.log("Downloading csv")
    this.downloadFile(formattedJson, "sample-data")

    // this.csvService.download(this.getCollectionData(collectionName), 'sample-data.csv');
  }

  async getCollectionData(collectionName) {
    let mlDataRef1 = await firebase.firestore().collection(collectionName).get();
    let data = []
    mlDataRef1.docs.map(doc => {
      data.push(doc.data())
    });
    return data
  }

  convertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
        row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i+1)+'';
        for (let index in headerList) {
           let head = headerList[index];
            console.log(array[i][head])
            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
}

  // ConvertToCSV(objArray, headerList) { 
  //   let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray; 
  //   let str = ''; 
  //   let row = 'S.No, '; 
  //   for (let index in headerList) { 
  //       row += headerList[index] + ', '; 
  //   } 
  //   row = row.slice(0, -1); 
  //   str += row + '\r\n'; 
  //   for (let i = 0; i & lt; array.length; i++) { 
  //       let line = (i + 1) + & #039;&# 039;; 
  //       for (let index in headerList) { 
  //           let head = headerList[index]; 
  //           line += & #039;, &# 039; + array[i][head]; 
  //       } 
  //       str += line + & #039;\r\n&# 039;; 
  //   } 
  //   return str; 
  // } 
}
