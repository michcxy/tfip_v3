package mich.proj.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine htmlTemplateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSignupConfirmationEmail(String recipientEmail, String fname) throws MessagingException {
        final Context ctx = new Context();
        ctx.setVariable("user", fname);
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
        final String htmlContent = this.htmlTemplateEngine.process("signup_email_template", ctx);
        helper.setText(htmlContent, true /* isHtml */);

        helper.setTo(recipientEmail);
        helper.setSubject("Welcome to Our Website!");

        mailSender.send(message);
    }
}