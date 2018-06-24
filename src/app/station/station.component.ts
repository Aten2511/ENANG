import { Component, OnInit,AfterViewChecked ,Pipe, PipeTransform ,Input ,ElementRef,Sanitizer, AfterViewInit } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import { Subject } from 'rxjs';
import { map, tap, catchError,subscribeOn } from 'rxjs/operators';
import { SafeResourceUrl, SafeUrl,DomSanitizer} from '@angular/platform-browser';
import { Chart } from 'angular-highcharts';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../services/http.service';

import {Station} from '../models/station'
import {Stof} from '../models/stof'
import{DataTablesResponse} from'../models/dataTablesResponse'
import { Data } from '../models/data';
import { ChartData } from '../models/ChartData';

import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource,MatFormField,MatInput, MatSelect,MatDatepicker} from '@angular/material';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})

export class StationComponent  implements OnInit,AfterViewInit  {
  results: ChartData[];
  results2: Data[];

  dateChart:any;
  resultChart:any;
  chart:any;
  length:number;
  dataDate:any;
  
  startDate = new Date(2010, 0, 1);
  selectedStation: Station;
  stofs:any;
   frekvs=[
    {value: 'hour', viewValue: 'Hver time'},
    {value: 'day', viewValue: 'Daglig'},
    {value: 'week', viewValue: 'Ugentlig'},
    {value: 'month', viewValue: 'Hver måned'},
    {value: 'quarter', viewValue: 'Hvert kvartal'},
    {value: 'year', viewValue: 'Årlig'}, ];

  options: FormGroup;
  stofid = new FormControl('', [Validators.required]);
  dato = new FormControl('', [Validators.required]);
  frekv = new FormControl('', [Validators.required]);
  
par1;par2;par3;stationId:any;

constructor(private http : HttpService,private route: ActivatedRoute,private fb: FormBuilder,
  private sanitizer: DomSanitizer ) { 

  this.options = fb.group({
   /*  stofid: this.stofid,
    dato: this.dato,
    frekv:this.frekv */
  });

}
  ngOnInit() {
    this.stationId = this.route.snapshot.params['id'];
   
     this.http.getStationById(this.stationId)
      .subscribe(
        (data: Station) => this.selectedStation = data,
      );

     this.http.GetCompoundsByStation(this.stationId)
      .subscribe(
        (data: Stof[]) => this.stofs = data,
        (err: any) => console.log("no data")
      );      
    this.http.GetDataByStation(this.stationId,2018,'month').subscribe(
      (data: ChartData[]) => {
          this.results=data,
          console.log(this.results);
        });

      }
  
      ngAfterViewInit() {     

      
  }
    getData() {
        
        var arr = [],
            x,y;
        var length=this.results.map(x=>x).length;
        for (let index = length; index > 0; index--) {

          const x1 = this.results.map(x=>x.date)[index];          
          const x2=new Date(x1);
          var mnth = ("0" + (x2.getMonth()+1)).slice(-2);
          var day  = ("0" + x2.getDate()).slice(-2);
          const x=[x2.getFullYear(), mnth, day ].join("-");
          const y=this.results.map(x=>x.result)[index];
            arr.push([
                x,y
            ]); 
        }
        return arr; 
        
      }
      
 async getGraph(){
    var data = this.getData();
    console.log(data);

      this.chart = new Chart( {
    
        chart: {
            zoomType: 'x'
        },
    title:{
      text:this.results.map(x=>x.compound)[0]
    },
          
        subtitle: {
            text: 'Using the Boost module'
        },
    
        tooltip: {
            valueDecimals: 2
        },
    
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%Y'
        },
 /*        labels:
{
  enabled: false
}, */
      
      title: {
          text: 'Dato',
    },
    
        },
    
        series: [{
            data: data,
            name: 'Daglig data'
        }]
    
    });

  }
}