import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Station3Component }   from './station3/station3.component';

import { StationsComponent }   from './stations/stations.component';
import { StationComponent }   from './station/station.component';
import { GraphsStofferComponent } from './graphs-stoffer/graphs-stoffer.component';

import { HomeComponent }   from './home/home.component';
import { CompoundsComponent }   from './compounds/compounds.component';
import { CompoundComponent }   from './compound/compound.component';

const routes: Routes = [
  { path: 'stations', component: StationsComponent },
  { path: 'station', component: StationComponent },
  { path: 'station/:id', component: StationComponent },
  { path: 'station/:id', component: StationComponent },
  { path: 'graphs-stoffer', component: GraphsStofferComponent },
  { path: 'station3/:id', component: Station3Component },

/*   { path: 'log-in', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CoursesComponent },
  { path:'course-details/:Id', component:CourseDetailsComponent },
  { path:'edit-user', component:EditUserComponent },*/
  { path:  'compounds',component:CompoundsComponent},
  { path:  'compound/:id',component:CompoundComponent},

  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }]; 


@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule],  
  providers:[]
  
})
export class AppRoutingModule { }










