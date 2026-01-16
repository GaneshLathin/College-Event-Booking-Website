package com.example.event_booking.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final String razorpayKeyId;
    private final String razorpaySecret;
    private final RazorpayClient razorpayClient;

    // ✅ Constructor injection ensures keys load from application.properties
    public PaymentService(
            @Value("${razorpay.key_id}") String razorpayKeyId,
            @Value("${razorpay.key_secret}") String razorpaySecret) throws Exception {
        this.razorpayKeyId = razorpayKeyId;
        this.razorpaySecret = razorpaySecret;
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecret);
    }

    // ✅ Create Razorpay order
    public Order createOrder(int amount, String receiptId) throws Exception {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);
        orderRequest.put("payment_capture", 1); // auto capture enabled

        return razorpayClient.orders.create(orderRequest);
    }

    // ✅ Expose secret for signature verification
    public String getSecret() {
        return razorpaySecret;
    }
}
