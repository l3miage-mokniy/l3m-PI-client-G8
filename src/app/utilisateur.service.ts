import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, merge} from 'rxjs';
import { multicast, refCount, mergeMap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Chami, ChamiEvolve, Defi, User, Visite, VisiteEvolve } from './AllDefinitions';

@Injectable({
  providedIn: 'root',
})

export class UtilisateurService {
  //TOUT LES CHAMIS
  private allchamisSubj = new BehaviorSubject<ChamiEvolve[]>([]);
  readonly chamisObs = this.allchamisSubj.asObservable();

  //CHAMI CONNECTE
  readonly userObs: Observable<User | undefined>;

  //CHAMI CONNECTE (JUSTE DONNE BDD)
  private chamiSubj = new Subject<Chami>();
  readonly chamiObs = this.chamiSubj.asObservable();

  //CHAMI CONNECTE (JUSTE DONNE BDD)
  private alReadyUseSubj = new BehaviorSubject<boolean>(false);
  readonly alReadyUseSubjObs = this.alReadyUseSubj.asObservable();

  constructor(public auth: AngularFireAuth) {
    // Le chami lié retrouvé à partir du compte Google lors de la connexion
    const initialChami: Observable<Chami | undefined> = this.auth.user.pipe(
      mergeMap(async (U) => (!!U ? this.getChami(U.email ?? '') : undefined))
    );

    // Le chami en tenant compte des éventuelle mises à jour qui seront publiées via chamiSubj
    const updatedChami: Observable<Chami | undefined> = merge(
      this.chamiSubj,
      initialChami
    );

    // Le User au sens définit par vous même
    this.userObs = combineLatest([this.auth.user, updatedChami]).pipe(
      map(([U, C]) => (!U ? undefined : { chami: C, oauthUser: U })), // Fin map
      multicast(() => new BehaviorSubject<User | undefined>(undefined)),
      refCount()
    );
  }

  login(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    this.auth.signInWithPopup(provider);
    this.alReadyUseSubj.next(false);
  }

  logout(): void {
    this.auth.signOut();
  }

  async getAllUsers() {
    const response = await fetch(
      'https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/'
    );
    const data = await response.json();
    const res = await data as ChamiEvolve[];
    const resUp = await Promise.all(res.map(x => this.getAllDefiOfAnUsers(x)))

    this.allchamisSubj.next(resUp);
  }

  async getAllDefiOfAnUsers(user:ChamiEvolve){
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/auteur/'+user.pseudo);
    const data = await response.json();
    user.sesDefis=data as Defi[]
    return user
  }

  async getChami(email: string): Promise<Chami | undefined> {
    const response = await fetch(
      'https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/' + email
    );
    if (response.status === 200) {
      return (await response.json()) as Chami;
    } else {
      return undefined;
    }
  }

  async getChamiWithPseudo(pseudo: string): Promise<Chami | undefined> {
    const response = await fetch(
      'https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/pseudo/' + pseudo
    );
    if (response.status === 200) {
      return (await response.json()) as Chami;
    } else {
      return undefined;
    }
  }

  async postUser(user: Chami): Promise<void> {
    if ((await this.getChamiWithPseudo(user.pseudo)) === undefined) {
      const res = await fetch(
        'https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/' + user.pseudo,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(user),
        }
      );
      this.chamiSubj.next(user);
      this.alReadyUseSubj.next(false);
    } else {
      this.alReadyUseSubj.next(true);
    }
  }

  async putUser(user: Chami, userCo: User): Promise<Response | undefined> {
    if ((await this.getChamiWithPseudo(user.pseudo)) === undefined || user.pseudo === userCo.chami?.pseudo) {
      const res = await fetch(
        'https://l3m-pi-serveur-g8.herokuapp.com/api/chamis/' + user.email,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(user),
        }
      );
      this.chamiSubj.next(user);
      this.alReadyUseSubj.next(false);
      return res;
    } else {
      this.alReadyUseSubj.next(true);
    }
    return undefined;
  }

  resetUsedObs(){
    this.alReadyUseSubj.next(false)
  }


  private visiteSubj = new Subject<VisiteEvolve[]>();
  readonly visiteObs = this.visiteSubj.asObservable();

  async getAllVisiteOfAnUsers(user:Chami){
    const response = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/visite/withPseudo/'+user.pseudo);
    const data = await response.json();
    const tabInit = data as VisiteEvolve[]
    let tabFinal: VisiteEvolve[] = []
    tabFinal = await Promise.all(tabInit.map(async x =>this.recupLeDefi(x)))
    this.visiteSubj.next(tabFinal)
    return data as Visite[];
  }

  async recupLeDefi(visite:VisiteEvolve) {
    let leDefi = await fetch('https://l3m-pi-serveur-g8.herokuapp.com/api/defis/'+visite.id_defi)
    visite.defiAssocie = (await leDefi.json()) as Defi
    return visite
  }


}
