import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AddCardInformation, GetCardInformation} from '../models/card-information-models';

@Injectable({
  providedIn: 'root'
})

export class CardInformationService {
  private baseUrl: string = 'https://67f908a2094de2fe6ea03315.mockapi.io/case-tina/v2/updatePayMethodDetails';

  private http: HttpClient = inject(HttpClient);

  getAllCards(): Observable<GetCardInformation[]> {
    return this.http.get<GetCardInformation[]>(this.baseUrl);
  }

  getCard(id: string): Observable<GetCardInformation> {
    const url: string = `${this.baseUrl}/${id}`;

    return this.http.get<GetCardInformation>(url);
  }

  addCard(newCard: AddCardInformation): Observable<void> {
    return this.http.post<void>(this.baseUrl, newCard);
  }
}
