import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from './models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    http = inject(HttpClient)
    
  private cartItems: Album[] = [];

  // Method to add an item to the cart
  addToCart(album: Album) {
    this.cartItems.push(album);
  }

  setCartItems(items: Album[]): void {
    this.cartItems = items;
  }
  
  // Method to get the cart items
  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(album: Album) {
    const index = this.cartItems.indexOf(album);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
    console.log(index)
  }

//   getAlbumsByArtist(artistName: string): Observable<Album[]> { 
//     return this.http.get<Album[]>(`/getAlbums?artist=${artistName}`);
//   }

    getAlbumsByArtist(artistName: string): Observable<any[]> {
        return this.http.get<any[]>('/api/getAlbums', { params: { artistName: artistName } });  
      }
}