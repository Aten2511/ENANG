import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../services/http.service';
import {Stof} from '../models/stof'
import {Station} from '../models/station'

@Component({
  selector: 'app-compounds',
  templateUrl: './compounds.component.html',
  styleUrls: ['./compounds.component.css']
})
export class CompoundsComponent implements OnInit {
  public panels:any;  
  public stations:any;

  panelOpenState: boolean = false;
  constructor(private http : HttpService,
    private route: ActivatedRoute) { }
    isExpanded:any;

    ngOnInit() {
      this.http.getStof().subscribe(
        (data: Stof[]) => this.panels=data,
        (err: any) => console.log(err),
        () => console.log('successfully got all compounds!')
      );
    } 
    setStep(index: string) {
      this.isExpanded = index;
      this.http.GetStationsBycompoundId(this.isExpanded).subscribe(
        (data: Station[]) => this.stations=data,
        (err: any) => console.log(err),
        () => console.log('successfully got all stations by compoundId!')
      );    
    }
}