package com.travelAgency.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelAgency.exception.GeminiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

  private final WebClient.Builder webClientBuilder;
  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  @Value("${app.gemini.api-key}")
  private String geminiApiKey;

  @Value("${app.gemini.model}")
  private String model;

  @Value("${app.gemini.base-url}")
  private String baseUrl;

  public String generateTripPlan(String prompt) {
    WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

    Map<String, Object> body = Map.of(
        "contents", List.of(Map.of(
            "parts", List.of(Map.of("text", prompt))
        ))
    );

    return webClient.post()
                    .uri(String.format("/%s:generateContent?key=%s", model, geminiApiKey))
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(
                        HttpStatusCode::isError, response -> response.bodyToMono(String.class)
                                                                     .flatMap(error -> Mono.error(new GeminiException(
                                                                         "Gemini Api Error: " + error)))
                    )
                    .bodyToMono(Map.class)
                    .map(this::extractText)
                    .block();
  }

  private String extractText(Map<String, Object> response) {
    try {
      JsonNode root = OBJECT_MAPPER.valueToTree(response);

      String rawText = root.path("candidates")
                           .path(0)
                           .path("content")
                           .path("parts")
                           .path(0)
                           .path("text")
                           .asText("");

      return rawText
          .replaceAll("^```json\\s*", "")
          .replaceAll("```$", "")
          .trim();

    }
    catch (Exception error) {
      throw new GeminiException("Error extracting Gemini text: " + error);
    }
  }
}
