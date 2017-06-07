import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { Auth, User, Push } from '@ionic/cloud-angular';
import { LoginPage } from '../login-page/login-page';
import { MenuPage } from '../menu/menu';
import {MenuFairPage} from '../menu-fair/menu-fair';
//import { Push as PushNative } from 'ionic-native';

// ERROR: `-- UNMET PEER DEPENDENCY rxjs@5.0.1
import { Vibration } from '@ionic-native/vibration';

/*
  Generated class for the OrderSent page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-sent',
  templateUrl: 'order-sent.html'
})
export class OrderSentPage {
  
  //pushNat;
  ready: boolean = false;
  order: any;
  total_amount: number;
  isInBackground: boolean = false; // ERROR
  device_token: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User,
              public push: Push, private vibration: Vibration, private platform: Platform) {
    //this.pushNat = this.navParams.get('push'); // ERROR
    this.order = this.navParams.get('order');
    this.total_amount = this.navParams.get('total_amount');
    this.device_token = this.navParams.get('token');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSentPage');
    
    
    // ERROR: Vibration plugin has unmet peer dependency 
    let that = this; // otherwise this would refer to document
    document.addEventListener('pause', function() {
      that.isInBackground = true;
    });
    document.addEventListener('resume', function() {
      that.isInBackground = false;
    });
    
    this.push.rx.notification()
    .subscribe((msg) => {
      /* 
      {raw: ?
       text: 3 Tequila,...
       title: New order received!
       count: undefined
       sound: 'default'
       image: undefined
       app: {asleep: false, closed: false}
       payload: {order:{...}, token:'...'}
      }
      */
      
      this.ready = true;
      // ERROR
      if (!this.isInBackground) {
        this.vibration.vibrate(1000);
      }
    });
    
    /*
    // notifications are not available on desktop
    if (!this.platform.is('cordova')) { 
      return;
    }
    
    this.pushNat = PushNative.init({
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
    
    // BUG: apparently this doesn't work on Android 4.2.2
    this.pushNat.on('notification', function(data) {
      /*data = {
        'title': <title>,
        'message': <message>,
        'sound': <sound>
        'additionalData': {
          'payload': <payload>,
          ...
        }
      }
      /
      let res: string = '';
      data.additionalData.payload.order.forEach(function(i) {
        res += i[0] + '\n';
      });
      alert(res);
      
      // then call finish to let the OS know we are done
      this.pushNat.finish(function() {
          this.navCtrl.push(OrderSentPage, {push: this.pushNat});
        }, function() {
          alert("something went wrong with push.finish for ID = " + data.additionalData.notId)
        }, data.additionalData.notId
      );
    });
    */
  }
  
  goBackMenu() {
    if (this.user.details.email === 'bnp@paribas.cardif') {
      this.navCtrl.push(MenuFairPage, {token: this.device_token});
    } else {
      this.navCtrl.push(MenuPage, {token: this.device_token});
    }
  }
  
  logout() {
    /*this.pushNat.unregister(function() {
      console.log('success unregister pushNative');
    }, function() {
      alert('error unregister pushNative');
    });*/
    // Push object is not equivalent to https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md#pushunregistersuccesshandler-errorhandler-topics
    // in that its functions do not provide the same functionalities
    this.push.unregister();
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
