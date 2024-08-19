document.addEventListener('DOMContentLoaded', function() {
    const eventList = document.getElementById('eventList');
    const addEventForm = document.getElementById('addEventForm');

    // Load events from local storage
    loadEvents();

    // Add event form submission
    addEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const eventName = document.getElementById('eventName').value;
        const eventDate = new Date(document.getElementById('eventDate').value).getTime();
        
        if (eventName && eventDate) {
            addEvent(eventName, eventDate);
            $('#addEventModal').modal('hide');
        }
    });

    // Function to add an event
    function addEvent(name, date) {
        // Create a new event element
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        eventItem.setAttribute('data-date', date); // Set a data attribute for easy access
        eventItem.innerHTML = `
            <div>
                <h4>${name}</h4>
                <div id="countdown-${date}" class="d-flex justify-content-center">
                    <div class="timer-box mx-2">
                        <h2 id="days-${date}">00</h2>
                        <p>Days</p>
                    </div>
                    <div class="timer-box mx-2">
                        <h2 id="hours-${date}">00</h2>
                        <p>Hours</p>
                    </div>
                    <div class="timer-box mx-2">
                        <h2 id="minutes-${date}">00</h2>
                        <p>Minutes</p>
                    </div>
                    <div class="timer-box mx-2">
                        <h2 id="seconds-${date}">00</h2>
                        <p>Seconds</p>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${date})">Delete</button>
        `;
        eventList.appendChild(eventItem);

        // Start the countdown
        startCountdown(name, date);
        
        // Save to local storage
        saveEvent(name, date);
    }

    // Function to start countdown
    function startCountdown(name, date) {
        const interval = setInterval(function() {
            const now = new Date().getTime();
            const distance = date - now;

            if (distance < 0) {
                clearInterval(interval);
                document.getElementById(`countdown-${date}`).innerHTML = "EXPIRED";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById(`days-${date}`).innerHTML = days;
            document.getElementById(`hours-${date}`).innerHTML = hours;
            document.getElementById(`minutes-${date}`).innerHTML = minutes;
            document.getElementById(`seconds-${date}`).innerHTML = seconds;
        }, 1000);
    }

    // Function to delete an event
    window.deleteEvent = function(date) {
        const eventItem = document.querySelector(`div[data-date="${date}"]`);
        if (eventItem) {
            eventItem.remove();
            // Remove from local storage
            removeEvent(date);
        }
    }

    // Save event to local storage
    function saveEvent(name, date) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.push({ name, date });
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Remove event from local storage
    function removeEvent(date) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events = events.filter(event => event.date !== date);
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Load events from local storage
    function loadEvents() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.forEach(event => addEvent(event.name, event.date));
    }
});
