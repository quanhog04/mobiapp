package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.thuong.backend.config.OpenAiProperties;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {
    private final OpenAiProperties openAiProperties;

    @Autowired
    public OpenAiService(OpenAiProperties openAiProperties) {
        this.openAiProperties = openAiProperties;
    }

    public String getApiUrl() {
        return openAiProperties.getUrl();
    }

    public String getApiKey() {
        return openAiProperties.getKey();
    }

    @Value("${openai.api.url}")
    private String openAiApiUrl;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askOpenAi(String prompt) {
        try {
            // Tạo header với API key
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(openAiApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
    
            // Payload gửi đến OpenAI API
            Map<String, Object> payload = Map.of(
                    "model", "gpt-3.5-turbo",
                    "messages", List.of(
                            Map.of("role", "system", "content", "Bạn là một trợ lý bán hàng online, hỗ trợ khách giải đáp câu hỏi."),
                            Map.of("role", "user", "content", prompt)
                    )
            );
    
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
    
            // Gửi request đến OpenAI API
            ResponseEntity<Map> response = restTemplate.postForEntity(openAiApiUrl, request, Map.class);
    
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> choices = (Map<String, Object>) ((List<?>) response.getBody().get("choices")).get(0);
                return (String) ((Map<?, ?>) choices.get("message")).get("content");
            }
    
            return "Không thể kết nối OpenAI API.";
        } catch (HttpClientErrorException.TooManyRequests e) {
            return "Quota API của bạn đã hết. Vui lòng kiểm tra gói dịch vụ.";
        } catch (Exception e) {
            return "Đã xảy ra lỗi khi kết nối OpenAI API.";
        }
    }
}