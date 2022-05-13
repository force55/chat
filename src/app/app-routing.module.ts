import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import {CurrencyComponent} from "./components/currency/currency.component";
import {AuthGuard} from "./auth.guard";
import {SecureInnerPagesGuard} from "./shared/secure-inner-pages.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SigninComponent,canActivate: [SecureInnerPagesGuard], },
  { path: 'register', component: SignupComponent, },
  { path: 'profile', component: UserProfileComponent,canActivate: [AuthGuard], },
  { path: 'edit_profile', component: EditProfileComponent,canActivate: [AuthGuard], },
  { path: 'currency', component: CurrencyComponent,canActivate: [AuthGuard], },
  { path: '**', component: UserProfileComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
