document.querySelectorAll('.event-photo').forEach(photo => {
    photo.addEventListener('click', function() {
        const eventId = this.getAttribute('data-event');
        displayEvents(eventId);
    });
});

function displayEvents(eventId) {
    // Example data; replace with dynamic content as needed
    const events = {
        'event1': [
            { id: 1, name: 'Event 1A', description: 'Football'},
            { id: 2, name: 'Event 1B', description: 'Dancing'}, 
            { id: 3, name: 'Event 1C', description: 'Swimming'}, 
            { id: 4, name: 'Event 1D', description: 'Bus Tour'}, 
            { id: 5, name: 'Event 1E', description: 'Picnic'} 
        ]
        // Add other events linked to other photos here
    };

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous content
    events[eventId].forEach(event => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <button class="participate-btn" onclick="participate('${event.id}')">Participate</button>
        `;
        eventList.appendChild(div);
    });

    document.getElementById('events').style.display = 'block';
}

function participate(eventId) {
alert(`You have signed up for event ID: ${eventId}`);
    // Here, implement the functionality to mark the user as signed up
    // This could involve interacting with a backend server
}
