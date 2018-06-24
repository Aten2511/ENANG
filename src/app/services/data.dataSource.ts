import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import {Data} from "../models/data";
import {DataService} from "./data.service";

export class DataDataSource extends  DataSource<Data> {

    constructor(private dataService: DataService) {
          super();
    }

    connect(): Observable<Data[]> {
        console.log("Connecting data source");
        return this.dataService.getData();
    }

    disconnect(): void {
       
    }

}

