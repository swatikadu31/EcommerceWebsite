import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Meet2ShopFormService {
private countryiesUrl=environment.meet2shopApiUrl+'/countries';
private statesUrl=environment.meet2shopApiUrl+'/states';
  constructor(private httpClient:HttpClient) {
    
  }

  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countryiesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

getStates(theCOuntryCode:string):Observable<State[]>{
  // search URL
  const searchStateUrl=`${this.statesUrl}/search/findByCountryCode?code=${theCOuntryCode}`;
  return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
    map(response => response._embedded.states)
  );
}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //build an array for month dropdown list
    //-start at current monthand loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth)

    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    //build an array for 'years download list
    //start at current year
    const startYear: number = new Date().getFullYear();
    const endyear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endyear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}
interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}