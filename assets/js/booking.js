```javascript
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("booking-search");
    const results = document.getElementById("flight-results");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const origin = document.getElementById("from").value.trim().toUpperCase();
        const destination = document.getElementById("to").value.trim().toUpperCase();
        const date = document.getElementById("departure-date").value;
        const passengers = Number(document.getElementById("passengers").value);

        if (origin.length !== 3 || destination.length !== 3) {
            results.innerHTML = "<div class='booking-error'><h2>Invalid airport code</h2><p>Use a 3-letter airport code.</p></div>";
            return;
        }

        if (origin === destination) {
            results.innerHTML = "<div class='booking-error'><h2>Invalid route</h2><p>Departure and destination cannot be the same.</p></div>";
            return;
        }

        results.innerHTML = "<div class='no-flights'><h2>Searching...</h2></div>";

        fetch("../data/routes.json")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Could not load routes.json");
                }

                return response.json();
            })

            .then(function (routes) {

                const matchingRoutes = routes.filter(function (route) {
                    return (
                        route.origin.toUpperCase() === origin &&
                        route.destination.toUpperCase() === destination
                    );
                });

                if (matchingRoutes.length === 0) {

                    results.innerHTML =
                        "<div class='no-flights'>" +
                        "<h2>No flights found</h2>" +
                        "<p>Bula Air does not currently operate this route.</p>" +
                        "</div>";

                    return;
                }

                results.innerHTML = "<h2>Available Flights</h2>";

                matchingRoutes.forEach(function (route, index) {

                    const flightNumber =
                        "BA" + String(100 + index).padStart(3, "0");

                    const fare = Number(route.sampleFare);
                    const total = fare * passengers;

                    let aircraft = "Airbus A320neo";

                    if (route.distance > 8000) {
                        aircraft = "Airbus A350-900";
                    } else if (route.distance > 4500) {
                        aircraft = "Airbus A330-900neo";
                    } else if (route.distance > 2500) {
                        aircraft = "Airbus A321neo";
                    }

                    const card = document.createElement("article");

                    card.className = "flight-card";

                    card.innerHTML =
                        "<div class='flight-main'>" +

                            "<div class='flight-time'>" +
                                "<strong>09:00</strong>" +
                                "<span>" + route.origin + "</span>" +
                            "</div>" +

                            "<div class='flight-duration'>" +
                                "<span>" + route.distance.toLocaleString() + " km</span>" +
                                "<div class='flight-line'></div>" +
                                "<small>Direct</small>" +
                            "</div>" +

                            "<div class='flight-time'>" +
                                "<strong>12:00</strong>" +
                                "<span>" + route.destination + "</span>" +
                            "</div>" +

                        "</div>" +

                        "<div class='flight-info'>" +
                            "<strong>" + flightNumber + "</strong>" +
                            "<span>" + route.originName + " → " + route.destinationName + "</span>" +
                            "<span>" + aircraft + "</span>" +
                            "<span>" + passengers + " passenger(s)</span>" +
                        "</div>" +

                        "<div class='flight-price'>" +
                            "<span>Economy from</span>" +
                            "<strong>$" + total.toLocaleString() + "</strong>" +
                            "<button type='button' class='select-flight'>Select Flight</button>" +
                        "</div>";

                    const button = card.querySelector(".select-flight");

                    button.addEventListener("click", function () {

                        const selectedFlight = {
                            routeId: route.id,
                            flightNumber: flightNumber,
                            origin: route.origin,
                            originName: route.originName,
                            destination: route.destination,
                            destinationName: route.destinationName,
                            distance: route.distance,
                            date: date,
                            passengers: passengers,
                            aircraft: aircraft,
                            departureTime: "09:00",
                            arrivalTime: "12:00",
                            baseFare: fare,
                            totalFare: total
                        };

                        sessionStorage.setItem(
                            "bulaSelectedFlight",
                            JSON.stringify(selectedFlight)
                        );

                        window.location.href = "seating.html";
                    });

                    results.appendChild(card);
                });
            })

            .catch(function (error) {

                console.error("Bula Air booking error:", error);

                results.innerHTML =
                    "<div class='booking-error'>" +
                    "<h2>Booking system error</h2>" +
                    "<p>Could not load the flight information.</p>" +
                    "</div>";
            });
    });
});
```
