import {Component, Input, OnInit ,Output, EventEmitter} from '@angular/core';
import {IssueService} from "../issue.service";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ISSUES} from "../issue.service"
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})


export class IssueComponent implements OnInit {
  private apiServerUrl = environment.apiBaseUrl;
  issues: Issue[] =[];
  actions: Action[] = [];
  results: Issue[] =[];
  ip: boolean;
  resolved: boolean;
  closed:boolean;
  @Input() reload: boolean;
  @Input() v1?: string;
  @Input() s1: string;
  priorityLevel: string[] = [
    "Open",
    "In Progress",
    "Resolved",
    "Closed"
  ];
  @Output() newItemEvent = new EventEmitter<number>();
  isShown: boolean = false;

  constructor(private issueService: IssueService, private http: HttpClient) {
  }

  ngOnInit(): void {


  }

  ngOnChanges() {
    this.getIssues();
      this.ngOnInit();
  }

  setIssue(id: number){
    for(let i of Object.keys(this.issues)){
      if(this.issues[i].id==id){
        this.issueService.setIssue(this.issues[i]);
      }
    }
    this.newItemEvent.emit(id);
  }
  public getIssues(): void {
    const promise = this.http.get<Issue[]>(`${this.apiServerUrl}/api/Issue`).toPromise();
    promise.then((data)=>{
      this.issues=data!;
      this.checkIssues();
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
  public getActions(key: number) {
    const promise = this.http.get<Action[]>(`${this.apiServerUrl}/api/Issue/${key}/ActionPoint`).toPromise();
    promise.then((data)=>{
      this.actions=data!;
      this.checkActions(key);
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
  public updateIssue(issue: Issue): void {
    if(this.issueService.getSelectedIssue()!.id == issue.id){
      this.issueService.setIssue(issue);
    }
    this.http.put<Issue>(`${this.apiServerUrl}/api/Issue/${issue.id}`, issue).toPromise();

  }
 public checkIssues(){
   const results: Issue[] = [];
   for (let i of Object.keys(this.issues)) {
     if (this.issues[i].title.toLowerCase().indexOf(this.s1.toLowerCase())!==-1)
      {
       results.push(this.issues[i]);
     }
   }
   this.issues=results;
   if (results.length === 0 || !this.s1) {

   }

   for(let is of Object.keys(this.issues)){
     this.getActions(this.issues[is].id);
   }
 }
 public checkActions(key: number){
   var is = this.issues.find(x => x.id === key)!;
    this.ip=false;
     this.resolved=true;
     this.closed=false;
     if(is.status===this.priorityLevel[3]){
       this.closed=true;
     }
     for(let ac of Object.keys(this.actions)){
         if((this.actions[ac].status===this.priorityLevel[1]) || (this.actions[ac].status==this.priorityLevel[2])){
           this.ip=true;
         }
         if((this.actions[ac].status===this.priorityLevel[0]) || (this.actions[ac].status===this.priorityLevel[1])){
           this.resolved=false;
         }
       }

     if(this.resolved==true && this.closed==false){
       is.status="Resolved";
       this.updateIssue(is);
     }
     if(this.resolved==false && this.ip==true && this.closed==false){
       is.status="In Progress";
       this.updateIssue(is);
     }
     if(this.resolved==false && this.ip==false && this.closed==false){
       is.status="Open";
       this.updateIssue(is);
     }
 }
}
export class Issue {
  id: number;
  title: string;
  description: string;
  creationDate: Date;
  closingDate: Date | null;
  status: string;
  priorityLevel: string;

  constructor(id: number,
  title: string,
  description: string,
  creationDate: Date,
  closingDate: Date | null,
  status: string,
  priorityLevel: string){
    this.id=id;
    this.title=title;
    this.description=description;
    this.creationDate=creationDate;
    this.closingDate=closingDate;
    this.status=status;
    this.priorityLevel=priorityLevel;
  };

}

export class Action {
  id: number;
  title: string;
  description: string;
  status: string;
  issueid: number;
  constructor(id: number,
  title: string,
  description: string,
  status: string,
  issueId: number){
    this.id=id;
    this.title=title;
    this.description=description;
    this.status=status;
    this.issueid=issueId;
  };
}
