import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxPageComponent } from './box-page/box-page.component';
const routes: Routes = [
  {
    path: 'box',
    component: BoxPageComponent
  },
  {
    path: '',
    redirectTo: 'box',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
