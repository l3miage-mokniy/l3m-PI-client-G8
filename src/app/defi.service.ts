import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Defi, Chami, DefiTmp, MotClef, Chercher, MotClefTmp, Indice, IndiceTmp, QuestionTmp, Question, escape_quote } from "./AllDefinitions";

@Injectable({
  providedIn: 'root'
})
export class DefiService {

  //voici la troupe d'observable
  //ce service est utilisé dans plusieurs composants
  // OK mais à la limite ça ne m'inquiète pas d'en avoir beaucoup dans un service
  // C'est plutôt au niveau des composant qu'il faut les minimiser

  private DefisSubj = new BehaviorSubject<Defi[]>( [] );
  readonly obsAllChall = this.DefisSubj.asObservable();

  private DefisOfAnUser = new BehaviorSubject<Defi[]>( [] );
  readonly obsChallUser = this.DefisOfAnUser.asObservable();

  private IndicesOfDefi = new Subject<Indice[]>();
  readonly obsIndices = this.IndicesOfDefi.asObservable();

  private QuestionsOfDefi = new Subject<Question[]>();
  readonly obsQuestions = this.QuestionsOfDefi.asObservable();

  private MotClefsOfDefi = new BehaviorSubject<MotClef[]>( [] );
  readonly obsMotClefs = this.MotClefsOfDefi.asObservable();

constructor() {
  const dateObject = new Date(new Date().getTime())
  const humanDateFormat = dateObject.toLocaleString()
  console.log(humanDateFormat)
 }


async getAllDefi(){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/');
  const data = await response.json();
  this.DefisSubj.next( data as Defi[]);
}

async getAllDefiOfAnUsers(user:Chami){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/auteur/'+user.pseudo);
  const data = await response.json();
  this.DefisOfAnUser.next( data as Defi[] );
}

async getAllIndicesOfDefi(defi:Defi){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/indice/allindice/'+defi.defi);
  const data = await response.json();
  this.IndicesOfDefi.next( data as Indice[] );
}

async getAllQuestionsOfDefi(defi:Defi){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/question/allquestion/'+defi.defi);
  const data = await response.json();
  this.QuestionsOfDefi.next( data as Question[] );
}

async getAllMotClefsOfDefi(defi:Defi):Promise<MotClefTmp[]>{
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/allmc/'+defi.defi);
  const data = await response.json();
  this.MotClefsOfDefi.next( data as MotClef[] );
  return data as MotClefTmp[]
}

closeEditDefi() {
  this.MotClefsOfDefi.next( [] );
  this.QuestionsOfDefi.next( [] );
  this.IndicesOfDefi.next( []);
}

async putDefi(defi: Defi): Promise<Defi> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/"+defi.defi,
  {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
  return res.json();
}


async postDefi(defi: DefiTmp): Promise<Defi> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
  return res.json();
}

async deleteDefi(defi: Defi) {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/defis/"+defi.defi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(defi)
  });
}

////////////////////////////////////////TEST MOT CLEF

async postMotClef(mot:MotClefTmp): Promise<MotClef> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(mot)
  });
  const R =  await res.json();
  return R;
}

async postListMotClef(listMot:MotClefTmp[]): Promise<MotClef[]> {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listMot)
  });
  const R =  await res.json();
  return R;
}

async postChercher(C: Chercher) {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/"+C.id_defi+"&"+C.id_mc,
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(C)
  });
}

async recupererMotClefUnDefi(id:string){
  const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/chercher/allmc/'+id);
  const data = await response.json();
  return data as MotClef[]
}

async postListIndice(listIndice:IndiceTmp[]): Promise<Indice[]> {
  listIndice.forEach(element => {
    element.description_ind=escape_quote(element.description_ind)
  });
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/indice/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listIndice)
  });
  const R =  await res.json();
  return R;
}

async deleteIndicesOfDefi(idDefi:string) {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/indice/deleteallindice/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
  });
  return res;
}

async postListQuestion(listQuestion:QuestionTmp[]): Promise<Question[]> {
  listQuestion.forEach(element => {
    element.description_qst=escape_quote(element.description_qst),
    element.secret_qst=escape_quote(element.secret_qst)
  });
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/question/list",
  {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(listQuestion)
  });
  const R =  await res.json();
  return R;
}

async deleteQuestionsOfDefi(idDefi:string) {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/question/deleteallquestion/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body:""
  });
  return res;
}

async deleteMotsClefsOfDefi(idDefi:string) {
  const res = await fetch("https://l3m-pi-serveur-g8.herokuapp.com/api/motclef/deleteallmotclef/"+idDefi,
  {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body:""
  });
  return res;
}

///////////////////CREATION ET MODIFICATION QUESTION
addQuestionService(question:string,secret:string,points:string,length:number):QuestionTmp {
  return {
    label_qst:"Q"+(length+1),
    description_qst: question,
    secret_qst:secret,
    points_qst:+points
    }
}

editQuestionService(question:string,questionOriginal:QuestionTmp):QuestionTmp {
  return {
    ...questionOriginal,
    description_qst: question
    }
}

editQuestionPointsService(points:string,questionOriginal:QuestionTmp):QuestionTmp {
  return {
    ...questionOriginal,
    points_qst: +points
    }
}

editQuestionSecretService(secret:string,questionOriginal:QuestionTmp):QuestionTmp {
  return {
    ...questionOriginal,
    secret_qst: secret
    }
}

///////////////////CREATION ET MODIFICATION INDICE
addIndiceService(indice:string, points:string,length:number):IndiceTmp {
  return {
    label_ind:"I"+(length+1),
    description_ind: indice,
    points_ind: +points
    }
}

editIndiceService(indice:string,indiceOriginal:IndiceTmp):IndiceTmp {
  return {
    ...indiceOriginal,
    description_ind: indice
    }
}

editIndicePointsService(points:string,indiceOriginal:IndiceTmp):IndiceTmp {
  return {
    ...indiceOriginal,
    points_ind: +points
    }
}

///////////////////CREATION ET MODIFICATION MOTCLEF

decoupeMotClef(motClefSaisie:string){
  return escape_quote(motClefSaisie.trim().toLowerCase()).split(" ").filter(
    function(elem, index, self) {
    return index === self.indexOf(elem);
  }).map( x =>
      this.createMotClefTmp(x)
    ).filter(word => word.mot_mc !== "");
}

createMotClefTmp(s:string):MotClefTmp {
  return {mot_mc:s}
}

}
