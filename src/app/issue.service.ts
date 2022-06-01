import { Injectable } from '@angular/core';
import {Action, Issue} from "./issue/issue.component";
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})



export class IssueService {
  private apiServerUrl = environment.apiBaseUrl;
  issue?: Issue;
  action?: Action;
  showIt: boolean = false;
  issues : Observable<Issue[]>;
  actions=ACTIONS;
  constructor(private http: HttpClient) { }

  getIssues(): Observable<Issue[]>{
    return this.issues;
  }
  setIssues(issues : any) : void {
    this.issues=issues;
  }

  setShowIt(showIt: boolean) {
    this.showIt = showIt;
  }
  getShowIt() {
    return this.showIt;
  }
  setIssue(id: Issue) {
    this.issue = id!;
  }
  getSelectedIssue() {
    return this.issue;
  }
  setActions(actions: any){
    this.actions=actions;
  }
  getActions(){
    return this.actions;
  }
  setAction(action: Action){
    this.action=action
  }
  getAction(){
    return this.action;
  }
  public hgetIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiServerUrl}/api/Issue`);
  }

  public haddIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(`${this.apiServerUrl}/Issue`, issue);
  }

  public hupdateIssue(issue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiServerUrl}/api/Issue/${issue.id}`, issue);
  }

  public hgetActions(key: number): Observable<Action[]> {
    return this.http.get<Action[]>(`${this.apiServerUrl}/api/Issue/${key}/ActionPoint`);
  }

  public haddAction(action: Action, issue: Issue): Observable<Action> {
    return this.http.post<Action>(`${this.apiServerUrl}/Issue/${issue.id}/ActionPoint`, action);
  }

  public hupdateAction(action: Action): Observable<Action> {
    return this.http.put<Action>(`${this.apiServerUrl}/ActionPoint${action.id}`, action);
  }

  public hdeleteAction(action: Action): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/ActionPoint/${action.id}`);
  }
}

export const ACTIONS: Action[] = [
  new Action(1,'Change font','...','Open',2),
  new Action(2,'Center font','...','Resolved',2)
];

export const ISSUES: Issue[] = [
  new Issue(1,'Site database refresh','...',new Date('2020-12-20T10:30:00'),null,'Open','High'),
  new Issue(2,'Site display problem','...',new Date('2020-12-20T10:30:00'),null,'Open','Low'),
  new Issue(3,'Delete','...',new Date('2020-12-20T10:30:00'),new Date(),'Closed','High')
];
