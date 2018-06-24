import { Component, OnInit,ViewChild ,Pipe, PipeTransform,Sanitizer ,Inject  } from '@angular/core';
import { map, takeUntil, tap } from 'rxjs/operators';
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


//https://momentjs.com/docs/#/displaying/format/

/* export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}; */

@Component({
  selector: 'app-station3',
  templateUrl: './station3.component.html',
  styleUrls: ['./station3.component.css']

})

export class Station3Component implements OnInit,AfterViewInit {

  isExpanded:any;

  startDate = new Date(2018, 0, 1);
  endDate = new Date(2018, 0, 1);

  selectedStation: Station;
  stofs:any;
  results:any;
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
  displayedColumns = ['date', 'result'];
  dataSource : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
  stofid = new FormControl('', [Validators.required]);
  datefrom = new FormControl('', [Validators.required]);
  dateto = new FormControl('', [Validators.required]);
  frekv = new FormControl('', [Validators.required]);
  
par1;fre;stationId:any;
from;to:any;
constructor(private http : HttpService,private route: ActivatedRoute,private fb: FormBuilder,
  private router: Router,private sanitizer: DomSanitizer,public dialog: MatDialog) { 

  this.options = fb.group({
    //stofid: this.stofid,
    datefrom: this.datefrom,
    dateto:this.dateto,
    frekv:this.frekv
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
      //let datas = new MatTableDataSource<Data>(this.selectedData);
    
    }
     /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
    ngAfterViewInit() {
  }
    async getdata(){
      var date1 = new Date(this.options.value.datefrom);
      var date2 = new Date(this.options.value.dateto);
     var diff=this.checkDate(date1,date2);
     var bool=this.checkyear(date1,date2);
      if(bool && date1<=date2){
      if(diff<367){
     this.from= this.convert(this.options.value.datefrom);
     this.to= this.convert(this.options.value.dateto);
     this.fre=this.options.value.frekv;
     this.results= await this.http.GetDataByStationBydate(this.stationId,this.from,this.to,this.fre)
     .toPromise();        
     
    }
    else{
      const dialogRef = this.dialog.open(DialogOverviewDialog, {
        height: '200px',
        width: '300px',
      });
    
    }
  }
    else{

      const dialogRef = this.dialog.open(DialogOverviewDialog2, {
        height: '200px',
        width: '300px',
      });
    }
    }
//convert date format to YYYY-MM-DD
     convert(str) {
      var date = new Date(str),
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
      return [ date.getFullYear(), mnth, day ].join("-");
  }
  checkDate(str1,str2)
{

var timeDiff = Math.abs(str1.getTime() - str2.getTime());
var diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
return diff;
}   

checkyear(str1,str2){
 
  var today=new Date();
if(str1 > today){
  return false;
}
if(str2>today){
  return false;
}
else{
  return true;
}
}
 tabChanged($event) {
    this.isExpanded = $event.tab.textLabel;
    this.stofResults=  this.results.filter(obj=>  obj.compound===this.isExpanded);
    
    this.dataSource = new MatTableDataSource<Data>(this.stofResults);
    this.dataSource.paginator = this.paginator;
    //create json uri
    var theJSON = JSON.stringify(this.results);
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;


    }
  
    public async downloadCSV(){
      await new Angular5Csv(this.results, 'csv');      
     }
      public async downloadJSON() {
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(this.theJSON));
        this.downloadJsonHref = uri;
        console.log(this.downloadJsonHref);
        
      }
}



  @Component({
    selector: 'dialog-content-dialog',
    templateUrl: 'dialog-content-dialog.html',
  })
  export class DialogOverviewDialog {}

  @Component({
    selector: 'dialog-content-dialog2',
    templateUrl: 'dialog-content-dialog2.html',
  })
  export class DialogOverviewDialog2 {}