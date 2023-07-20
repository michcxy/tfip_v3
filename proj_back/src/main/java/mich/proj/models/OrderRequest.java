package mich.proj.models;

public class OrderRequest {

    private User user;
    private double total;
    private String plan;

    public OrderRequest(User user, double total, String plan) {
        this.user = user;
        this.total = total;
        this.plan = plan;
    }

    
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }


    public String getPlan() {
        return plan;
    }



    public void setPlan(String plan) {
        this.plan = plan;
    }
   
}
