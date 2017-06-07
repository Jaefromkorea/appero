import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

import { OrderSentPage } from '../order-sent/order-sent';

/*
  Generated class for the ConfirmOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html'
})
export class ConfirmOrderPage {
  
  default_bar_email: string = 'b@b.bb';
  items_ordered: any;
  receiver: string;
  device_token: any;
  username: string;
  total_amount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public platform: Platform,
              public loadingCtrl: LoadingController) {
    this.items_ordered = navParams.get('data');
    this.receiver = navParams.get('receiver');// CUSTOMIZED FOR TESTING PURPOSES
    this.device_token = navParams.get('token');
    this.username = navParams.get('username');
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmOrderPage');
  }
  
  presentLoading(msg: string) {
    return this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true
    });
  }
  
  confirmOrder() {
    let loadCtrl = this.presentLoading('Sending order...');
    loadCtrl.present();
    console.log(this.items_ordered);
    
    let message = '';
    let items = [];
    this.items_ordered.forEach((i) => items.push(i.quantity + ' ' + i.name));
    message =  items.join(', ');
    
    /*items_ordered's format:
    [{name:'Tequila', price:5, quantity:1}, {...}, ...]
    after modif.:
    [{name:'Tequila', price:5, quantity:1, token:'...', username:'...'}, {...}, ...]
    */
    
    console.log('device_token: ' + this.device_token);
    
    let rcvr = (this.receiver ? this.receiver : this.default_bar_email);// CUSTOMIZED FOR TESTING PURPOSES
    // TODO: Send orders to the server instead of directly to the bar
    let link = 'https://api.ionic.io/push/notifications';
    //let link_browser = 'http://push.api.phonegap.com/v1/push';
    let data = {
      //Dev device, using manu.chaud@hotmail.fr account: 'tokens': ['c7QaCkuMFtM:APA91bG1z2fjfalfSSdTxXNJf3rw4AYKA0kefuga3PY2oYHCyJC40DWZ2o5uDwk2I9GmIl2OUhVX12iVfDEQ_qHoEfySOTEXOe9pWePPcz3iqu3plRZClkP-qN-Xtn87gnmSaMT8XVb5'],
      //'tokens': ['cUeMO-d9C6M:APA91bGTx0j2lytNnIfNVeMBjqzl-8Lv4VrnwWegDWAIKSPZBKGOLaTWXscUiCu68sMMYJn8d4G41i3tQ0QFFxENLbUKrhZd0hsrEJei5WEtx8JH4WpYK6BMmhdeBBNLFuqQbFeMQ_FI'],
      //manu.chaud.18@gmail.com's id: 'user_ids': ['c7805588-6e9a-40a3-83f0-f2d950d39f2f'],
      'emails': [rcvr],
      'profile': 'manu',
      'title': 'New order received!',
      'notification': {
        'message': message,
        'payload': {'order': this.items_ordered, 'token': this.device_token, 'username': this.username},
        
        'android': {
          'title': 'New order received!',
          'message': message,
          'payload': {'order': this.items_ordered, 'token': this.device_token, 'username': this.username},
          'sound': 'default' // TODO: '<sound file>' to customize sound
        },
        'ios': {
          'title': 'New order received!',
          'message': message,
          'payload': {'order': this.items_ordered, 'token': this.device_token, 'username': this.username},
          'sound': 'default' // TODO: '<sound file>' to customize sound
        }
      }
      
    };
    let headers = new Headers();
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzN2M0OGQ5My01Mjk2LTQ3YWItYjhlZC0yYzllZjIzZWVhOGYifQ.Pa8fUng34GXNos4CusJ1LXJzXHVl9N3u7GRO-s26qzM';
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    this.http.post(link, data, options)
      .subscribe(
        data => {
          console.log(data);
          this.navCtrl.push(OrderSentPage, {order: this.items_ordered, total_amount: this.total_amount, token: this.device_token});
        },
        err => {
          loadCtrl.dismiss();
          alert(err)
        }
      );
      
      /*
    this.http.post(link_browser, data)
      .subscribe(
        data => {
          console.log(data);
          this.navCtrl.push(OrderSentPage);
        },
        err => alert(err)
      );*/

  }
  
  totalPrice(): number {
    let total: number = 0;
    this.items_ordered.forEach((i) => {
      total += i.price*i.quantity;
    });
    this.total_amount = total;
    return total;
  }

}
