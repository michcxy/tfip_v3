package mich.proj.repositories;
<<<<<<< HEAD
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
=======

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
import mich.proj.models.Item;
=======
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
import mich.proj.models.User;

@Repository
public class AccountRepository {

    @Autowired
    JdbcTemplate template;

<<<<<<< HEAD
    @Autowired
    MongoTemplate mongoTemplate;

    String accountCreation = "INSERT INTO users(fname, lname, email, password, address1, address2, postal, phone, genre, plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    String addOrder = "INSERT INTO orders(order_id, user_email, order_date, total_amount) VALUES (?, ?, ?, ?)";

    String accountRetrieval = "SELECT fname, lname, email, password, address1, address2, postal, phone, genre, plan from users where email = ?";

    String checkEmail = "SELECT COUNT(*) FROM users WHERE email = ?";

    String validateLogin = "SELECT password FROM users WHERE email = ?";

    String editAccount = "UPDATE users SET address1 = ?, address2 = ?, postal = ?, phone = ?, genre = ?,plan = ? WHERE email = ?";
=======
    String accountCreation = "INSERT INTO customers(fname, lname, email, password, address1, address2, postal, phone, genre, plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    String accountRetrieval = "SELECT fname, lname, email, password, address1, address2, postal, phone, genre, plan from customers where email = ?";

    String checkEmail = "SELECT COUNT(*) FROM customers WHERE email = ?";

    String validateLogin = "SELECT password FROM customers WHERE email = ?";

    String editAccount = "UPDATE customers SET address1 = ?, address2 = ?, postal = ?, phone = ?, genre = ?,plan = ? WHERE email = ?";
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6

    public String createAccount(User user){
        template.update(accountCreation, user.getFname(), user.getLname(), user.getEmail(), user.getPassword(), user.getAddress1(), user.getAddress2(), user.getPostal(), user.getPhone(), user.getGenre(), user.getPlan());
        System.out.println(">>>>>> inserting acc");
        return null;
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
        System.out.println(">>>>>" + storedPassword);
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

<<<<<<< HEAD
    public String addOrder(User user, double total){
        String orderId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        Date currentDate = new Date();
        template.update(addOrder, orderId, user.getEmail(), currentDate, total);
        // Document document = new Document();
        // document.append("user_email", user.getEmail());
        // List<String> items = new ArrayList<>();
        // items.add(user.getPlan()); 
        // document.append("items", items);
        // mongoTemplate.insert(document, "orders");
        return orderId;
    }
    
    public List<Item> getAllItems(String email) {
       Query query = new Query(Criteria.where("email").is(email));
        query.fields().exclude("_id");
        Document document = mongoTemplate.findOne(query, Document.class, "orders");
        List<Item> items = document.get("items", List.class);
        System.out.println(items);
        return items;
    }

=======
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
}
