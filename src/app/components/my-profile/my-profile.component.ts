import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../services/auth.service';
import { User } from '../../model/User';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-my-profile',
  imports: [
    MatFormField,
    MatInputModule,
    FormsModule,
    NgOptimizedImage,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: HTMLInputElement;

  authService = inject(AuthService);
  formBuilder: FormBuilder = inject(FormBuilder);
  databaseService = inject(DatabaseService);

  updateForm: FormGroup;
  userBeforeModify : User | null | undefined = this.authService.currentUserSignal();
  pfp : string | ArrayBuffer = '';
  selectedPicture: File | null = null;
  uploadFormData: FormData = new FormData();

  constructor() {
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    })
  }

  ngOnInit() {
    this.userBeforeModify!.dateOfBirth = new Date(this.userBeforeModify!.dateOfBirth);
    if(this.userBeforeModify!.pfp){
      this.pfp = this.userBeforeModify!.pfp
    }
    this.updateForm.controls['name'].setValue(this.userBeforeModify!.name);
    this.updateForm.controls['description'].setValue(this.userBeforeModify!.description);

    console.log(this.authService.currentUserSignal());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedPicture = file;
        // Create a FileReader to read the image file
        const reader = new FileReader();
        reader.onload = () => {
          if(reader.result){
            this.pfp = reader.result;// Save the image data for preview
          }
        };
        reader.readAsDataURL(file); // Read the file as a Data URL

        console.log('Selected file:', this.selectedPicture);
      } else {
        console.error();
      }
    }
  }

  onFileDelete(){
    console.log("before delete input: ", this.fileInput.value);
    this.selectedPicture = null;
    this.pfp = '';
    if(this.userBeforeModify!.pfp){
      this.pfp = this.userBeforeModify!.pfp
    }
    this.fileInput.value = '';
    console.log("after delete input: ", this.fileInput.value);
  }

  updateUser(){
    let userData = {
      email: this.userBeforeModify!.email,
      name: this.updateForm.controls['name'].value,
      description: this.updateForm.controls['description'].value,
    }
    if(this.selectedPicture){
      this.uploadFormData.append('pfp', this.selectedPicture);
    }
    this.uploadFormData.append('user', JSON.stringify(userData));
    this.databaseService.updateUserData(this.uploadFormData).subscribe();
    console.log(this.uploadFormData)
  }

}
