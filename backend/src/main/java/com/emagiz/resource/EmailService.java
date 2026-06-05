package com.emagiz.resource;

import com.emagiz.config.MailConfig;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.ws.rs.Produces;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

public class EmailService {
    public void sendPasswordResetLink(String email, String token){
        String resetUrl = MailConfig.getFrontendResetUrl() + "?token=" + token;
        Properties properties = new Properties();
        properties.put("mail.smtp.host", MailConfig.getHost());
        properties.put("mail.smtp.port", MailConfig.getPort());
        properties.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties);

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(MailConfig.getFrom()));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email, false));
            message.setSubject("Password Reset for your account");

            String text = "You have requested password-reset. Go for the link down below to set a new password.\n" +
                    "Link will work for 30 minutes.\n"
                    + resetUrl;
            message.setText(text);
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send email", e);
        }
    }

}

