import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable, map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular'
import { City } from './city';
import { Country } from './../countries/country';

@Injectable({
  providedIn: 'root',
})
export class CityService
  extends BaseService<City> {
  constructor(
    http: HttpClient,
    private apollo: Apollo) {
    super(http);
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<City>> {
    //var url = this.getUrl("api/Cities");
    //var params = new HttpParams()
    //  .set("pageIndex", pageIndex.toString())
    //  .set("pageSize", pageSize.toString())
    //  .set("sortColumn", sortColumn)
    //  .set("sortOrder", sortOrder);

    //if (filterColumn && filterQuery) {
    //  params = params
    //    .set("filterColumn", filterColumn)
    //    .set("filterQuery", filterQuery);
    //}

    //return this.http.get<ApiResult<City>>(url, { params });

    return this.apollo.query({
      query: gpl`
      query GetCitiesApiResult(
        $pageIndex:Int!,
        $pageSize:Int!,
        $sortColumn:String,
        $sortOrder:String,
        $filterColumn:String,
        $filterQuery:String
      ){
        data{
          id
          name
          lat
          lon
          countryId,
          countryName
        },
        pageIndex
        pageSize
        totalCount
        totalPages
        sortColumn
        sortOrder
        filterColumn
        filterQuery
      }`,
      variables: {
        pageIndex,
        pageSize,
        sortColumn,
        sortOrder,
        filterColumn,
        filterQuery
      }
    }).pipe(map((result: any) => result.data.citiesApiResult))
  }

  get(id: number): Observable<City> {
    //var url = this.getUrl("api/Cities/" + id);
    //return this.http.get<City>(url);

    return this.apollo.query({
      query: gql`query GetCityById($id:Int!){
        cities(where :{id:{eq:$id}}){
          nodes{
            id
            name
            lat
            lon
            countryId
          }
        }
      }`,
      variables: {
        id
      }
    })
      .pipe(map((result: any) => result.data.cities.nodes[0]))
  }

  put(item: City): Observable<City> {
    //var url = this.getUrl("api/Cities/" + item.id);
    //return this.http.put<City>(url, item);
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateCity$(cityDTO:$city){
        id
        name
        lat
        lon
        countryId
      }`,
      variables: {
        city: input
      }
    }).pipe(map((result: any) => result.data.updateCity))
  }

  post(item: City): Observable<City> {
    var url = this.getUrl("api/Cities");
    return this.http.post<City>(url, item);
  }

  getCountries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<Country>> {
    var url = this.getUrl("api/Countries");
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult<Country>>(url, { params });
  }

  isDupeCity(item: City): Observable<boolean> {
    var url = this.getUrl("api/Cities/IsDupeCity");
    return this.http.post<boolean>(url, item);
  }
}