package mich.proj.models;

public class User {
 
    private String fname;
	private String lname;
    private String email;
	private String password;
	private String address1;
	private String address2;
	private Integer postal;
	private Integer phone;
	private String genre;
    private String plan;

    public String getFname() {
        return fname;
    }
    public void setFname(String fname) {
        this.fname = fname;
    }
    public String getLname() {
        return lname;
    }
    public void setLname(String lname) {
        this.lname = lname;
    }
        public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getAddress1() {
        return address1;
    }
    public void setAddress1(String address1) {
        this.address1 = address1;
    }
    public String getAddress2() {
        return address2;
    }
    public void setAddress2(String address2) {
        this.address2 = address2;
    }
    public Integer getPostal() {
        return postal;
    }
    public void setPostal(Integer postal) {
        this.postal = postal;
    }
    public Integer getPhone() {
        return phone;
    }
    public void setPhone(Integer phone) {
        this.phone = phone;
    }
    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    
    public String getPlan() {
        return plan;
    }
    public void setPlan(String plan) {
        this.plan = plan;
    }
    @Override
    public String toString() {
        return "User [fname=" + fname + ", lname=" + lname + ", email=" + email + ", password=" + password
                + ", address1=" + address1 + ", address2=" + address2 + ", postal=" + postal + ", phone=" + phone
                + ", genre=" + genre + ", plan=" + plan + "]";
    }

    

}
