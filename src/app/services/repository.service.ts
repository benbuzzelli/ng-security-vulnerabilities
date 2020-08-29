import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UUID } from 'uuid';
import { formatDate } from '@angular/common';

export class Repository {
  url: String
  date: String

  constructor(url, date) {
    this.url = url
    this.date = date
  }
}

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private afs: AngularFirestore) { }

  addRepository(url: String)  {
      // let uuidValue = UUID.UUID()
      let date = formatDate(new Date(), 'dd/MM/yyyy-hh:mm:ss', 'en')

      let repository = new Repository(url, date)

      this.afs.collection<Repository>('repositories').doc("TEST").set(JSON.parse(JSON.stringify(repository)));
      console.log("Entered repository into database")
  }
}
