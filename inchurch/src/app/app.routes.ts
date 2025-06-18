import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { UserComponent } from './user/user/user';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user', component: UserComponent },
];
