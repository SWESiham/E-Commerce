import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeader } from "./dashboard-header/dashboard-header";

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
