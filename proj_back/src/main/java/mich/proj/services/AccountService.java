package mich.proj.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import mich.proj.models.Item;
import mich.proj.models.User;
import mich.proj.repositories.AccountRepository;

@Service
public class AccountService {
    
    @Autowired
    AccountRepository accRepo;

    @Autowired
    EmailService emailSvc;

    public String createAccount(User user) {
        System.out.println(">>>>>> calling repo, user email is " + user.getEmail());
        accRepo.createAccount(user);
        // return null;
        try {
            emailSvc.sendSignupConfirmationEmail(user.getEmail(), user.getFname());
            System.out.println(">>>>SENDING EMAIL>>>");
            return "Signup successful! Please check your email for confirmation.";
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println(">>> MESSAGING EXCEPTION");
            return e.getMessage();
            //return "Signup successful, but failed to send confirmation email. Please contact support.";
        }
    }

       public Optional<User> retrieveAccount(String email) {
        return accRepo.retrieveAccount(email);
       
    }

    public boolean isEmailUnique(String email) {
        return accRepo.isEmailUnique(email);
    }

    public String validateLogin(String email, String password) {
        return accRepo.validateLogin(email, password);
    }

    public Optional<User> editAccount(User user){
        return accRepo.editAccount(user);
    }
    
    public String addOrder(User user, double total) {
        
        return accRepo.addOrder(user, total);
    }

    public List<Item> getAllItems(String email) {
        return accRepo.getAllItems(email);
    }

     public List<Item> getAlbumsByArtist(String artistName) {
        return accRepo.getAlbumsbyArtist(artistName);
    }

    public void updateRating(String email, String itemName, int rating) {
        accRepo.updateRating(email, itemName, rating);
    }


}
