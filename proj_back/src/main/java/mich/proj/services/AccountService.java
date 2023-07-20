package mich.proj.services;

<<<<<<< HEAD
import java.util.List;
=======
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import jakarta.mail.MessagingException;
import mich.proj.models.Item;
=======
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
import mich.proj.models.User;
import mich.proj.repositories.AccountRepository;

@Service
public class AccountService {
    
    @Autowired
    AccountRepository accRepo;

<<<<<<< HEAD
    @Autowired
    EmailService emailSvc;

    public String createAccount(User user) {
        System.out.println(">>>>>> calling repo");
        accRepo.createAccount(user);
        try {
            emailSvc.sendSignupConfirmationEmail(user.getEmail());
            return "Signup successful! Please check your email for confirmation.";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Signup successful, but failed to send confirmation email. Please contact support.";
        }
=======
    public String createAccount(User user) {
        System.out.println(">>>>>> calling repo");
        accRepo.createAccount(user);
        return null;
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6
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
    
<<<<<<< HEAD
    public String addOrder(User user, double total) {
        accRepo.addOrder(user, total);
        return null;
    }

    public List<Item> getAllItems(String email) {
        return accRepo.getAllItems(email);
    }
=======
>>>>>>> 7fb4e526231fc4d6c822a05014a5ab46d9a8f3f6


}
