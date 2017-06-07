import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Auth, User, Push } from '@ionic/cloud-angular';
import { LoginPage } from '../login-page/login-page';
import { ConfirmOrderPage } from '../confirm-order/confirm-order';

// TODO: check that at least one drink is ordered
// TODO: add drinks in a separate file for fata (cf. https://www.joshmorony.com/create-a-nearby-places-list-with-google-maps-in-ionic-2-part-2/)

/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  
  //default_bar_email: string = 'b@b.bb';
  drinks = [
  {
    type: 'Beers',
    list: [
      { name: 'Heineken',    price: 3.5, isChecked: false, quantity: 0 },
      { name: 'Pelfort',     price: 3.5, isChecked: false, quantity: 0 },
      { name: 'Kronenbourg', price: 3.5, isChecked: false, quantity: 0 }
    ]
  },
  {
    type: 'Cocktails',
    list: [
      { name: 'Pina Colada',      price: 5, isChecked: false, quantity: 0 },
      { name: 'Mojito',           price: 5, isChecked: false, quantity: 0 },
      { name: 'Sex on the Beach', price: 5, isChecked: false, quantity: 0 }
    ]
  },
  {
    type: 'Shots',
    list: [
      { name: 'Vodka',     price: 3, isChecked: false, quantity: 0 },
      { name: 'Tequila',   price: 3, isChecked: false, quantity: 0 },
      { name: 'Jagerbomb', price: 3, isChecked: false, quantity: 0 }
    ]
  } ];
  bar_email: string;// CUSTOMIZED FOR TESTING PURPOSES
  /* global namespace is not accessible in a template expression
   * http://stackoverflow.com/questions/39866635/typeerror-self-parent-parent-context-parseint-is-not-a-function#answer-39866674*/
  //myArray = Array;
  //myNumber = Number;
  device_token: any;
  username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public push: Push, public user: User) {
    this.bar_email = '';// CUSTOMIZED FOR TESTING PURPOSES
    this.device_token = navParams.get('token');
    this.username = user.details.username;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
  
  sendOrder() {
    let items_ordered=[];
    this.drinks.forEach((o) => {
      o.list.forEach((d) => {
        (+d.quantity) > 0 && items_ordered.push({name: d.name, price: d.price, quantity: +(d.quantity)});
      });
    });
    this.navCtrl.push(ConfirmOrderPage, {data:items_ordered, receiver:this.bar_email, token: this.device_token, username: this.username})// CUSTOMIZED FOR TESTING PURPOSES
  }
  
  checkOrder() {
    //return !document.querySelectorAll('.checkbox-checked').length;
    let qty_total:number = 0;
    this.drinks.forEach((o) => {
      o.list.forEach((d) => {
        qty_total += (+d.quantity);
      })
    })
    return qty_total === 0;
  }
  
  logout() {
    this.push.unregister()
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}