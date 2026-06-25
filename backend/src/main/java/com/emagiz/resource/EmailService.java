package com.emagiz.resource;

import com.emagiz.config.MailConfig;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class EmailService {
    public void sendPasswordResetLink(String email, String token){
        String resetUrl = MailConfig.getFrontendResetUrl() + "?token=" + token;

        Properties properties = new Properties();
        properties.put("mail.smtp.host", MailConfig.getHost());
        properties.put("mail.smtp.port", String.valueOf(MailConfig.getPort()));
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                        MailConfig.getUsername(),
                        MailConfig.getPassword()
                );
            }
        });

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