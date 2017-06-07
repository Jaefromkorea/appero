import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth, IDetailedError } from '@ionic/cloud-angular';
import { LoginPage } from '../login-page/login-page';

/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'signup-page',
  templateUrl: 'signup-page.html'
})
export class SignupPage {
 
  username: string;
  email: string;
  password: string;
  major: boolean;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public auth: Auth) {
    this.major = false;
  }
  
  private presentLoading(msg: string) {
    let loading = this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true
    });

    loading.present();
  }
  
  private presentAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  
  register() {
  
    let details = {
      username: this.username,
      email: this.email,
      password: this.password,
    };
 
    this.auth.signup(details).then((result) => {
      console.log(result);
      this.presentLoading('Please wait...');
      this.navCtrl.push(LoginPage);
    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        switch (e) {
          case 'required_email':
            this.presentAlert('Email required', 'Please give us an email.');
            break;
          case 'required_password':
            this.presentAlert('Password required', 'Please enter a password.');
            break;
          case 'conflict_email':
            this.presentAlert('Email conflict', 'This email is already registered.');
            break;
          case 'conflict_username':
            this.presentAlert('Username conflict', 'This username is already registered.');
            break;
          case 'invalid_email':
            this.presentAlert('Invalid email', 'Please enter a valid email.');
            break;
          default:
            this.presentAlert('UNKNOWN', 'An unknown error has occured.');
            break;
            
        }
      }
    });
 
  }
}
