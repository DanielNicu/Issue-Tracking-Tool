import { Component, OnInit } from '@angular/core';
import {Issue, Action} from "./issue/issue.component";
import {IssueService} from "./issue.service";
import { SidebarComponent } from "./sidebar/sidebar.component";
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  modal="main";
  reload: boolean = false;
  export="none";
  isShow = true;
  rel=false;
  disp = 0;
  key="";
  priority: string[] = [
    "Open",
    "In Progress",
    "Resolved",
    "Closed"
  ];

  constructor(private issueService: IssueService) {}
  ngOnInit(): void{}
  ngOnChanges(){
    this.ngOnInit();
  }
  addItem(key: number) {
    if (key == this.disp) {
      this.disp=0;
    }
    else {
      this.disp=key;
    }

  }
  search(key: string){
    this.key=key;
  }

  public onShow(): number | undefined{
    return this.disp;
  }
  public getModal(): string {
    return this.modal;
  }
  public getExport(): string {
    return this.export;
  }
    showModal(key: string) {
      this.modal=key;
  $("#addIssueModal").modal('show');
}
showFile(key: string){
  this.export=key;
  $("#exportModal").modal('show');
}
closeFile(key: string){
  this.export=key;
  $("#exportModal").modal('toggle');
}
closeModal(key: string){
  this.modal=key;
  if(this.modal!='none'){
    this.showModal(key);
  }
  else{
    this.reload=!this.reload;
    this.addItem(0);
    $("#addIssueModal").modal('toggle');

  }

}
public re(key: boolean){
  this.reload=!this.reload;
}
}
