import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IssueComponent } from './issue/issue.component';
import {SidebarComponent} from "./sidebar/sidebar.component";
import { NavbarComponent } from './navbar/navbar.component';
import { IssueModalComponent } from './issue-modal/issue-modal.component';
import { FileGenComponent } from './file-gen/file-gen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    IssueComponent,
    SidebarComponent,
    NavbarComponent,
    IssueModalComponent,
    FileGenComponent
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, HttpClientModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
