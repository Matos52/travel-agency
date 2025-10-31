package com.travelAgency.exception;

public class UserNotFoundException extends RuntimeException
{
  public UserNotFoundException(String value, Class<?> entity)
  {
    super("The " + entity.getSimpleName().toLowerCase() + " with value '" + value + "' does not exist in our database");
  }
}
