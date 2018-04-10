/* global $ */

'use strict';

const API_KEY = 'AIzaSyA68gYnpN0ykW1n-V5ZmRZ0CyUR4EJA2zM';
/*
  We want our store to hold a `videos` array of "decorated" objects - i.e. objects that
  have been transformed into just the necessary data to display on our page, compared to the large
  dataset Youtube will deliver to us.  Example object:
  
  {
    id: '98ds8fbsdy67',
    title: 'Cats dancing the Macarena',
    thumbnail: 'https://img.youtube.com/some/thumbnail.jpg'
  }

*/
const store = {
  videos: []
};

// TASK: Add the Youtube Search API Base URL here:
// Documentation is here: https://developers.google.com/youtube/v3/docs/search/list#usage
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

// TASK:
// 1. Create a `fetchVideos` function that receives a `searchTerm` and `callback`
// 2. Use `searchTerm` to construct the right query object based on the Youtube API docs
// 3. Make a getJSON call using the query object and sending the provided callback in as the last argument
// TEST IT! Execute this function and console log the results inside the callback.
const fetchVideos = function(searchTerm, callback) {
  const query = {
    q: searchTerm,
    part: 'snippet',
    key: API_KEY,
  };
  $.getJSON(BASE_URL, query, callback);  
};

// TASK:
// 1. Create a `decorateResponse` function that receives the Youtube API response
// 2. Map through the response object's `items` array
// 3. Return an array of objects, where each object contains the keys `id`, `title`, 
// `thumbnail` which each hold the appropriate values from the API item object. You 
// WILL have to dig into several nested properties!
// TEST IT! Grab an example API response and send it into the function - make sure
// you get back the object you want.
const decorateResponse = function(response) {
  const videoArr = response.items.map(item => {
    let video = {};
    video.id = item.id.videoId;
    video.title = item.snippet.title;
    video.thumbnail = item.snippet.thumbnails.default.url;
    return video;
  });
  addVideosToStore(videoArr);
  render();
};

// TASK:
// 1. Create a `generateVideoItemHtml` function that receives the decorated object
// 2. Using the object, return an HTML string containing all the expected data
// TEST IT!
const generateVideoItemHtml = function(video) {
  return `
  <li data-id=${video.id}>
   <h2>${video.title}</h2>
   <img src="${video.thumbnail}" alt="${video.title}">
  </li>
  `;
};

// TASK:
// 1. Create a `addVideosToStore` function that receives an array of decorated video 
// objects and sets the array as the value held in store.items
// TEST IT!
const addVideosToStore = function(videos) { 
  store.videos = [];
  videos.map(item => {
    store.videos.push(item);
  });
};

// TASK:
// 1. Create a `render` function
// 2. Map through `store.videos`, sending each `video` through your `generateVideoItemHtml`
// 3. Add your array of DOM elements to the appropriate DOM element
// TEST IT!
const render = function() {
  const html = store.videos.map(video => generateVideoItemHtml(video));
  const htmlTemplate = html.join('');
  $('.results').html(htmlTemplate);
};

// TASK:
// 1. Create a `handleFormSubmit` function that adds an event listener to the form
// 2. The listener should:
//   a) Prevent default event
//   b) Retrieve the search input from the DOM
//   c) Clear the search input field
//   d) Invoke the `fetchVideos` function, sending in the search value
//   e) Inside the callback, send the API response through the `decorateResponse` function
//   f) Inside the callback, add the decorated response into your store using the `addVideosToStore` function
//   g) Inside the callback, run the `render` function 
// TEST IT!
const handleFormSubmit = function() {
  $('form').submit(function(event) {
    event.preventDefault();
    const searchTerm = $('#search-term').val();
    $('#search-term').val('');
    fetchVideos(searchTerm, decorateResponse);    
  });
  // const handleFormSubmit = function() {
  //   $('form').on('submit', function(event) {
  //     event.preventDefault();
  //     const searchTerm = $('#search-term').val();
  //     $('#search-term').val('');
  //     fetchVideos(searchTerm, decorateResponse);
  //     render();
  //   });  
  // };  
};

// When DOM is ready:
$(function () {
  handleFormSubmit();
});
