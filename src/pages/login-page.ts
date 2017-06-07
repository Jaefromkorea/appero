import { Component } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth, User, Push, PushToken } from '@ionic/cloud-angular';
//import { Push as PushNative } from 'ionic-native';
import { SignupPage } from '../signup-page/signup-page';
//import { GoogleMapsPage } from '../google-maps-page/google-maps-page';
import { MenuPage } from '../menu/menu';
import { BarHomepagePage } from '../bar-homepage/bar-homepage';

import {MenuFairPage} from '../menu-fair/menu-fair';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  default_bar_email: string = 'b@b.bb';
  email: string;
  password: string;
  remember: boolean;
  reset_pwd: string;
  //orders: any;
  //bar_checked: boolean;
  device_token: string;
    
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public auth: Auth, public push: Push, public user: User, public platform: Platform) {
    this.reset_pwd = this.auth.passwordResetUrl;
    this.remember = false;
    //this.orders = [];
    //this.bar_checked = false;
    
    // Let the splashcreen appear till the app is ready
    // cf. https://medium.com/ionic-tnt/ionic-hide-splash-screen-when-app-is-ready-aba5184684e2
    if (this.platform.is('cordova')) {
      platform.ready().then(() => {
        setTimeout(function() {
            navigator.splashscreen && navigator.splashscreen.hide(); // navigator.splashscreen is not available on desktop and would cause error
        }, 3000);
      })
    }
  }
  
  presentLoading(msg: string) {
    return this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true
    });
  }
  
  presentAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
   
  ionViewDidLoad() {
    
    /*
    if (this.platform.is('cordova')) {
       
      let push = PushNative.init({
        android: {
          senderID: "122680069143"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      });
     
      let that = this;
      push.on('notification', function(data) {
        /*let order: Array<string> = [];
        data.additionalData.payload.order.forEach(function(i) {
          order.push(i[0]);
        });*//*
        that.orders.push(data.additionalData.payload.order);
        
        push.finish(function() {
              //this.navCtrl.push(OrderSentPage);
            }, function() {
              alert("something went wrong with push.finish for ID = " + data.additionalData.notId)
            }, data.additionalData.notId
          );
      });
      
    }*/
    
    if(this.auth.isAuthenticated()) {
      this.presentLoading('Authenticating...');
      // NOTE: Google Maps disabled for the moment
      //this.navCtrl.setRoot(GoogleMapsPage);
      
      if (!this.platform.is('cordova')) {
        if (this.user.details.email === this.default_bar_email /*|| this.bar_checked*/) {// CUSTOMIZED FOR TESTING PURPOSES
          this.navCtrl.push(BarHomepagePage);
        } else if (this.user.details.email === 'bnp@paribas.cardif') {
          this.navCtrl.push(MenuFairPage);
        }  else {
          this.navCtrl.push(MenuPage);
        }
        return;
      }
      
      
      // Register for notifications
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        this.device_token = t.token;
        if (this.user.details.email === this.default_bar_email /*|| this.bar_checked*/) {// CUSTOMIZED FOR TESTING PURPOSES
          this.navCtrl.push(BarHomepagePage);
        } else if (this.user.details.email === 'bnp@paribas.cardif') {
          this.navCtrl.push(MenuFairPage, {token: this.device_token});
        }  else {
          this.navCtrl.push(MenuPage, {token: this.device_token});
        }
      });
      /*
      this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });

      if (this.user.details.email === 'manu.chaud.18@gmail.com' || this.bar_checked) {// CUSTOMIZED FOR TESTING PURPOSES
        this.navCtrl.push(BarHomepagePage);
      } else {
        console.log(this.device_token);
        this.navCtrl.push(MenuPage, {token: this.device_token});
      }*/
    }
  }
  
  login() {
    let loadCtrl = this.presentLoading('Authenticating...');
    loadCtrl.present();
    
    let credentials = {
      email: this.email,
      password: this.password
    };
    
    this.auth.login('basic', credentials, {'remember': this.remember}).then( () => {
      
      // No notification on browser
      if (!this.platform.is('cordova')) {
        if (this.user.details.email === this.default_bar_email /*|| this.bar_checked*/) {// CUSTOMIZED FOR TESTING PURPOSES
          this.navCtrl.push(BarHomepagePage);
        } else if (this.user.details.email === 'bnp@paribas.cardif') {
          this.navCtrl.push(MenuFairPage);
        } else {
          this.navCtrl.push(MenuPage);
        }
        return;
      }
      
      // Register for notifications
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        this.device_token = t.token;
        if (credentials.email === this.default_bar_email /*|| this.bar_checked*/) {// CUSTOMIZED FOR TESTING PURPOSES
          this.navCtrl.push(BarHomepagePage/*, {data: this.orders}*/);
        } else if (this.user.details.email === 'bnp@paribas.cardif') {
          this.navCtrl.push(MenuFairPage, {token: this.device_token});
        }  else {
          this.navCtrl.push(MenuPage, {token: this.device_token});
        }
      });
      /*
      this.push.rx.notification()
      .subscribe((msg) => {        
        alert(msg.title + ': ' + msg.text);
      });

      // NOTE: Google Maps disabled for the moment
      //this.navCtrl.push(GoogleMapsPage);
      /*
      if (credentials.email === 'manu.chaud.18@gmail.com' || this.bar_checked) {// CUSTOMIZED FOR TESTING PURPOSES
        this.navCtrl.push(BarHomepagePage, {data: this.orders});
      } else {
        console.log('this.device_token (Login):',this.device_token);
        this.navCtrl.push(MenuPage, {token: this.device_token});
      }*/
    }, (err) => {
      loadCtrl.dismiss();
      this.presentAlert('Error', err.message);
      console.log(err);
    });
    
  }
  
  launchSignup() {
    this.navCtrl.push(SignupPage);
  }
}