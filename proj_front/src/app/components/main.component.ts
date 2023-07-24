import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CartService } from '../cart.service';
import { Album } from '../models';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  
  
  playlistId = '37i9dQZF1DZ06evO1X6Ic8';
  embedUrl!: SafeResourceUrl;

  artistName: string = 'The 1975'; // Replace with the artist name you want to fetch
  albums: Album[] = [];
  
  constructor(private sanitizer: DomSanitizer, private cartService: CartService, private accSvc: AccountService) {}

  ngOnInit(): void {

    // const image = document.getElementById('image') as HTMLImageElement;

    // image.addEventListener('mouseover', () => {
    //   image.src = 'https://i.pinimg.com/originals/af/0f/7b/af0f7beadeb72db41f59446dbb6bfe96.jpg';
    // });

    // image.addEventListener('mouseout', () => {
    //   image.src = 'https://muzikspeaks.files.wordpress.com/2015/06/the-1975-banner.jpeg';
    // });

    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1X6Ic8?utm_source=generator`
    );
    this.getAlbums();
  }

  getAlbums() {
    this.cartService.getAlbumsByArtist(this.artistName).subscribe(
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
