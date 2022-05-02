import {Component, OnInit, Output} from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from '../../shared/token.service';
import {Router} from "@angular/router";
import {UserService} from "../../shared/user.service";
import {AuthStateService} from "../../shared/auth-state.service";

// User interface
export class User {
  name: any;
  email: any;
}
//Profile interface
export class Profile {
  name: String = '';
  email!: String;
  country!: String;
  avatarUrl!: String;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

  UserProfile: Profile = new Profile();
  editForm: FormGroup;
  errors:any = null;
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public userService: UserService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.userService.userProfile().subscribe((data: any) => {
      this.UserProfile = data;
    });
    this.editForm = this.fb.group({
      name: [],
      email: [],
    });
  }
  ngOnInit() {}
  onSubmit() {
    this.userService.editProfile(this.editForm.value).subscribe(
      (result) => {},
      (error) => {
        this.errors = error.error;
      },
      () => {
        // this.authState.setAuthState(true);
        this.authState.setAuthState(true);
        this.router.navigate(['profile']);
      }
    );
  }
  // Handle response
  // responseHandler(data:any) {
  //   this.token.handleData(data.access_token);
  // }

}
