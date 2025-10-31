package com.travelAgency.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class ApplicationExceptionHandler {

  @ExceptionHandler({EntityNotFoundException.class, UserNotFoundException.class })
  public ResponseEntity<Object> handleEntityNotFoundException(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body(new ErrorResponse(List.of(ex.getMessage())));
  }
}
