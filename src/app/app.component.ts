import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-security-vulnerabilities';
  theme = 'light-theme'
  switchToText = 'Dark Mode'

  constructor() {}

  toggleTheme() {
    if (this.theme == 'light-theme') {
      this.theme = 'dark-theme'
      this.switchToText = 'Light Mode'
    } else {
      window.localStorage.setItem('theme', 'light-theme');
      this.theme = 'light-theme'
      this.switchToText = 'Dark Mode'
    }
  }
}
