import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input()
  popupVisible: boolean;

  userName: string;

  @Output()
  loginOk: EventEmitter<any> = new EventEmitter();

  constructor(readonly userService: UserService) { }

  ngOnInit(): void {
  }

  login(e) {
    this.userService.login(this.userName).subscribe(i => {
      this.loginOk.emit({ token: i, userName: this.userName});
    })
  }
}
