"use strict";
   
/*
      Image List
      1."Sports.jpg"
      2."StudyGroup.jpg"
      3."Membership.jpg"
      4."Volunteer.jpg"


      Filename:lightbox.js
      Author: Abdiqani Hirsi
*/


let lightboxTitle = "Choose the activity you want to participate in";

// Names of the image files shown in the slideshow
let imgFiles = ["/bilder/Sports.jpg", "/bilder/StudyGroup.jpg", "/bilder/Membership.jpg", "/bilder/Volunteer.jpg",]

// Captions associated with each image
let imgCaptions = new Array(4);
imgCaptions[0]= "(Sports Events), This allows students to sign up for various sports teams or intramural leagues, such as soccer, basketball, volleyball, or tennis, to engage in physical activities and represent their university in competitions.";
imgCaptions[1]="(Study Groups), This facilitate the formation of study groups where students can collaborate on academic projects, prepare for exams, and share resources related to their courses."; 
imgCaptions[2]="(Club Memberships), This enables students to join different clubs and organizations based on their interests, such as music clubs, debate societies, cultural associations, or coding clubs, to connect with like-minded peers and pursue their passions outside of academics."; 
imgCaptions[3]="(Volunteer), This provides a platform for students to find volunteering opportunities both on and off-campus, including community service projects, environmental initiatives, and charity events."; 

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