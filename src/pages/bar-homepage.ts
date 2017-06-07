import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
//import { Push as PushNative } from 'ionic-native';
import { Auth, Push } from '@ionic/cloud-angular';
import { LoginPage } from '../login-page/login-page';
import { Http, Headers, RequestOptions } from '@angular/http';

/*
  Generated class for the BarHomepage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bar-homepage',
  templateUrl: 'bar-homepage.html'
})
export class BarHomepagePage {
  
  pending_orders: Array<Object>;
  ready_orders: Array<Object>;
  finished_orders: Array<Object>;
  //pushNative: any;
  state: string = 'pending';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
              public auth: Auth, public push: Push, public platform: Platform) {
    this.pending_orders = [];
    this.ready_orders = [];
    this.finished_orders = [];
    /*console.log(navParams.get('data'));
    if (navParams.get('data') !== undefined) {
      this.pending_orders = navParams.get('data');
    }*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarHomepagePage');
    
    if (!this.platform.is('cordova')) {
      alert('Notfications are not going to work on this device!');
      return;
    }
    
    
    this.push.rx.notification()
    .subscribe((msg) => {
      /* 
      {text: 3 Tequila,...
       title: New order received!
       count: undefined
       sound: 'default'
       image: undefined
       app: {asleep: false, closed: false}
       payload: {order:{...}, token:'...', username:'...'}
      }
      */
      
      // FOR DEBUG PURPOSES
      let res_console = '';
      for (let key in msg) { res_console += key + ': ' + msg[key] + '; '; }
      console.log('res_console:', res_console);
      res_console = '';
      msg.payload['order'].forEach((i) => { for (let key in i) { res_console +=  key + ': ' + i[key] + ', '}; res_console += '\n'; } );
      console.log('msg.payload[\'order\'] = {', res_console,'}');
      res_console = '';
      for (let key in msg.app) { res_console += key + ': ' + msg.app[key] + '\n'; }
      console.log('msg.app = {', res_console,'}');
      res_console = '';
      for (let key in msg.raw) { res_console += key + ': ' + msg.raw[key] + '\n'; }
      console.log('msg.raw = {', res_console,'}');
      
      this.pending_orders.push(msg.payload['order']);
      this.pending_orders[this.pending_orders.length-1]['token'] = msg.payload['token'];
      this.pending_orders[this.pending_orders.length-1]['username'] = msg.payload['username'];
      console.log('sender token: ', msg.payload['token']);
    });
/*
    this.pushNative = PushNative.init({
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

    let that = this; // in the push callback, this doesn't reference the BarHomepagePage class anymore...
    // WARNING: doesn't work on Android 4.2.2 (push notification event is not trigerred for that version)
    this.pushNative.on('notification', function(data) {
      /*let order: Array<string> = [];
      data.additionalData.payload.order.forEach(function(i) {
        order.push(i[0]);
      });*//*
      that.pending_orders.push(data.additionalData.payload.order);
      console.log('sender token: ', data.additionalData.payload.token)
            
      that.pushNative.finish(function() {
            //this.navCtrl.push(OrderSentPage);
          }, function() {
            alert("something went wrong with push.finish for ID = " + data.additionalData.notId)
          }, data.additionalData.notId
        );
    });*/
  }
  
  notifyCustomer(index) {
    
    let link = 'https://api.ionic.io/push/notifications';
    console.log('token receiver:', this.pending_orders[index]['token']);
    //let link_browser = 'http://push.api.phonegap.com/v1/push';
    let data = {
      'tokens': [this.pending_orders[index]['token']],
      'profile': 'manu',
      'title': 'Order ready!',
      'notification': {
        'message': 'Your order is ready! Please get it at the bar',
        
        'android': {
          'sound': 'default' // TODO: '<sound file>' to customize sound
        },
        'ios': {
          'sound': 'default' // TODO: '<sound file>' to customize sound
        }
      }
      
    };
    let headers = new Headers();
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzN2M0OGQ5My01Mjk2LTQ3YWItYjhlZC0yYzllZjIzZWVhOGYifQ.Pa8fUng34GXNos4CusJ1LXJzXHVl9N3u7GRO-s26qzM';
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    let that = this;
    this.http.post(link, data, options)
      .subscribe(
        data => {
          console.log(data);
          that.ready_orders.push( that.pending_orders.splice(index, 1)[0] );
        },
        err => alert(err)
      );
  }
  
  
  orderPaid(index) {
    this.finished_orders.push( this.ready_orders.splice(index, 1)[0] );
  }
  
  logout() {
    /*if (this.platform.is('cordova')) {
      this.pushNative.unregister(function() {
        console.log('success unregister pushNative');
      }, function() {
        alert('error unregister pushNative');
      });
    }*/
    this.push.unregister();
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }
  
  exitApp() {
     this.platform.exitApp();
     
  }
  
}
