import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
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

  getAllCardsWithoutDuplicates(): Observable<GetCardDetails[]> {
    return this.getAllCards().pipe(
      map(cards => this.removeDuplicateCards(cards))
    );
  }

  removeDuplicateCards(cards: GetCardDetails[]): GetCardDetails[] {
    const uniqueCards: GetCardDetails[] = [];
    const seenCardNumbers = new Set<string>();

    for (const card of cards) {
      // Normalize card number by removing spaces
      const normalizedCardNumber = card.cardDetails.toString().replace(/\s/g, '');

      // If we haven't seen this card number before, add it to the result
      if (!seenCardNumbers.has(normalizedCardNumber)) {
        seenCardNumbers.add(normalizedCardNumber);
        uniqueCards.push(card);
      }
    }

    return uniqueCards;
  }

  addCard(newCard: AddCardDetails): Observable<void> {
    return this.http.post<void>(this.baseUrl, newCard);
  }
}
