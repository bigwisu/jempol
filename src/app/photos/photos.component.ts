import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PHOTOS } from '../mock-photos';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  photos = PHOTOS

  constructor() { }

  ngOnInit(): void {
  }

}
