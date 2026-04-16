import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upperdata',
  imports: [RouterLink],
  templateUrl: './upperdata.component.html',
  styleUrl: './upperdata.component.css',
})
export class UpperdataComponent {
  readonly authService = inject(AuthService);

  logout() {
    this.authService.logOut();
  }
}

