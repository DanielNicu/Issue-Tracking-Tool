import {Action, Issue} from "./issue/issue.component";


export const ACTIONS: Action[] = [
  {
    id : 1,
    title : 'Change font',
    description: '...',
    status: 'Open',
    issueid: 2
  },
  {
    id : 2,
    title : 'Center display',
    description: '...',
    status: 'Open', 
    issueid: 2
  }
];

export const ISSUES: Issue[] = [
  {
    id : 1,
    title : 'Site database refresh',
    priority : 'High',
    status : 'Open',
    description : '...',
    CreationDate: new Date(),
    ClosingDate: new Date(),
    actionPoints: ACTIONS
  },
  {
    id : 2,
    title : 'Site display problem',
    priority : 'Low',
    status:'In progress' ,
    description : '...',
    CreationDate: new Date(),
    ClosingDate: new Date(),
    actionPoints: ACTIONS
  },
  {
    id : 3,
    title : 'Delete',
    priority : 'High',
    status : 'Open',
    description : '...',
    CreationDate: new Date(),
    ClosingDate: new Date(),
    actionPoints: ACTIONS
  }
];
