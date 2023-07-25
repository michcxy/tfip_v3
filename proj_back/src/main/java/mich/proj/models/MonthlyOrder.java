package mich.proj.models;

import java.util.List;

public class MonthlyOrder {
    private String email;
    private List<MonthlyRecord> monthlyRecord;


    // Constructor (optional, you can generate constructors using an IDE or manually if needed)

    // Getters and setters for the properties
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<MonthlyRecord> getMonthlyRecord() {
        return monthlyRecord;
    }

    public void setMonthlyRecord(List<MonthlyRecord> monthlyRecord) {
        this.monthlyRecord = monthlyRecord;
    }

    public static class MonthlyRecord {
        private String date;
        private String name;
        private String artist;
        private String genre;
        private int rating;
        private String imgurl;
        private List<Track> tracklist;

        // Constructor (optional, you can generate constructors using an IDE or manually if needed)

        // Getters and setters for the properties
        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getArtist() {
            return artist;
        }

        public void setArtist(String artist) {
            this.artist = artist;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public int getRating() {
            return rating;
        }

        public void setRating(int rating) {
            this.rating = rating;
        }

        public String getImgurl() {
            return imgurl;
        }

        public void setImgurl(String imgurl) {
            this.imgurl = imgurl;
        }

        public List<Track> getTracklist() {
            return tracklist;
        }

        public void setTracklist(List<Track> tracklist) {
            this.tracklist = tracklist;
        }
    }

    public static class Track {
        private int trackNumber;
        private String title;

        // Constructor (optional, you can generate constructors using an IDE or manually if needed)

        // Getters and setters for the properties
        public int getTrackNumber() {
            return trackNumber;
        }

        public void setTrackNumber(int trackNumber) {
            this.trackNumber = trackNumber;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }
    }

    
    
}
