import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS} from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() {
   }
   getLeader():Observable<Leader[]> {
     return of(LEADERS).pipe(delay(2000));
     
   }
   getPromotion(id: number): Observable<Leader>{
    return of(LEADERS.filter((leaders) => (leaders.id === id))[0]).pipe(delay(2000));
  }
   getFeaturedLeader(): Observable<Leader> {
     return of(LEADERS.filter((leaders) => (leaders.featured))[0]).pipe(delay(2000));
   }
}
