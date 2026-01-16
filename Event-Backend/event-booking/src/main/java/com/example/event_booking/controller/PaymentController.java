package com.example.event_booking.controller;

import com.example.event_booking.dto.AmountRequest;
import com.example.event_booking.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ✅ Create Order API
    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody AmountRequest request ) {
        int amount = request.getAmount();
        System.out.println("🔵 Received create-order request, amount: " + amount);

        Map<String, Object> response = new HashMap<>();
        try {
            Order order = paymentService.createOrder(amount, "rcpt_" + System.currentTimeMillis());
            System.out.println("🟢 Razorpay Order Created: " + order.toString());

            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("status", "CREATED");
        } catch (Exception e) {
            System.out.println("🔴 Order creation failed: " + e.getMessage());
            response.put("error", e.getMessage());
        }
        return response;
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> data) {
        System.out.println("🟡 Payment verification request: " + data);

        Map<String, Object> response = new HashMap<>();
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", data.get("razorpay_order_id"));
            options.put("razorpay_payment_id", data.get("razorpay_payment_id"));
            options.put("razorpay_signature", data.get("razorpay_signature"));

            Utils.verifyPaymentSignature(options, paymentService.getSecret());

            System.out.println("✅ Payment verified successfully for order: " + data.get("razorpay_order_id"));
            response.put("status", "SUCCESS");
        } catch (Exception e) {
            System.out.println("❌ Payment verification failed: " + e.getMessage());
            response.put("status", "FAILED");
            response.put("error", e.getMessage());
        }
        return response;
    }

}
