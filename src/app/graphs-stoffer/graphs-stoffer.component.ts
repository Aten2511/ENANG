import { Component, OnInit,ViewChild ,Pipe, PipeTransform,Sanitizer ,Inject  } from '@angular/core';
import { map, takeUntil, tap, filter } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../services/http.service';
import {Station} from '../models/station'
import {Stof} from '../models/stof'
import {MatPaginator,MatTab, MatTableDataSource,MatFormField,MatInput,MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSelect,MatSort,MatDatepicker} from '@angular/material';
import { Data } from '../models/data';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,NativeDateAdapter} from '@angular/material/core';
import {PageEvent} from '@angular/material';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { SafeResourceUrl, SafeUrl,DomSanitizer} from '@angular/platform-browser';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { browser } from 'protractor';
import { Chart } from 'angular-highcharts';
import { ChartData } from '../models/ChartData';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-graphs-stoffer',
  templateUrl: './graphs-stoffer.component.html',
  styleUrls: ['./graphs-stoffer.component.css']
})
export class GraphsStofferComponent implements OnInit {

  isExpanded:any;

  startDate = new Date(2018, 0, 1);
  endDate = new Date(2018, 0, 1);

  selectedStation: Station;
  stofs:any;
  stations:any;

  stofResults:ChartData[];
  results: any;
  dateChart:any;
  resultChart:any;
  chart:any;
  length:number;

  //stof selector
   frekvs=[
    {value: 'hour', viewValue: 'Hver time'},
    {value: 'day', viewValue: 'Daglig'},
    {value: 'week', viewValue: 'Ugentlig'},
    {value: 'month', viewValue: 'Hver måned'},
    {value: 'quarter', viewValue: 'Hvert kvartal'},
    {value: 'year', viewValue: 'Årlig'},


  ];
  stofId:string;
  options: FormGroup;
  datefrom = new FormControl('', [Validators.required]);
  stofid = new FormControl('', [Validators.required]);
  stationName=new FormControl('', [Validators.required]);
  frekv = new FormControl('', [Validators.required]);
  
par1;fre;station:any;
from:any;
constructor(private http : HttpService,private route: ActivatedRoute,private fb: FormBuilder,
  private router: Router,private sanitizer: DomSanitizer,public dialog: MatDialog) { 

  this.options = fb.group({
    datefrom: this.datefrom,
    stationName:this.stationName,
    stofid: this.stofid,
    frekv:this.frekv
  });
}
  ngOnInit() {
   
    this.http.getStof().subscribe(
      (data: Stof[]) => this.stofs=data,
      (err: any) => console.log(err),
      () => console.log('successfully got all compounds!')
    );
    this.http.getStations().subscribe(
      (data: Station[]) => this.stations=data,
      (err: any) => console.log(err),
      () => console.log('successfully got all stations!')
    );    

}
   
   
 async getdata(){
      var date1 = new Date(this.options.value.datefrom);    
     this.from= this.options.value.datefrom.getFullYear();
     this.stofId=this.options.value.stofid;
     this.fre=this.options.value.frekv;
     this.station=this.options.value.stationName;
     this.results= await this.http.GetCompoundDataForAllStations(this.stofId,this.from,this.fre).toPromise();
     console.log(this.stofResults,this.stofId,this.fre);

  this.stofResults=this.results.filter(x=>x.stationName===this.station);
  this.getGraph();
  this.stofResults=this.results.filter(x=>x.stationName===this.station);
  this.getGraph();
  }

    
//convert date format to YYYY-MM-DD
     convert(str) {
      var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
      return [ date.getFullYear(), mnth, day ].join("-");
  }
  getData() {
        
    var arr = [],
        x,y,z;
    var length=this.stofResults.map(x=>x).length;
    for (let index = length; index > 0; index--) {

      const x1 = this.stofResults.map(x=>x.date)[index];          
      const x2=new Date(x1);
      var mnth = ("0" + (x2.getMonth()+1)).slice(-2);
      var day  = ("0" + x2.getDate()).slice(-2);
      const x=[x2.getFullYear(), mnth, day ].join("-");
      const y=this.stofResults.map(x=>x.result)[index];
      const z=this.stofResults.map(x=>x.stationName)[index];
        arr.push([
            x,y,z
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
  text: this.stofId
},
      
    subtitle: {
        text:  this.station
    },

    tooltip: {
        valueDecimals: 2,
   
    },

    xAxis: {
      type: 'datetime',
      
 labels:
{
enabled: false
}, 
  
  title: {
      text: 'Dato',
},

    },

    series: [{
        name: 'Resultat',        
        data: data
        }]

});

}



}
