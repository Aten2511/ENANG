import { Injectable } from '@angular/core';
import{HttpClient,HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable,pipe,Subject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Station} from '../models/station'
import {Stof} from '../models/stof'
import {Data} from '../models/data'
import{ChartData} from '../models/ChartData'
import { DataSource } from '@angular/cdk/table';

interface IData {results : Data[];}

@Injectable({
  providedIn: 'root'
})
export class HttpService { 

  url='http://aqapiv2.azurewebsites.net/api';
  //
stations=[];
station:Station;

  constructor(private _http: HttpClient,private router: Router) { 
  }
 


  //GET stations/station
   getStations():Observable<Station[] | Error> {
    return this._http.get<Station[]>(this.url+'/Stations')
    .pipe(
      catchError(err => this.handleHttpError(err))
    );      
  }

  getStationById(id:string):Observable<Station | Error>{
    return this._http.get<Station>(this.url+'/Stations/'+id).pipe(
      catchError(err => this.handleHttpError(err))
    ); ;
  }

  //Get Stofs/stof
  getStof():Observable<Stof[] | Error> {
    return this._http.get<Stof[]>(this.url+'/Compounds')
    .pipe(
      catchError(err => this.handleHttpError(err))
    );      
  }

  getStofById(id:string){
    return this._http.get(this.url+'/Compounds/'+id);
    // .map(result => this.station = result.json());
  }

  //get all stations for one compound
  GetStationsBycompoundId(id:string){
    return this._http.get(this.url+'/Compounds/'+id+"/Stations");

  }
  //get all compounds for one station
  GetCompoundsByStation(id:string):Observable<Stof[]>{
    return this._http.get<Stof[]>(this.url+'/Stations/'+id+"/Compounds");
  }
//not used  
  GetDataByStationStof(stationid:string,stofid:number,year:number,frekv:string):Observable<Data[]>{
    return this._http.get<Data[]>(this.url+'/Measurements/station/'+stationid+'/'+stofid+'/'+year+'/'+frekv);
    } 
  //get data for one station all stofs
  GetDataByStation(stationid:string,year:number,frekv:string):Observable<ChartData[]>{
    return this._http.get<ChartData[]>(this.url+'/Measurements/station/'+stationid+'/'+year+'/'+frekv);}



  
  GetDataByStationBydate(stationid:string,from:Data,to:Date,frekv:string){
    return this._http.get(this.url+'/Measurements/station/'+stationid+'/from/'+from+'/to/'+to+'/'+frekv);
    // .map(result => this.station = result.json());
  }
  GetDataByStationBydateBystof(stationid:string,stof:string,from:Data,to:Date,frekv:string){
    return this._http.get(this.url+'/Measurements/'+stationid+'/'+stof+'/'+from+'/'+to+'/'+frekv);
  }
  //get data for one compund for all stations
  GetCompoundDataForAllStations(stofId:string,year:number,frekv:string){
    return this._http.get(this.url+'/Measurements/compound/'+stofId+'/'+year+'/'+frekv);
  }
  GetCompoundDataForAllStationsByPeriod(stofId:string,from:Data,to:Date,frekv:string){
    return this._http.get(this.url+'/Measurements/compound/'+stofId+'/from/'+from+'/to/'+to+'/'+frekv);
  }
 //
  public async downloadResource(stationid:string,stofid:number,year:number,frekv:string): Promise<Blob> {
    const file =  await  this._http.get<Blob>(this.url+'/Measurements/'+stationid+'/'+stofid+'/'+year+'/'+frekv,
    {responseType: 'blob' as 'json'} ).toPromise();
  return file;
  }
  
 


  private handleHttpError(error: HttpErrorResponse): Observable<Error> {
    let dataError = new Error();
    dataError.errorNumber = error.status;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'Der opstår en fejl!.';
    return Observable.create(dataError);
  }

  
 
}
export class Error {
  errorNumber: number;
  message: string;
  friendlyMessage: string;
}