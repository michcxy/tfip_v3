package mich.proj.repositories;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.mongodb.client.result.UpdateResult;

import mich.proj.models.Item;
import mich.proj.models.PastOrders;
import mich.proj.models.User;

@Repository
public class AccountRepository {

    @Autowired
    JdbcTemplate template;

    @Autowired
    MongoTemplate mongoTemplate;

    String accountCreation = "INSERT INTO users(fname, lname, email, password, address1, address2, postal, phone, genre, plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    String addOrder = "INSERT INTO orders(order_id, user_email, order_date, total_amount) VALUES (?, ?, ?, ?)";

    String accountRetrieval = "SELECT fname, lname, email, password, address1, address2, postal, phone, genre, plan from users where email = ?";

    String checkEmail = "SELECT COUNT(*) FROM users WHERE email = ?";

    String validateLogin = "SELECT password FROM users WHERE email = ?";

    String editAccount = "UPDATE users SET address1 = ?, address2 = ?, postal = ?, phone = ?, genre = ?,plan = ? WHERE email = ?";

    String getAlbumsByArtist = "SELECT * FROM products WHERE artist = ?";

    public String createAccount(User user){
        template.update(accountCreation, user.getFname(), user.getLname(), user.getEmail(), user.getPassword(), user.getAddress1(), user.getAddress2(), user.getPostal(), user.getPhone(), user.getGenre(), user.getPlan());
        System.out.println(">>>>>> inserting acc");
        return ">>>>>> Account created";
    }

    public Optional<User> retrieveAccount(String email){
        SqlRowSet rs = template.queryForRowSet(accountRetrieval, email);
        User user = new User();
		while (rs.next()) {
            user.setFname(rs.getString("fname"));
			user.setLname(rs.getString("lname"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setAddress1(rs.getString("address1"));
            user.setAddress2(rs.getString("address2"));
            user.setPostal(rs.getInt("postal"));
            user.setPhone(rs.getInt("phone"));
            user.setGenre(rs.getString("genre"));
            user.setPlan(rs.getString("plan"));   
        }
        return Optional.ofNullable(user);   
    }
    
    public boolean isEmailUnique(String email) {
        Integer count = template.queryForObject(checkEmail, Integer.class, email);
        return count != null && count == 0;
    }

    public String validateLogin(String email, String password) {        
       try {
        String storedPassword = template.queryForObject(validateLogin, String.class, email);
        if (storedPassword == null) {
            return "EMAIL_NOT_FOUND";
        }
        
        if (storedPassword.equals(password)) {
            return "SUCCESS";
        } else {
            return "INVALID_PASSWORD";
        }
        } catch (EmptyResultDataAccessException e) {
            return "EMAIL_NOT_FOUND";
        }
    }

    public Optional<User> editAccount(User user){
        template.update(editAccount, user.getAddress1(), user.getAddress2(), user.getPostal(), user.getPhone(), user.getGenre(), user.getPlan(), user.getEmail());
       return retrieveAccount(user.getEmail());
    }

    public String addOrder(User user, double total, String plan){
        String orderId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        Date currentDate = new Date();
        template.update(addOrder, orderId, user.getEmail(), currentDate, total);
        System.out.println("order adding to mysql>>>>>");
        return orderId;
    }
    
    // public List<Item> getAllItems(String email) {
    //    Query query = new Query(Criteria.where("email").is(email));
    //     query.fields().exclude("_id");
    //     Document document = mongoTemplate.findOne(query, Document.class, "orders");
    //     List<Item> items = document.get("items", List.class);
    //     // System.out.println(items);
    //     return items;
    // }

        public List<PastOrders> getAllItems(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        query.fields().exclude("_id");
        List<Document> documents = mongoTemplate.find(query, Document.class, "cart_orders");
        List<PastOrders> pastOrders = documents.stream().map(this::mapDocumentToPastOrder).collect(Collectors.toList());
        System.out.println("GETALLITEMS IS RETURNING A LIST OF PAST ORDERS >>>> " + pastOrders);
        return pastOrders;
    }

    private PastOrders mapDocumentToPastOrder(Document document) {
        String email = document.getString("email");
        String orderId = document.getString("orderId");
        Date orderDate = document.getDate("orderDate");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = dateFormat.format(orderDate);
        List<Document> pastPurchasesDocuments = document.getList("cartItems", Document.class);

        List<Item> pastPurchases = pastPurchasesDocuments.stream()
            .map(pastPurchaseDocument -> {
                String name = pastPurchaseDocument.getString("name");
                String genre = pastPurchaseDocument.getString("genre");
                String artist = pastPurchaseDocument.getString("artist");
                String description = pastPurchaseDocument.getString("description");
                int rating = pastPurchaseDocument.getInteger("rating");
                String imgUrl = pastPurchaseDocument.getString("imgUrl");
                double price = pastPurchaseDocument.getDouble("price");
                
                return new Item(name, genre, artist, description, rating, imgUrl, price);
            })
            .collect(Collectors.toList());

        return new PastOrders(email, formattedDate, orderId, pastPurchases);
    }

    public String updateRating(String email, String itemName, int rating) {
        System.out.println("ATTEMPTING TO UPDATE RATING" + itemName);
        Query query = new Query(Criteria.where("email").is(email)
        .and("cartItems").elemMatch(Criteria.where("name").is(itemName)));

        Update update = new Update().set("cartItems.$.rating", rating);

        UpdateResult result = mongoTemplate.updateFirst(query, update, "cart_orders");

        if (result.getModifiedCount() > 0) {
            return "Rating updated successfully.";
        } else {
            return "No order found for the given email and item name.";
}
        }

    public List<Item> getAlbumsbyArtist(String artistName) {
        List<Item> albums = template.query(getAlbumsByArtist, new Object[]{artistName}, BeanPropertyRowMapper.newInstance(Item.class));
        System.out.println("RETURNED ALBUMS>>> " + albums);
        return albums;  
    }

    public void addCartOrder(List<Item> cartItems, String email) {
        Document document = new Document();
        Date currentDate = new Date();
        String orderId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        document.append("orderId", orderId);
        document.append("orderDate", currentDate);
        document.append("email", email);
        document.append("cartItems", cartItems);
        //insert
        System.out.println("INSERTING HISTORY" + cartItems);
        mongoTemplate.insert(document, "cart_orders");
    }
}
