import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import {Issue, Action} from "../issue/issue.component";
import {IssueService} from "../issue.service";
import {Modal} from "./modal";
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.css']
})
export class IssueModalComponent implements OnInit {
  issue: Issue;
  action: Action;
  actions: Action[];
  id: number;
  prior = ['High','Medium','Low'];
  @Input() mode: string;
  @Output() closeM = new EventEmitter<string>();
  model: Modal = new Modal();
  ISSUES: Issue[];
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private issueService: IssueService, private http: HttpClient) { }
  ngOnInit(): void {
    this.issue = this.issueService.getSelectedIssue()!;
    this.actions = this.issueService.getActions()!;
    this.action=this.issueService.getAction()!;
    this.model=new Modal();
    console.log(this.mode);

    if(this.mode=="add"){
      this.id=Math.floor((Math.random()*100)+1);
      this.model.setType("Add issue");
      this.model.setTitle("");
      this.model.setDescription("");
      this.actions = [];
    }
    if(this.mode=="edit" || this.mode=="editi"){
      this.model.setType("Update issue");
      this.id= this.issue.id;
      this.model.setTitle(this.issue.title);
      this.model.setDescription(this.issue.description);
      this.model.setpriorityLevel(this.issue.priorityLevel);
    }
    if(this.mode=="aadd" || this.mode=="aaddi"){
      this.model.setType("Add action");
      this.model.setTitle("");
      this.model.setDescription("");
    }
    if(this.mode=="aedit" || this.mode=='aediti'){
      this.model.setType("Edit action");
      this.model.setTitle(this.action.title);
      this.model.setDescription(this.action.description);
    }
}
ngOnChanges(){
  this.ngOnInit();
}
  public save(){
    if(this.mode=="add"){
      this.issue=new Issue(this.id,this.model.getTitle()!,this.model.getDescription()!,new Date('2022/05/28'),null,"Open",this.model.getpriorityLevel()!);
      this.saveIssue(this.issue);
    }
    if(this.mode=="edit" || this.mode=="editi"){
          this.issue.title=this.model.getTitle()!;
          this.issue.description=this.model.getDescription()!;
          this.issue.priorityLevel=this.model.getpriorityLevel()!;
      this.updateIssue();

    }
    if(this.mode=="aadd"){
      this.action=new Action(Math.floor((Math.random()*1000000)+1),this.model.title!,this.model.description!,'Open',this.issue.id!);
      this.saveAction();
    }
    if(this.mode=="aaddi"){
      this.action=new Action(this.actions[this.actions.length-1].id + 1,this.model.title!,this.model.description!,'Open',this.issue.id!);
      this.actions.push(this.action);
      this.issueService.setActions(this.actions);
      this.close('editi');
    }
    if(this.mode=="aedit" || this.mode=="aediti"){
          this.action.title=this.model.getTitle()!;
          this.action.description=this.model.getDescription()!;
      this.updateAction();
    }

  }

  public close(key:string){
    if(this.mode=='aedit'){
      key='edit';
    }
    if(key=='none1'){
      key='none';
    }
    this.closeM.emit(key);
  }
  public adtoiss(){
    if(this.mode=="add"){
      this.issue=new Issue(this.id,this.model.getTitle()!,this.model.getDescription()!,new Date(),null,"Open",this.model.getpriorityLevel()!);
      this.issueService.setIssue(this.issue);
    }
    this.closeM.emit('aaddi');
  }
  public eActi(key: number){
    for (let i of Object.keys(this.actions)) {
      if(this.actions[i].id === key){
        this.issueService.setAction(this.actions[i]);
      }
    }
    this.closeM.emit('aedit');
  }

  public saveIssue(issue: Issue): void {
    const promise = this.http.post<Issue>(`${this.apiServerUrl}/api/Issue`, issue).toPromise();
    promise.then((data)=>{

      if(this.actions.length == 0){
        this.close('none');
      }
      else{
        this.saveAllActions();
      }
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

  }
  public saveAction(): void {
    const promise = this.http.post<Action>(`${this.apiServerUrl}/api/Issue/${this.issue.id}/ActionPoint`, this.action).toPromise();
    promise.then((data)=>{
      this.closeM.emit('none');
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

  }
  public updateIssue(): void {
    const promise = this.http.put<Issue>(`${this.apiServerUrl}/api/Issue/${this.issue.id}`, this.issue).toPromise();
    promise.then((data)=>{
      this.close('none1');
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

  }
  public updateAction(): void {
    const promise = this.http.put<Action>(`${this.apiServerUrl}/api/ActionPoint/${this.action.id}`, this.action).toPromise();
    promise.then((data)=>{
      if(this.mode=="aediti"){
        this.close('none');
      }
      else{
        this.close('edit');
      }
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

  }
  public saveAllActions(): void {
    for(let i of Object.keys(this.actions)){
    const promise = this.http.post<Action>(`${this.apiServerUrl}/Issue/${this.issue.id}/ActionPoint`, this.actions[i]).toPromise();
    promise.then((data)=>{
      if(Number(i) == this.actions.length){
        this.close('none');
      }
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
  }
}
