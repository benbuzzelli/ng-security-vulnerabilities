import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized  } from  "@angular/router";
import { filter } from 'rxjs/operators';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('dashboard') dashboard: ElementRef
  @ViewChild('history') history: ElementRef
  @ViewChild('ml') ml: ElementRef
  @ViewChild('about') about: ElementRef
  @ViewChild('legal') legal: ElementRef

  dashboardStyle = {}
  historyStyle = {}
  examplesStyle = {}
  aboutStyle = {}
  legalStyle = {}

  navStyle = new NavStyle()

  switchToText = null

  elementRef: ElementRef

  constructor(public router: Router, elementRef:ElementRef) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      this.initialiseAll()
      switch (event.url) {
        case '/dashboard':
          this.dashboardStyle = this.navStyle.focus
          // this.dashboard.nativeElement.focus()
          break;
        case '/history':
          this.historyStyle = this.navStyle.focus
          // this.history.nativeElement.focus()
          break;
        case '/ml-examples':
          this.examplesStyle = this.navStyle.focus
          // this.ml.nativeElement.focus()
          break;
        case '/about':
          this.aboutStyle = this.navStyle.focus
          // this.about.nativeElement.focus()
          break;
        case '/legal-notes':
          this.legalStyle = this.navStyle.focus
          // this.legal.nativeElement.focus()
          break;
      }
    });

    this.elementRef = elementRef.nativeElement

    let theme = window.localStorage.getItem('theme')

    if (theme == null) {
      window.localStorage.setItem('theme', 'light-theme');
      this.switchToText = 'Dark Mode'
    } else if (theme == 'light-theme') {
      this.switchToText = 'Dark Mode'
    } else {
      this.switchToText = 'Light Mode'
    }
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

  toggleTheme() {
    let theme = window.localStorage.getItem('theme')
    if (theme == 'light-theme') {
      window.localStorage.setItem('theme', 'dark-theme');
      this.switchToText = 'Light Mode'
    } else {
      window.localStorage.setItem('theme', 'light-theme');
      this.switchToText = 'Dark Mode'
    }
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
    'border': 'none',
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
    'border': 'none',
    'font-family': "'Open Sans', sans-serif",
    'transition': 'all .2s ease',
    'background': 'transparent',
    'background-image': 'linear-gradient(to right, #40ada8,#40ada8 5px,#242424 5px,#242424 100%)'
  }

  focus = {
    'display': 'block',
    'line-height': '65px',
    'height': '65px',
    'width': '240',
    'color': '#20B2AA',
    'padding-left': '30px',
    'border': 'none',
    'font-family': "'Open Sans', sans-serif",
    'transition': 'all .2s ease',
    'background': 'transparent',
    'outline': 'none',
    'background-image': 'linear-gradient(to right,#20B2AA,#20B2AA 5px,#303030 5px,#303030 100%)'
  }

  constructor() {}
}