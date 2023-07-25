import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CartService } from '../cart.service';
import { Album } from '../models';
import { AccountService } from '../account.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  
  playlistId = '37i9dQZF1DZ06evO1X6Ic8';
  embedUrl!: SafeResourceUrl;

  artistNameDefault: string = 'The 1975'; // Replace with the artist name you want to fetch
  albums: Album[] = [];

  artistName: string = '';
  
  constructor(private sanitizer: DomSanitizer, private cartService: CartService, private accSvc: AccountService) {}

  ngOnInit(): void {

    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1X6Ic8?utm_source=generator`
    );
    this.getAlbums();
  }

  getAlbums() {
    this.cartService.getAlbumsByArtist(this.artistNameDefault).subscribe(
      (data) => {
        this.albums = data;
        console.info("albums>>" , this.albums);
      },
      (error) => {
        console.log('Error fetching albums:', error);
      }
    );
  }

  onAddToCart(album: Album) {
    this.cartService.addToCart(album);
  }

}
