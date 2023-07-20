import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  editForm!: FormGroup
  fb = inject(FormBuilder)
  router = inject(Router)
  accSvc = inject(AccountService)
  user! : User

  ngOnInit(): void {
    this.editForm = this.createForm();
  
    this.accSvc.getUserData().then(user => {
      if (user) {
        this.prefillForm(user);
      } 
    });
  }
  
  prefillForm(user: User): void {
    this.editForm.patchValue({
      address1: user.address1,
      address2: user.address2,
      postal: user.postal,
      phone: user.phone,
      genre: user.genre,
      plan: user.plan,
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
     
      address1: this.fb.control<string>('', [Validators.required]),
      address2: this.fb.control<string>('', [Validators.required]),
      postal: this.fb.control<number>(0, [Validators.required]),
      phone: this.fb.control<number>(0, [Validators.required]),  
      genre: this.fb.control<string>('', [Validators.required]),
      plan: this.fb.control<string>('', [Validators.required]),
    })
  }

  saveForm() {
    if (this.editForm) {
      const formData: User = this.editForm.value;
      const email = this.accSvc.getEmail() || '';
      formData.email = email;
  
      firstValueFrom(this.accSvc.editAccount(formData))
      .then(updatedUser => {
        this.accSvc.user = updatedUser;
        console.info("updated user", updatedUser)
        console.info("thisuser", this.user)
        this.editForm.reset();
        this.accSvc.emitUserUpdated(updatedUser); // Emit the updated user
        this.router.navigate(['/summary']);
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
    }
  }
}
