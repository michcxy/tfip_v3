package mich.proj.models;

public class Item {
    private String name;
    private String genre;
    private double rating;
    
    public Item(String name, String genre, double rating) {
        this.name = name;
        this.genre = genre;
        this.rating = rating;
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
    public void setRating(double rating) {
        this.rating = rating;
    }

    
}
