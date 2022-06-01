import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import {Issue, Action} from "../issue/issue.component";
import {IssueService} from "../issue.service";
import { ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
 import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { environment } from '../../environments/environment';
 import { DatePipe } from '@angular/common'
 declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private issueService: IssueService, private http: HttpClient, private datePipe: DatePipe) {


  }
  adisp=0;
  issue: Issue ;
  actions: Action[]=[];
  @Input() rel?: boolean;
  @Input() v1?: number;
  @Output() newItemEvent = new EventEmitter<number>();
  @Output() reload = new EventEmitter<boolean>();
  @Output() ei = new EventEmitter<string>();
  show: boolean = true;
  ISSUES: Issue[];
  ngOnInit(): void {

  }
  ngOnChanges() {
    this.actions=[];
    this.issue=this.issueService.getSelectedIssue()!;
    this.getActions(this.issue.id);
    const h1 = document.createElement('h1');
    h1.innerText = this.actions[0].title;
    $('#actions').append(h1);
    this.ngOnInit();
  }

  setIssue(id: number){
    this.newItemEvent.emit(0);
  }
  public edit(key: string){
    this.issueService.setIssue(this.issue);
    this.issueService.setActions(this.actions);
    this.ei.emit(key);
  }
  setShowIt() {
    this.show = !this.show;
    this.issueService.setShowIt(this.show);
  }
  AonSave(key: number): void {
    if (key == this.adisp) {
      this.adisp=0;
    }
    else {
      this.adisp=key;
    }

  }
  public close(){
         var ok=0;
        for(let j of this.actions){
          if(this.issue.id == j.issueid){
            if(j.status!='Resolved'){
              ok=1;
            }
          }
          }
          if(ok==0){
            this.issue.status='Closed';
            this.issue.closingDate=new Date('2022/05/20');
            console.log(this.issue.closingDate);

            this.updateIssue(this.issue);
        }
  }
  public AonShow(): number{
    return this.adisp;
  }
  public sProg(key: number){
    for(let i of Object.keys(this.actions)){
      if(this.actions[i].id == key){
        this.actions[i].status='In Progress';
        this.updateAction(this.actions[i]);
      }
    }
    this.reload.emit(true);
  }
  public sRes(key: number){
    for(let i of Object.keys(this.actions)){
      if(this.actions[i].id == key){
        this.actions[i].status='Resolved';
        this.updateAction(this.actions[i]);
      }
    }
    this.reload.emit(true);
  }
  public updateAction(action: Action): void {
    const promise = this.http.put<Action>(`${this.apiServerUrl}/api/ActionPoint/${action.id}`, action).toPromise();
    promise.then((data)=>{

      this.reload.emit(true);
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
  public eActi(key: number){
    for (let i of Object.keys(this.actions)) {
      if(this.actions[i].id === key){
        this.issueService.setIssue(this.issue);
        this.issueService.setAction(this.actions[i]);
      }
    }
    this.ei.emit('aediti');
  }
  public dele(key: number){
    const promise = this.http.delete<void>(`${this.apiServerUrl}/api/ActionPoint/${key}`).toPromise();
    promise.then((data)=>{
      this.reload.emit(true);
      this.getActions(this.issue.id);
      var x = document.getElementById("#exp" + key)!;
      x.style.display = "none";
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

    return ;
  }
  public relo(){
    this.ngOnInit();
    this.ngOnChanges();
  }
  public updateIssue(issue: Issue): void {
    const promise = this.http.put<Issue>(`${this.apiServerUrl}/api/Issue/${issue.id}`, issue).toPromise();
    promise.then((data)=>{
      console.log("done");
      this.reload.emit(true);
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

  }
  public getActions(key: number) {
    const promise = this.http.get<Action[]>(`${this.apiServerUrl}/api/Issue/${key}/ActionPoint`).toPromise();
    promise.then((data)=>{
      this.actions=data!;

      
      console.log(data);
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
}
