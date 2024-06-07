"use strict";
   
/*
      Image List
      1."Sports.jpg"
      2."StudyGroup.jpg"
      3."Membership.jpg"
      4."Volunteer.jpg"


      Filename:lightbox.js
      Author: Code from lecture. Modified and rused by Abdiqani Hirsi
*/


let lightboxTitle = "Choose the activity you want to participate in";

// Names of the image files shown in the slideshow
let imgFiles = ["/bilder/Sports.jpg", "/bilder/StudyGroup.jpg", "/bilder/Membership.jpg", "/bilder/Volunteer.jpg",]

// Captions associated with each image
let imgCaptions = new Array(4);
imgCaptions[0]= "(Sports Events)"
imgCaptions[1]="(Study Groups)"
imgCaptions[2]="(Club Memberships)"
imgCaptions[3]="(Volunteer)"

//imgCaptions[5]="Tennis";


// Count of images in the slideshow
let imgCount = imgFiles.length;
document.addEventListener("DOMContentLoaded", function() {
      const participateButtons = document.querySelectorAll(".participate-btn");
      const confirmationMessage = document.getElementById("confirmation-message");
  
      participateButtons.forEach(button => {
          button.addEventListener("click", function() {
              const eventName = this.parentNode.querySelector("h3").textContent;
              const eventDate = this.parentNode.querySelector(".event-date").textContent;
              
              const eventLocation = this.parentNode.querySelector(".event-location").textContent;
               
              // Construct the confirmation message
              const message = `You have successfully signed up for "${eventName}" on ${eventDate} at ${eventLocation}.`;
  
              // Update the confirmation message element
              confirmationMessage.textContent = message;
              confirmationMessage.style.display = "block";
  
              // Hide the message after a certain duration (e.g., 10 seconds)
              setTimeout(function() {
                  confirmationMessage.style.display = "none";
              }, 10000); // 10000 milliseconds = 10 seconds
          });
      });
  });