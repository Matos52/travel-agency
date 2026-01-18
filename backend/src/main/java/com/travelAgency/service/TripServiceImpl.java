package com.travelAgency.service;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.TripRating;
import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.trip.TripDTO;
import com.travelAgency.db.model.dto.trip.CreateTripRequest;
import com.travelAgency.db.model.dto.trip.TripForListDTO;
import com.travelAgency.db.model.dto.trip.TripResponse;
import com.travelAgency.db.repository.*;
import com.travelAgency.db.repository.projection.TripRatingSummaryForListProjection;
import com.travelAgency.db.repository.projection.TripRatingSummaryProjection;
import com.travelAgency.exception.EntityNotFoundException;
import com.travelAgency.exception.UserNotFoundException;
import com.travelAgency.mapper.TripMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

  private final UserRepository userRepository;
  private final TripRepository tripRepository;
  private final TripRatingRepository tripRatingRepository;
  private final GeminiService geminiService;
  private final UnsplashService unsplashService;
  private final TripMapper tripMapper;

  @Override
  @Transactional
  public TripResponse createTrip(CreateTripRequest createTripRequest, String userEmail) {

    String prompt = buildPrompt(createTripRequest);

    // Call gemini service logic
    String generatedTripPlan = geminiService.generateTripPlan(prompt);

    User user = userRepository
        .findByEmail(userEmail)
        .orElseThrow(() -> new UserNotFoundException(userEmail, User.class));

    Trip trip = Trip.builder()
                    .tripDetail(generatedTripPlan)
                    .build();

    // User is the owner of the relationship, so we can add the trip to user and save it, then by cascade it will save also the trip to db
    user.addTrip(trip);
    user.setItineraryCreated(user.getItineraryCreated() + 1);

    // Call unsplash service logic
    List<String> imageUrls =
        unsplashService.getImages(
            createTripRequest.country(),
            createTripRequest.interest(),
            createTripRequest.travelStyle()
        );
    trip.setImageUrls(imageUrls);

    User createdUser = userRepository.save(user);

    return new TripResponse(
        createdUser.getTrips().getLast().getId()
    );
  }

  @Override
  @Transactional(readOnly = true)
  public Page<TripForListDTO> getTrips(int pageIndex, int pageSize) {
    PageRequest pageRequest = PageRequest.of(pageIndex, pageSize, Sort.by("createdAt").descending());
    Page<Trip> trips = tripRepository.findAll(pageRequest);

    List<Long> tripIds = trips.stream().map(Trip::getId).toList();
    List<TripRatingSummaryForListProjection> summaries = tripRatingRepository.getSummariesForTripsByIds(tripIds);
    Map<Long, TripRatingSummaryForListProjection> summaryMap =
        summaries.stream().collect(Collectors.toMap(TripRatingSummaryForListProjection::getTripId, s -> s));

    return trips.map(trip -> tripMapper.toTripForListDTO(trip, summaryMap.get(trip.getId())));
  }

  @Override
  @Transactional(readOnly = true)
  public TripDTO getTrip(Long id, String userEmail) {
    Trip trip = tripRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id, Trip.class));

    TripRatingSummaryProjection summary = tripRatingRepository.getSummary(id, userEmail);

    return tripMapper.toTripDTO(trip, summary);
  }

  @Override
  @Transactional
  public TripDTO rateTrip(Long id, int rating, String userEmail) {
    Trip trip = tripRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id, Trip.class));

    User user = userRepository
        .findByEmail(userEmail)
        .orElseThrow(() -> new UserNotFoundException(userEmail, User.class));

    // Check if the user already rated a trip, if yes just change rating
    TripRating tripRating = tripRatingRepository.findByTripIdAndUserEmail(id, userEmail).orElseGet(
        () -> {
          TripRating tr = TripRating.builder().build();
          tr.setTripAndUser(trip, user);
          return tr;
        }
    );

    tripRating.setRating(rating);

    TripRatingSummaryProjection summary = tripRatingRepository.getSummary(id, userEmail);

    return tripMapper.toTripDTO(trip, summary);
  }

  private String buildPrompt(CreateTripRequest createTripRequest) {

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
        createTripRequest.numberOfDays(),
        createTripRequest.country(),
        createTripRequest.budget(),
        createTripRequest.interest(),
        createTripRequest.travelStyle(),
        createTripRequest.groupType(),
        createTripRequest.numberOfDays(),
        createTripRequest.budget(),
        createTripRequest.travelStyle(),
        createTripRequest.country(),
        createTripRequest.interest(),
        createTripRequest.groupType()
    );
  }
}
