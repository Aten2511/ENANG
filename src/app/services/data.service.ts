

import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Data} from "../models/data";
import {map} from "rxjs/operators";
import {Stof} from "../models/stof";


@Injectable()
export class DataService {
private url='http://localhost:18681/api/Measurements/10/140/2016/day';
    constructor(private http:HttpClient) {

    }
    
   getData():Observable<Data[]>{
       return this.http.get<Data[]>(this.url).pipe(
        map(res =>  res["payload"])
    );
   }

}