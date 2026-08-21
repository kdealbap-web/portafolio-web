import { Component } from '@angular/core';
import { Contact } from './sections/contact/contact';
import { Enterprise } from './sections/enterprise/enterprise';
import { Hero } from './sections/hero/hero';
import { Masthead } from './sections/masthead/masthead';
import { Notes } from './sections/notes/notes';
import { Preloader } from './ui/preloader/preloader';
import { Rail } from './ui/rail/rail';
import { Systems } from './sections/systems/systems';

@Component({
  selector: 'app-root',
  imports: [Preloader, Rail, Masthead, Hero, Systems, Enterprise, Notes, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
