package com.travelAgency.service;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.TripRequest;
import com.travelAgency.db.model.dto.TripResponse;
import com.travelAgency.db.repository.UserRepository;
import com.travelAgency.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

  private final UserRepository userRepository;
  private final GeminiService geminiService;

  @Override
  @Transactional
  public TripResponse createTrip(TripRequest tripRequest) {

    String prompt = buildPrompt(tripRequest);

    String generatedTripPlan = geminiService.generateTripPlan(prompt);

    User user = userRepository
        .findByEmail(tripRequest.userEmail())
        .orElseThrow(() -> new UserNotFoundException(tripRequest.userEmail(), User.class));

    Trip trip = Trip.builder()
                    .tripDetail(generatedTripPlan)
                    .build();

    // User is the owner of the relationship, so we can add the trip to user and save it, then by cascade it will save also the trip to db
    user.addTrip(trip);
    user.setItineraryCreated(user.getItineraryCreated() + 1);
    trip.setImageUrls(List.of(""));

    User createdUser = userRepository.save(user);

    return new TripResponse(
        createdUser.getTrips().getLast().getId()
    );
  }

  private String buildPrompt(TripRequest tripRequest) {

    return String.format(
        """
            Generate a %d-day travel itinerary for %s based on the following user information:
                Budget: '%s'
                Interests: '%s'
                TravelStyle: '%s'
                GroupType: '%s'
                Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
                {
                "name": "A descriptive title for the trip",
                "description": "A brief description of the trip and its highlights not exceeding 100 words",
                "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
                "duration": %d,
                "budget": "%s",
                "travelStyle": "%s",
                "country": "%s",
                "interests": %s,
                "groupType": "%s",
                "bestTimeToVisit": [
                  '🌸 Season (from month to month): reason to visit',
                  '☀️ Season (from month to month): reason to visit',
                  '🍁 Season (from month to month): reason to visit',
                  '❄️ Season (from month to month): reason to visit'
                ],
                "weatherInfo": [
                  '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                  '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                  '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                  '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
                ],
                "location": {
                  "city": "name of the city or region",
                  "coordinates": [latitude, longitude],
                  "openStreetMap": "link to open street map"
                },
                "itinerary": [
                {
                  "day": 1,
                  "location": "City/Region Name",
                  "activities": [
                    {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
                    {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
                    {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
                  ]
                },
                ...
                ]
                }
            """,
        tripRequest.numberOfDays(),
        tripRequest.country(),
        tripRequest.budget(),
        tripRequest.interest(),
        tripRequest.travelStyle(),
        tripRequest.groupType(),
        tripRequest.numberOfDays(),
        tripRequest.budget(),
        tripRequest.travelStyle(),
        tripRequest.country(),
        tripRequest.interest(),
        tripRequest.groupType()
    );
  }
}
