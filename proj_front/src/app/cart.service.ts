import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Album, User } from './models';

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

    getAlbumsByArtist(artistName: string): Observable<any[]> {
        return this.http.get<any[]>('/api/getAlbums', { params: { artistName: artistName } });  
      }

      saveAlbums(cartItems: Album[], email: String): Observable<any> {
        const data = { cartItems, email };
        console.info("addcartorder data>>>", data);
        return this.http.post<any>('/api/addCartOrder', data);
      }

      isItemInCart(album: Album): boolean {
        return this.cartItems.some(item => item.name === album.name);
      }
}