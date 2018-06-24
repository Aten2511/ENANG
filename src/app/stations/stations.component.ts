import { Component, OnInit,Pipe } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../services/http.service';
import {Station} from '../models/station'
import {Stof} from '../models/stof'

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {
  public panels:Station[];  
  isExpanded:any;
  public stofs:any;
  constructor(private http : HttpService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.http.getStations().subscribe(
      (data: Station[]) => this.panels=data,
      (err: any) => console.log(err),
      () => console.log('successfully got all stations!')
    );    
    console.log(this.panels);
  }
  setStep(index: string) {
    this.isExpanded = index;
    this.http.GetCompoundsByStation(this.isExpanded).subscribe(
      (data: Stof[]) => this.stofs=data,
      (err: any) => console.log(err),
      () => console.log('successfully got all compounds!')
    );    
  }
}
