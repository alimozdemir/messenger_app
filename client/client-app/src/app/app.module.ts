import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { LoginComponent } from './components/login/login.component';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './components/chat/chat.component';
import { HubService } from './services/hub.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxListModule,
    DxButtonModule,
    DxTextBoxModule,
    DxPopupModule
  ],
  providers: [UserService, MessageService, HubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
