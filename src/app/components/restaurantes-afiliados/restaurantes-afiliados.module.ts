import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RestaurantesAfiliadosPage } from './restaurantes-afiliados.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantesAfiliadosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RestaurantesAfiliadosPage]
})
export class RestaurantesAfiliadosPageModule {}
