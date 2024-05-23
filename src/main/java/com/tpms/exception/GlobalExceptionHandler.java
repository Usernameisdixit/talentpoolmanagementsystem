package com.tpms.exception;

import java.sql.SQLException;
import java.util.Date;

import javax.security.auth.login.LoginException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorMessage> resourceNotFoundExceptionHandler(ResourceNotFoundException ex, WebRequest request) {
    ErrorMessage message = new ErrorMessage(
        HttpStatus.NOT_FOUND.value(),
        new Date(),
        ex.getMessage(),
        request.getDescription(false));

    return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorMessage> illegalArgumentExceptionHandler(IllegalArgumentException ex, WebRequest request) {
    ErrorMessage message = new ErrorMessage(
        HttpStatus.BAD_REQUEST.value(),
        new Date(),
        ex.getMessage(),
        request.getDescription(false));

    return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
  }
  
  @ExceptionHandler(HttpMediaTypeException.class)
  public ResponseEntity<ErrorMessage> mediaTypeExceptionHandler(HttpMediaTypeException ex, WebRequest request) {
    ErrorMessage message = new ErrorMessage(
        HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
        new Date(),
        ex.getMessage(),
        request.getDescription(false));

    return new ResponseEntity<>(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
  
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorMessage> serverExceptionHandler(Exception ex, WebRequest request) {
    ErrorMessage message = new ErrorMessage(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        new Date(),
        ex.getMessage(),
        request.getDescription(false));

    return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
