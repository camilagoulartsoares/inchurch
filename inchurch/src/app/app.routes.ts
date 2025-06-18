import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { UserComponent } from './user/user/user';
import { ProductDetailsComponent } from './product-details/product-details';

// export const routes: Routes = [
//   { path: '', component: Home },
//   { path: 'user', component: UserComponent },
// ];

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'user', component: UserComponent },

];
