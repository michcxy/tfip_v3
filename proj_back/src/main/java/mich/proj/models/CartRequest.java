package mich.proj.models;

import java.util.List;

public class CartRequest {
      private List<Item> cartItems;
    private String email;

    
    public CartRequest() {
    }
    public CartRequest(List<Item> cartItems, String email) {
        this.cartItems = cartItems;
        this.email = email;
    }
    public List<Item> getCartItems() {
        return cartItems;
    }
    public void setCartItems(List<Item> cartItems) {
        this.cartItems = cartItems;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    
}
