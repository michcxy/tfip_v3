package mich.proj.models;

import java.util.Date;
import java.util.List;

public class PastOrders {
    private String email;
    private String orderDate;
    private String orderId;
    private List<Item> pastPurchases;
    
    public PastOrders() {
    }


    public PastOrders(String email, String orderDate, String orderId, List<Item> pastPurchases) {
        this.email = email;
        this.orderDate = orderDate;
        this.orderId = orderId;
        this.pastPurchases = pastPurchases;
    }


    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public List<Item> getPastPurchases() {
        return pastPurchases;
    }
    public void setPastPurchases(List<Item> pastPurchases) {
        this.pastPurchases = pastPurchases;
    }

    @Override
    public String toString() {
        return "PastOrders [email=" + email + ", orderId=" + orderId + ", pastPurchases=" + pastPurchases + "]";
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }


    


}
