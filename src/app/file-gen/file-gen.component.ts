import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import {IssueService} from "../issue.service";
import {Issue, Action} from "../issue/issue.component";
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import {FormGroup, FormControl} from '@angular/forms';
import {Modal1} from './modal2';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-file-gen',
  templateUrl: './file-gen.component.html',
  styleUrls: ['./file-gen.component.css']
})
export class FileGenComponent implements OnInit {
  private apiServerUrl = environment.apiBaseUrl;
  @Output() closeF = new EventEmitter<string>();
  @Input() mode: string;
  show=false;
  model: Modal1;
  filetype = ['CSV','XML'];
  issues: Issue[];
  actions: Action[];
  constructor(private issueService: IssueService, public datepipe: DatePipe,  private http: HttpClient) { }

  ngOnInit(): void {
    this.model=new Modal1();
    this.actions=[];
    this.getIssues();
    this.show=false;
  }
  ngOnChanges(){
    this.actions=[];
    this.ngOnInit();
  }
  public close(key:string){
    this.closeF.emit();
  }
  public downloadCSV(results: Issue[]){
    var res=[];
    var acs=[];
    res.push("sep=,\n");
    res.push("Issues:\n");
    res.push("Issue Id,Title,Description,priorityLevel,Status,Creation Date,Closing Date\n");
    for(let is of results){
      res.push(is.id.toString());
      res.push(",");
      res.push(is.title);
      res.push(",");
      res.push(is.description);
      res.push(",");
      res.push(is.priorityLevel);
      res.push(",");
      res.push(is.status);
      res.push(",");
      res.push(this.datepipe.transform(is.creationDate, 'yyyy-MM-dd')!);
      res.push(",");
      if(is.closingDate != null){
        res.push(this.datepipe.transform(is.closingDate!, 'yyyy-MM-dd')!);
      }
      else{
        res.push(' ');
      }
        res.push("\n");
        for(let ac of this.actions){
          if(is.id==ac.issueid){
            acs.push(ac);
          }
        }
      }
      res.push('\n');
      res.push("Actions:\n");
      res.push("Action Id,Title,Descrtiption,Status,Issue ID\n");
      for(let ac of acs){
          res.push(ac.id.toString());
          res.push(",");
          res.push(ac.title);
          res.push(",");
          res.push(ac.description);
          res.push(",");
          res.push(ac.status);
          res.push(",");
          res.push(ac.issueid.toString());
          res.push("\n");
      }

    let newBlob = new Blob(res);
    let fileName = 'ISSUES.csv'
    let saveFile = new File([newBlob], fileName);
    const objectUrl = URL.createObjectURL(saveFile);
    const atag = document.createElement('a');
    atag.setAttribute('href', objectUrl);
    atag.setAttribute('download', fileName);
    atag.click();
  }
  public downloadXML(results: Issue[]){
    var res=[];
    var acs=[];
    res.push('<?xml version="1.0" encoding="UTF-8"?>\n');
    res.push("<ISSUES>\n");
    for(let is of results){
      res.push("<ISSUE>\n")
      res.push("<ID>\n")
      res.push(is.id.toString()+"\n");
      res.push("</ID>\n")
      res.push("<TITLE>\n");
      res.push(is.title + "\n");
      res.push("</TITLE>\n");
      res.push("<DESCRIPTION>\n")
      res.push(is.description + "\n");
      res.push("</DESCRIPTION>\n");
      res.push("<priorityLevel>\n");
      res.push(is.priorityLevel + "\n");
      res.push("</priorityLevel>\n");
      res.push("<STATUS>\n");
      res.push(is.status + "\n");
      res.push("</STATUS>\n");
      res.push("<creationDate>\n");
      res.push(this.datepipe.transform(is.creationDate, 'yyyy-MM-dd') + "\n");
      res.push("</creationDate>\n");
      res.push("<closingDate>\n");
      if(is.closingDate != null){
        res.push(this.datepipe.transform(is.closingDate!, 'yyyy-MM-dd')! + "\n");
      }
      else{
        res.push(' \n');
      }
        res.push("</closingDate>\n");
        res.push("<ACTIONPOINTS>\n");
        for(let ac of this.actions){
          if(is.id==ac.issueid){
            res.push("<ACTION>\n");
            res.push("<ID>\n");
            res.push(ac.id.toString()+"\n");
            res.push("</ID>\n");
            res.push("<TITLE>\n");
            res.push(ac.title + "\n");
            res.push("</TITLE>\n");
            res.push("<DESCRIPTION>\n");
            res.push(ac.description+ "\n");
            res.push("</DESCRIPTION>\n");
            res.push("<STATUS>\n");
            res.push(ac.status + "\n");
            res.push("</STATUS>\n");
            res.push("</ACTION>\n");
          }
        }
        res.push("</ACTIONPOINTS>\n");
        res.push("</ISSUE>\n");
      }
      res.push("</ISSUES>");

    let newBlob = new Blob(res);
    let fileName = 'ISSUES.xml'
    let saveFile = new File([newBlob], fileName);
    const objectUrl = URL.createObjectURL(saveFile);
    const atag = document.createElement('a');
    atag.setAttribute('href', objectUrl);
    atag.setAttribute('download', fileName);
    atag.click();
  }
  public save(){
    var results: Issue[]=[];
    var ok;
    for(let is of this.issues){
      ok=true;
      if(this.model.sdate1!= null){
        if(new Date(this.model.sdate1!).getTime() > new Date(is.creationDate).getTime()){

          ok=false;
        }
      }
      if(this.model.sdate2!= null){
        if(new Date(this.model.sdate2!).getTime() < new Date(is.creationDate).getTime()){
          ok=false;
        }
      }
      if(this.model.cdate1!= null){
        if(is.closingDate==null){
          continue;
        }
        if(new Date(this.model.cdate1!).getTime() > new Date(is.closingDate).getTime()){
          ok=false;
        }
      }
      if(this.model.cdate2!= null){
        if(is.closingDate==null){
          continue;
        }
        if(new Date(this.model.cdate2!).getTime() < new Date(is.closingDate).getTime()){
          ok=false;
        }
      }
      if(ok==true){
        results.push(is);
      }
    }
    if(results.length === 0){
      this.show=true;
    }
    else{
      if(this.model.type=='CSV'){
        this.downloadCSV(results);
      }
      if(this.model.type=='XML'){
        this.downloadXML(results);
      }
      this.closeF.emit();
    }

  }
  public getIssues(): void {
    const promise = this.http.get<Issue[]>(`${this.apiServerUrl}/api/Issue`).toPromise();
    promise.then((data)=>{
      this.issues=data!;
      for(let i of Object.keys(this.issues)){
        this.getActions(this.issues[i].id);
      }
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
  public getActions(key: number) {
    const promise = this.http.get<Action[]>(`${this.apiServerUrl}/api/Issue/${key}/ActionPoint`).toPromise();
    promise.then((data)=>{
      for(let i of data!){
        i.issueid=key;
        this.actions.push(i);
      }

    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
}
