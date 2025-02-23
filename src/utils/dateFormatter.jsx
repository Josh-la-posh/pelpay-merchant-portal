import React from 'react';

export const dateAndTimeFormatter = (dateString) => {
  const date = new Date(dateString);

  // Format date and time separately
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Combine formatted date and time
  return `${formattedDate} at ${formattedTime}`;
};

export const timeFormatter = (dateString) => {
  const date = new Date(dateString);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Combine formatted date and time
  return `${formattedTime}`;
};


export const dateFormatter = (dateString) => {
  const date = new Date(dateString);

  // Format date and time separately
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Combine formatted date and time
  return `${formattedDate}`;
};