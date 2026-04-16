import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../app/layouts/navbar/navbar.component";
import { FooterComponent } from "../app/layouts/footer/footer.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import { UpperdataComponent } from "./layouts/upperdata/upperdata.component";
import { MainPerksComponent } from "./layouts/main-perks/main-perks.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerModule, UpperdataComponent, MainPerksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FreshCart');
}
