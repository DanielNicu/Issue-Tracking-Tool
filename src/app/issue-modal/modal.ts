import {Issue, Action} from "../issue/issue.component";
export class Modal{
  type?: string;
  title?: string;
  priorityLevel?: string;
  description?: string;
  constructor(){

  }
  public getType(){
    return this.type;
  }
  public setType(type: string){
    this.type=type;
  }
  public getTitle(){
    return this.title;
  }
  public setTitle(title: string){
    this.title=title;
  }
  public getpriorityLevel(){
    return this.priorityLevel;
  }
  public setpriorityLevel(priorityLevel: string){
    this.priorityLevel=priorityLevel;
  }
  public getDescription(){
    return this.description;
  }
  public setDescription(description: string){
    this.description=description;
  }

}
