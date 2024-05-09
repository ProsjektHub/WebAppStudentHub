"use strict";
/*   

      Application to generate a slide show
      Author: Abdiqani
      Date:   

      Filename: together.js
*/



window.addEventListener("load", createLightbox);

function createLightbox() {
   let lightBox = document.getElementById("lightbox");
   let lbTitle = document.createElement("h1");
   let lbCounter = document.createElement("div");
   let lbPrev = document.createElement("div");
   let lbNext = document.createElement("div");
   let lbPlay = document.createElement("div");
   let lbImages = document.createElement("div");
   
   // Design the lightbox title
   lightBox.appendChild(lbTitle);
   lbTitle.id = "lbTitle";
   lbTitle.textContent = lightboxTitle;

   // Design the lightbox slide counter
   lightBox.appendChild(lbCounter);
   lbCounter.id = "lbCounter"; 
   let currentImg = 1;
   lbCounter.textContent = currentImg + " / " + imgCount;

   // Design the lightbox previous slide button
   lightBox.appendChild(lbPrev);
   lbPrev.id = "lbPrev"; 
   lbPrev.innerHTML = "&#9664;";
   lbPrev.onclick = showPrev;

   // Design the lightbox next slide button
   lightBox.appendChild(lbNext);
   lbNext.id = "lbNext";
   lbNext.innerHTML = "&#9654;";
   lbNext.onclick = showNext;

   

   // Design the lightbox images container
   lightBox.appendChild(lbImages);
   lbImages.id = "lbImages";
   // Add images from the imgFiles array to the container
   for (let i = 0; i < imgCount; i++) {
      let image = document.createElement("img");
      image.src = imgFiles[i];
      image.alt = imgCaptions[i];
      image.addEventListener("mouseenter", function() {
         // Show the image name with green color on hover
         this.title = this.alt; // No need for <span> and inline CSS
         this.style.color = "green"; // Set the text color to green
     });
     image.addEventListener("mouseleave", function() {
         // Remove the styling when mouse leaves
         this.title = "";
         this.style.color = ""; // Remove text color styling
     });
      image.onclick = createOverlay;
      lbImages.appendChild(image);
   }
   
   // Function to move forward through the image list
   function showNext() {
      lbImages.appendChild(lbImages.firstElementChild);
      (currentImg < imgCount) ? currentImg++ : currentImg = 1;
      lbCounter.textContent = currentImg + " / " + imgCount;
   }
   
   // Function to move backward through the image list
   function showPrev() {
      lbImages.insertBefore(lbImages.lastElementChild, lbImages.firstElementChild);
      (currentImg > 1) ? currentImg-- : currentImg = imgCount;
      lbCounter.textContent = currentImg + " / " + imgCount;
   }
   
  // Modified createOverlay function to include participation functionality
  function createOverlay() {
   let overlay = document.createElement("div");
   overlay.id = "lbOverlay";

   let figureBox = document.createElement("figure");
   overlay.appendChild(figureBox);

   let overlayImage = this.cloneNode(true);
   figureBox.appendChild(overlayImage);

   let overlayCaption = document.createElement("figcaption");
   overlayCaption.textContent = this.alt;
   figureBox.appendChild(overlayCaption);

   // New: Add a button inside the overlay for event participation
   let participateBtn = document.createElement("button");
   participateBtn.textContent = "Participate in this Event";
   participateBtn.style.width = "120px";
   participateBtn.style.height = "45px";
   participateBtn.style.color = "white";
   participateBtn.style.fontSize = "15px";
   participateBtn.style.backgroundColor = "green";
   participateBtn.style.transition = "background-color 0.3s";
   participateBtn.style.cursor = "pointer";
   participateBtn.addEventListener("mouseenter", function() {
   participateBtn.style.backgroundColor = "brown";
  });
   participateBtn.addEventListener("mouseleave", function() {
   participateBtn.style.backgroundColor = "green";
});
   participateBtn.onclick = function() {
      // Functionality to mark participation and notify the user
      document.body.removeChild(overlay);
      showParticipationConfirmation(overlayImage.alt); // Pass the image alt as event identifier
   };
   figureBox.appendChild(participateBtn);

   let closeBox = document.createElement("div");
   closeBox.id = "lbOverlayClose";
   closeBox.innerHTML = "&times;";
   closeBox.onclick = function() {
      document.body.removeChild(overlay);
   };
   overlay.appendChild(closeBox);

   document.body.appendChild(overlay);
}
}


// New function to show participation confirmation under the respective photo
function showParticipationConfirmation(eventName) {
   // Assuming each image has a unique alt attribute representing the event name
   
   let images = document.querySelectorAll("#lbImages img");

   images.forEach(img => {
       if (img.alt === eventName && !img.classList.contains("confirmationGenerated")) {
           // Remove any existing confirmation messages
           let existingConfirmationMessage = document.querySelector(".confirmationMessage");
           if (existingConfirmationMessage) {
               existingConfirmationMessage.parentNode.removeChild(existingConfirmationMessage);
           }
           
           // Create and append the new confirmation message
           let confirmationMessage = document.createElement("div");
           confirmationMessage.textContent = "\u2022 PLEASE, CHECK THE UPCOMING EVENTS: " + eventName; // Add dot at the beginning
           //confirmationMessage.style.color = "green";
           confirmationMessage.style.fontSize = "larger"; // Increase font size
           //confirmationMessage.style.fontWeight = "bold";
           confirmationMessage.classList.add("confirmationMessage"); // Add a class to identify the message
           
           // Get the parent container of the images
           let parentContainer = img.closest("#lbImages");
   
           // Insert the confirmation message after the parent container
           parentContainer.parentNode.insertBefore(confirmationMessage, parentContainer.nextSibling);
           
   
           // Add a class to the image to indicate that confirmation message has been generated
           img.classList.add("confirmationGenerated");
       }
   });
   
   
   

   
}
function createOverlay() {
   let overlay = document.createElement("div");
   overlay.id = "lbOverlay";
   
}
document.getElementById("closeBtn").addEventListener("click", function(event) {
   if (event.target === this) {
       // This condition ensures that the event is triggered by the close button itself, not by its children
       //console.log("Close button clicked");
   }
});



   




