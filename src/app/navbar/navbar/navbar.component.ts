import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized  } from  "@angular/router";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  dashboardStyle = {}
  historyStyle = {}
  examplesStyle = {}
  aboutStyle = {}
  legalStyle = {}

  navStyle = new NavStyle()

  constructor(public router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
      this.initialiseAll()
      switch (event.url) {
        case '/dashboard':
          this.dashboardStyle = this.navStyle.focus
          break;
        case '/history':
          this.historyStyle = this.navStyle.focus
          break;
        case '/ml-examples':
          this.examplesStyle = this.navStyle.focus
          break;
        case '/about':
          this.aboutStyle = this.navStyle.focus
          break;
        case '/legal-notes':
          this.legalStyle = this.navStyle.focus
          break;
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initialiseAll()
  }

  initialiseAll() {
    this.dashboardStyle = this.navStyle.default
    this.historyStyle = this.navStyle.default 
    this.examplesStyle = this.navStyle.default
    this.aboutStyle = this.navStyle.default
    this.legalStyle = this.navStyle.default
  }

  default(element) {
    if (this[element] != this.navStyle.focus)
      this[element] = this.navStyle.default
  }

  hover(element) {
    if (this[element] != this.navStyle.focus)
      this[element] = this.navStyle.hover
  }

  focus(element) {
    this.dashboardStyle = this.navStyle.default
    this.historyStyle = this.navStyle.default
    this.examplesStyle = this.navStyle.default
    this.aboutStyle = this.navStyle.default
    this.legalStyle = this.navStyle.default

    this[element] = this.navStyle.focus
  }
}

export class NavStyle {
  default = {
    'display': 'block',
    'line-height': '65px',
    'height': '65px',
    'width': '240',
    'color': '#dedede',
    'padding-left': '30px',
    'border-bottom': '1px solid black',
    'border-top': '1px solid rgba(255,255,255,.1)',
    'font-family': "'Open Sans', sans-serif",
    'transition': 'all .2s ease',
    'background': 'transparent',
  }

  hover = {
    'display': 'block',
    'line-height': '65px',
    'height': '65px',
    'width': '240',
    'color': '#dedede',
    'padding-left': '30px',
    'border-bottom': '1px solid black',
    'border-top': '1px solid rgba(255,255,255,.1)',
    'font-family': "'Open Sans', sans-serif",
    'transition': 'all .2s ease',
    'background': 'transparent',
    'background-image': 'linear-gradient(to right, #40ada8,#40ada8 5px,#1e1e1e 5px,#1e1e1e 100%)'
  }

  focus = {
    'display': 'block',
    'line-height': '65px',
    'height': '65px',
    'width': '240',
    'color': '#20B2AA',
    'padding-left': '30px',
    'border-bottom': '1px solid black',
    'border-top': '1px solid rgba(255,255,255,.1)',
    'font-family': "'Open Sans', sans-serif",
    'transition': 'all .2s ease',
    'background': 'transparent',
    'outline': 'none',
    'background-image': 'linear-gradient(to right,#20B2AA,#20B2AA 5px,#1e1e1e 5px,#1e1e1e 100%)'
  }

  constructor() {}
}