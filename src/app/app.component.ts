import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchJsonDataService } from './fetch-json-data.service';
import { User } from './_models';
import { AuthenticationService } from './_services';
import { CurrentUserService } from './current-user.service';
import { MessagingService } from './messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  userList = [];
  userNameData = [];
  userEmailData = [];
  userPhoneData = [];
  userGenderData = [];
  userPassData = [];
  userIdData = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];

  constructor(private fetchData: FetchJsonDataService,
              private authenticationService: AuthenticationService,
              private setUser: CurrentUserService,
              private messagingService: MessagingService) { }
  message;
    sendPushNotification() {
      const userId = '2222';
      this.messagingService.requestPermission(userId);
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;

      this.messagingService.sendPushMessage('Web push notification', 'HI, Firebase test messsage');
    }



  ngOnInit() {


    this.subscription = this.fetchData.getUser().pipe().subscribe(val => {
      const userKey = Object.keys(val);
      userKey.map((ele, index) => {
        this.userIdData[index] = val[ele].id;
        this.userNameData[index] = val[ele].fullName;
        this.userEmailData[index] = val[ele].email;
        this.userPhoneData[index] = val[ele].phone;
        this.userGenderData[index] = val[ele].gender;
        this.userPassData[index] = val[ele].password;
        this.userList.push({
          id: this.userIdData[index],
          name: this.userNameData[index],
          username: this.userEmailData[index],
          password: this.userPassData[index],
          phone: this.userPhoneData[index],
          gender: this.userGenderData[index]
        });
      });
    });

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.setUser.sendUser(this.currentUser);
    });
    this.fetchData.putData(this.userList);
    console.log(this.userList);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }
}
