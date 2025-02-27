import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation.component';

@NgModule({
  declarations: [NavigationComponent], 
  imports: [
    CommonModule,
    IonicModule, 
    RouterModule 
  ],
  exports: [NavigationComponent] 
})
export class NavigationModule {}
