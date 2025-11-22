import { Component } from '@angular/core';
import { Auth } from '../../core/service/auth';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeader {
  
  
}