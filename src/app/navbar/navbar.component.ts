import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {IssueService} from "../issue.service";
import {Issue} from "../issue/issue.component";
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
   @Output() newIssue: EventEmitter<string> = new EventEmitter<string>();
   @Output() file = new EventEmitter<string>();

  constructor(private issueService: IssueService) {
  }

  ngOnInit(): void {
  }

    public searchEmployees(key: string): void {

        this.newItemEvent.emit(key);
    }
    public addComponent(key: string): void {
      this.issueService.setActions([]);
      this.newIssue.emit(key);
    }
    public downloadCSV(key: string): void{
      this.file.emit(key);
    }
}
