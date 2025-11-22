import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/service/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private _authService: Auth){}
  protected readonly title = signal('Frontend');
  ngOnInit(): void {
    this._authService.isLoggedIn();
  }
}
