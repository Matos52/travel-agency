package com.travelAgency.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.travelAgency.exception.UnsplashException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnsplashService {

  private final WebClient.Builder webClientBuilder;

  @Value("${app.unsplash.access-key}")
  private String unsplashKey;

  @Value("${app.unsplash.base-url}")
  private String baseUrl;

  public List<String> getImages(String country, String interest, String travelStyle) {
    WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

    String query = String.format("%s %s %s", country, interest, travelStyle);

    JsonNode response = webClient.get()
                                 .uri(uriBuilder -> uriBuilder
                                     .path("/search/photos")
                                     .queryParam("query", query)
                                     .queryParam("client_id", unsplashKey)
                                     .queryParam("per_page", 3)
                                     .build())
                                 .retrieve()
                                 .onStatus(
                                     HttpStatusCode::isError, res -> res.bodyToMono(String.class)
                                                                        .flatMap(error -> Mono.error(new UnsplashException(
                                                                            "Unsplash Api Error: " + error)))
                                 )
                                 .bodyToMono(JsonNode.class)
                                 .block();

    if (response == null || !response.has("results")) {
      return List.of();
    }

    return response.get("results")
                   .findValues("urls").stream()
                   .map(urlNode -> urlNode.get("regular").asText())
                   .toList();
  }
}
