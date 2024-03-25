import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeoutId: any | undefined;
  public userInactive: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.setupUserActivityTracking();
  }

  private setupUserActivityTracking(): void {
    document.addEventListener('mousemove', () => this.resetTimer());
    document.addEventListener('keydown', () => this.resetTimer());
    document.addEventListener('click', () => this.resetTimer());
    document.addEventListener('scroll', () => this.resetTimer());
    this.resetTimer();
  }

  private resetTimer(): void {
    clearTimeout(this.timeoutId);
    const delayTime = localStorage.getItem("tokenTime");
    const delayMilliseconds = delayTime ? parseInt(delayTime) : 3000000; // Default is 5 minutes 
    this.timeoutId = setTimeout(() => this.userInactive.emit(), delayMilliseconds);    
  }
}
