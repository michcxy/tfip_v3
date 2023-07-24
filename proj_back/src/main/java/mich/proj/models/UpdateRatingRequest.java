package mich.proj.models;

public class UpdateRatingRequest {
    
    private String email;
    private String itemName;
    private int rating;

    
    public UpdateRatingRequest(String itemName, int rating) {
        this.itemName = itemName;
        this.rating = rating;
    }

    
    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }

    
}
