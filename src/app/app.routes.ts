import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [ 
    {path: '', component:HomeComponent},
    { path: 'products-list', component: ProductsListComponent },
];
