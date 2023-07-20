package mich.proj.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSignupConfirmationEmail(String recipientEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");

        String emailContent = "Dear [User],\n\n"
                + "Thank you for signing up to our website. We are excited to have you on board!\n\n"
                + "Best regards,\nYour Team";

        helper.setTo(recipientEmail);
        helper.setSubject("Welcome to Our Website!");
        helper.setText(emailContent, true);

        mailSender.send(message);
    }
}