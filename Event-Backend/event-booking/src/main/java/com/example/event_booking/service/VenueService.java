package com.example.event_booking.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.List;

@Service
public class VenueService {

    private final JavaMailSender mailSender;

    @Value("${app.email.sender.address}")
    private String senderEmailAddress;

    @Value("${app.email.sender.name}")
    private String senderName;

    public VenueService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBulkEmail(List<String> recipients, String subject, String messageBody)
            throws MessagingException, UnsupportedEncodingException {

        for (String toEmail : recipients) {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmailAddress, senderName);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String htmlContent =
                    "<html><body>" +
                            "<p>Hello,</p>" +
                            "<p>" + messageBody + "</p>" +
                            "<br/>"+"<a href='https://maps.app.goo.gl/nkdCYpyUsCQmfrWP9?g_st=aw'>View Location</a>"+
                            "<p>Thanks,<br/>Eventor Team</p>" +
                            "</body></html>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
        }
    }
}
