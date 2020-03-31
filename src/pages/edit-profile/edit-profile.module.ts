import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';
import { BrMasker4Module } from 'brmasker4';

@NgModule({
  declarations: [
    EditProfilePage
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage),
    BrMasker4Module 
  ],
  exports: [
    EditProfilePage
  ]
})

export class EditProfilePageModule { }
