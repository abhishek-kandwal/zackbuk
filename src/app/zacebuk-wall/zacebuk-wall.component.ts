import { Component, OnInit } from '@angular/core';
import { FetchJsonDataService } from '../fetch-json-data.service';


@Component({
  selector: 'app-zacebuk-wall',
  templateUrl: './zacebuk-wall.component.html',
  styleUrls: ['./zacebuk-wall.component.css']
})
export class ZacebukWallComponent implements OnInit {
 postdata;
  constructor(private _postsData: FetchJsonDataService) {
    localStorage.removeItem('users');
   }

  ngOnInit() {
    this._postsData.getPost()
      .subscribe(data => {

        // this.postdata = data;
        console.log(data);
        });
  }
  // to get json data. anyone who changes kindly change the function name.
  // samplefn(){
  // this._postsData.getJsonData()
  //     .subscribe(data=>(console.log(data)))
  // }



}
