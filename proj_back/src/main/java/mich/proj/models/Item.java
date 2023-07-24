package mich.proj.models;

public class Item {

    private String name;

    private String genre;
    private String artist;
    private String description;
    private int rating;
    private String imgUrl;
    private double price;
    

    public Item() {
    }

    public Item(String name, String genre, String artist, String description, int rating, String imgUrl, double price) {
        this.name = name;
        this.genre = genre;
        this.artist = artist;
        this.description = description;
        this.rating = rating;
        this.imgUrl = imgUrl;
        this.price = price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }



    public String getArtist() {
        return artist;
    }



    public void setArtist(String artist) {
        this.artist = artist;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Item [name=" + name + ", genre=" + genre + ", artist=" + artist + ", description=" + description
                + ", rating=" + rating + ", imgUrl=" + imgUrl + ", price=" + price + "]";
    }

    
}
