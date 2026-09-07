```javascript
document.addEventListener("DOMContentLoaded", function () {

    const bookingData = sessionStorage.getItem("bulaSelectedFlight");

    if (!bookingData) {
        document.getElementById("welcome-message").textContent =
            "Your booking information could not be found.";

        return;
    }

    const flight = JSON.parse(bookingData);

    const passengerName =
        sessionStorage.getItem("bulaPassengerName") || "Passenger";

    const bookingReference =
        "BA" + Math.random().toString(36).substring(2, 8).toUpperCase();

    document.getElementById("welcome-message").textContent =
        passengerName +
        ", your flight has been booked! Enjoy your journey to " +
        flight.destinationName +
        ".";

    document.getElementById("booking-reference").textContent =
        bookingReference;

    document.getElementById("flight-number").textContent =
        flight.flightNumber;

    document.getElementById("destination").textContent =
        flight.destinationName +
        " (" +
        flight.destination +
        ")";

    document.getElementById("flight-date").textContent =
        flight.date;

    document.getElementById("seats").textContent =
        sessionStorage.getItem("bulaSelectedSeats") || "To be assigned";

});
```
