import { Component, OnInit,ViewChild ,Pipe, PipeTransform,Sanitizer   } from '@angular/core';
import { map, takeUntil, tap,filter } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../services/http.service';
import {Station} from '../models/station'
import {Stof} from '../models/stof'
import {MatPaginator,MatTab, MatTableDataSource,MatFormField,MatInput, MatSelect,MatSort,MatDatepicker} from '@angular/material';
import { Data } from '../models/data';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,NativeDateAdapter} from '@angular/material/core';
import {PageEvent} from '@angular/material';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { SafeResourceUrl, SafeUrl,DomSanitizer} from '@angular/platform-browser';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-compound',
  templateUrl: './compound.component.html',
  styleUrls: ['./compound.component.css']
})
export class CompoundComponent implements OnInit {

  isExpanded:any;

  startDate = new Date(2018, 0, 1);
  endDate = new Date(2018, 0, 1);

  selectedStof: Stof;
  stations:any;
  results:Data[];
  stofResults:Data[];

  //download as json
  downloadJsonHref :any;
  theJSON:any;
  //download as csv
   optionsCSV = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    useBom: true,
    noDownload: true,
    headers: ["maalested", "stof", "date","result","unit"]
  };
 //table 
  displayedColumns = ['date', 'result', 'unit'];
  dataSource : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  from;to:any;

  //stof selector
   frekvs=[
    {value: 'hour', viewValue: 'Hver time'},
    {value: 'day', viewValue: 'Daglig'},
    {value: 'week', viewValue: 'Ugentlig'},
    {value: 'month', viewValue: 'Hver måned'},
    {value: 'quarter', viewValue: 'Hvert kvartal'},
    {value: 'year', viewValue: 'Årlig'},
  ];
  options: FormGroup;
  datefrom = new FormControl('', [Validators.required]);
  dateto = new FormControl('', [Validators.required]);
  frekv = new FormControl('', [Validators.required]);
  
year;fre;stofId:any;
constructor(private http : HttpService,private route: ActivatedRoute,private fb: FormBuilder,
  private router: Router,private sanitizer: DomSanitizer) { 

    this.options = fb.group({
      datefrom: this.datefrom,
      dateto:this.dateto,
      frekv:this.frekv
    });
}
  ngOnInit() {
    this.stofId = this.route.snapshot.params['id'];
   
     this.http.getStofById(this.stofId)
      .subscribe(
        (data: Stof) => this.selectedStof = data,
      );

      this.http.GetStationsBycompoundId(this.stofId)
      .subscribe(
        (data: Station[]) => this.stations = data,
        (err: any) => console.log("no data")
      ); 
      //let datas = new MatTableDataSource<Data>(this.selectedData);
    
    }
     /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
    ngAfterViewInit() {
  }
    async getdata(){
      
      this.from= this.convert(this.options.value.datefrom);
      this.to= this.convert(this.options.value.dateto);     this.fre=this.options.value.frekv;
     this.http.GetCompoundDataForAllStationsByPeriod(this.stofId,this.from,this.to,this.fre)
     .subscribe(
       (data: Data[]) => this.results = data,
       (err: any) => console.log("no data")
     );    
        
     console.log(this.results);
    }
  
  //convert date format to YYYY-MM-DD
  convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
}
    async tabChanged($event) {
    this.isExpanded = $event.tab.textLabel;
    this.stofResults=this.results.filter(obj=>  obj.stationName===this.isExpanded);
    
    this.dataSource = new MatTableDataSource<Data>(this.stofResults);
    this.dataSource.paginator = this.paginator;

       /* this.http.GetDataByStationBydateBystof(this.stationId,this.isExpanded,this.from,this.to,this.fre)
     .subscribe(
       (data: Data[]) => this.stofResults = data,
       (err: any) => console.log("no data")
     );  */ 

    }
  
    

}
