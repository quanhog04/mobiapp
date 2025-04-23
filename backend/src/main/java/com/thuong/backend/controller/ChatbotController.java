package com.thuong.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thuong.backend.service.OpenAiService;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String aiResponse = openAiService.askOpenAi(userMessage);

        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}