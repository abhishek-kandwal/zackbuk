import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-zacebuk-header',
  templateUrl: './zacebuk-header.component.html',
  styleUrls: ['./zacebuk-header.component.css']
})
export class ZacebukHeaderComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router, private messagingService: MessagingService) { }
  message;
  sendPushNotification() {
    const userId = '2222';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;

    this.messagingService.sendPushMessage('Web push notification', 'HI, Firebase test messsage');
  }

  ngOnInit() {
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/app-zacebuk-login']);
  }
}
