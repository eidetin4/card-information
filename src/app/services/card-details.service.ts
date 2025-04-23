import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AddCardDetails, GetCardDetails} from '../models/card-details-models';

@Injectable({
  providedIn: 'root'
})

export class CardDetailsService {
  private baseUrl: string = 'https://67f908a2094de2fe6ea03315.mockapi.io/case-tina/v2/updatePayMethodDetails';

  private http: HttpClient = inject(HttpClient);

  getAllCards(): Observable<GetCardDetails[]> {
    return this.http.get<GetCardDetails[]>(this.baseUrl);
  }

  // getCard(cardId: number): Observable<GetCardDetails> {
  //   const url: string = `${this.baseUrl}/${cardId}`;
  //
  //   return this.http.get<GetCardDetails>(url);
  // }

  addCard(newCard: AddCardDetails): Observable<void> {
    return this.http.post<void>(this.baseUrl, newCard);
  }
}
