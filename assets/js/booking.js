/* =========================================================
   BULA AIR — BOOKING + SEATING SYSTEM
   ========================================================= */


/* =========================================================
   AIRCRAFT SEAT CONFIGURATIONS
   ========================================================= */

const aircraftLayouts = {

    "A350-900": {

        cabins: {

            economy: {
                name: "Economy",
                type: "economy",
                layout: "3-3-3",
                rows: 30,
                letters: ["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]
            },

            "premium-economy": {
                name: "Premium Economy",
                type: "premium-economy",
                layout: "2-3-2",
                rows: 8,
                letters: ["A", "B", "", "C", "D", "E", "", "F", "G"]
            },

            business: {
                name: "Business Class",
                type: "business",
                layout: "1-2-1",
                rows: 7,
                letters: ["A", "", "C", "D", "", "G"]
            },

            first: {
                name: "Apartment Suites",
                type: "apartment",
                layout: "1-1",
                rows: 4,
                letters: ["A", "", "D"]
            }
        }
    },


    "A330-900neo": {

        cabins: {

            economy: {
                name: "Economy",
                type: "economy",
                layout: "2-4-2",
                rows: 28,
                letters: ["A", "B", "", "C", "D", "E", "F", "", "G", "H"]
            },

            "premium-economy": {
                name: "Premium Economy",
                type: "premium-economy",
                layout: "2-3-2",
                rows: 7,
                letters: ["A", "B", "", "C", "D", "E", "", "F", "G"]
            },

            business: {
                name: "Business Class",
                type: "business",
                layout: "1-2-1",
                rows: 6,
                letters: ["A", "", "C", "D", "", "G"]
            },

            first: {
                name: "Premium Herringbone Suites",
                type: "herringbone",
                layout: "1-2-1",
                rows: 4,
                letters: ["A", "", "C", "D", "", "G"]
            }
        }
    },


    "787-9": {

        cabins: {

            economy: {
                name: "Economy",
                type: "economy",
                layout: "3-3-3",
                rows: 29,
                letters: ["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]
            },

            "premium-economy": {
                name: "Premium Economy",
                type: "premium-economy",
                layout: "2-3-2",
                rows: 6,
                letters: ["A", "B", "", "C", "D", "E", "", "F", "G"]
            },

            business: {
                name: "Staggered Business Suites",
                type: "staggered",
                layout: "1-2-1",
                rows: 7,
                letters: ["A", "", "C", "D", "", "G"]
            },

            first: {
                name: "Premium Herringbone Suites",
                type: "herringbone",
                layout: "1-1-1",
                rows: 4,
                letters: ["A", "", "E", "", "K"]
            }
        }
    }
};


/* =========================================================
   DEMO FLIGHTS
   ========================================================= */

const flights = [

    {
        from: "NAN",
        to: "AKL",
        departureTime: "08:20",
        arrivalTime: "13:25",
        aircraft: "A350-900",
        flight: "BA101",
        price: 429
    },

    {
        from: "NAN",
        to: "AKL",
        departureTime: "16:40",
        arrivalTime: "21:45",
        aircraft: "A330-900neo",
        flight: "BA105",
        price: 459
    },

    {
        from: "AKL",
        to: "NAN",
        departureTime: "09:10",
        arrivalTime: "14:20",
        aircraft: "A350-900",
        flight: "BA102",
        price: 439
    },

    {
        from: "NAN",
        to: "SYD",
        departureTime: "10:30",
        arrivalTime: "14:45",
        aircraft: "787-9",
        flight: "BA201",
        price: 499
    },

    {
        from: "SYD",
        to: "NAN",
        departureTime: "15:30",
        arrivalTime: "20:00",
        aircraft: "787-9",
        flight: "BA202",
        price: 509
    }
];


/* =========================================================
   GLOBAL BOOKING STATE
   ========================================================= */

let bookingData = {};
let selectedSeats = [];


/* =========================================================
   SEATING PAGE
   ========================================================= */

const aircraftSelect =
    document.getElementById("aircraft-select");

const seatMap =
    document.getElementById("seat-map");

const selectedCount =
    document.getElementById("selected-count");


function createAircraftOptions() {

    if (!aircraftSelect) return;

    aircraftSelect.innerHTML = "";

    Object.keys(aircraftLayouts).forEach(aircraft => {

        const option =
            document.createElement("option");

        option.value = aircraft;
        option.textContent = aircraft;

        aircraftSelect.appendChild(option);
    });
}


/* =========================================================
   CREATE SEAT MAP
   ========================================================= */

function createSeatMap(
    aircraftName,
    cabinName = "economy",
    maximumSeats = Infinity
) {

    if (!seatMap) return;

    seatMap.innerHTML = "";

    selectedSeats = [];

    updateSelectedCount();

    const aircraft =
        aircraftLayouts[aircraftName];

    if (!aircraft) return;

    const cabin =
        aircraft.cabins[cabinName];

    if (!cabin) return;


    /* Cabin title */

    const cabinHeader =
        document.createElement("div");

    cabinHeader.className =
        "seat-cabin-header";

    cabinHeader.innerHTML = `
        <div>
            <span class="eyebrow">Bula Air seating</span>
            <h2>${cabin.name}</h2>
        </div>

        <span class="seat-layout-label">
            ${cabin.layout}
        </span>
    `;

    seatMap.appendChild(cabinHeader);


    /* Aircraft nose */

    const nose =
        document.createElement("div");

    nose.className = "aircraft-nose";

    nose.innerHTML = `
        <div class="cockpit-window"></div>
        <span>NOSE</span>
    `;

    seatMap.appendChild(nose);


    /* Rows */

    for (
        let row = 1;
        row <= cabin.rows;
        row++
    ) {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            `seat-row seat-row-${cabin.type}`;


        const rowNumber =
            document.createElement("span");

        rowNumber.className =
            "row-number";

        rowNumber.textContent = row;

        rowElement.appendChild(rowNumber);


        cabin.letters.forEach((letter, index) => {

            if (letter === "") {

                const aisle =
                    document.createElement("div");

                aisle.className =
                    "seat-aisle";

                rowElement.appendChild(aisle);

                return;
            }


            const seat =
                document.createElement("button");

            seat.type = "button";

            seat.className =
                `seat ${cabin.type} available`;

            const seatNumber =
                `${row}${letter}`;

            seat.textContent =
                seatNumber;

            seat.dataset.seat =
                seatNumber;


            /*
             * Different visual seat shapes
             */

            if (cabin.type === "apartment") {

                seat.innerHTML = `
                    <span class="seat-door"></span>
                    <strong>${seatNumber}</strong>
                    <small>Suite</small>
                `;
            }

            else if (cabin.type === "herringbone") {

                seat.innerHTML = `
                    <span class="suite-shell"></span>
                    <strong>${seatNumber}</strong>
                `;
            }

            else if (cabin.type === "staggered") {

                seat.innerHTML = `
                    <span class="staggered-shell"></span>
                    <strong>${seatNumber}</strong>
                `;
            }

            else if (cabin.type === "business") {

                seat.innerHTML = `
                    <span class="business-shell"></span>
                    <strong>${seatNumber}</strong>
                `;
            }

            else {

                seat.textContent =
                    seatNumber;
            }


            /*
             * Random occupied seats
             */

            if (Math.random() < 0.12) {

                seat.classList.remove(
                    "available"
                );

                seat.classList.add(
                    "occupied"
                );
            }


            seat.addEventListener(
                "click",
                () => {

                    toggleSeat(
                        seat,
                        maximumSeats
                    );

                }
            );


            rowElement.appendChild(seat);
        });


        seatMap.appendChild(rowElement);
    }


    /* Tail */

    const tail =
        document.createElement("div");

    tail.className = "aircraft-tail";

    tail.innerHTML = "TAIL";

    seatMap.appendChild(tail);
}


/* =========================================================
   TOGGLE SEAT
   ========================================================= */

function toggleSeat(
    seat,
    maximumSeats = Infinity
) {

    const seatNumber =
        seat.dataset.seat;


    if (
        seat.classList.contains(
            "occupied"
        )
    ) {

        return;
    }


    if (
        seat.classList.contains(
            "selected"
        )
    ) {

        seat.classList.remove(
            "selected"
        );

        seat.classList.add(
            "available"
        );

        selectedSeats =
            selectedSeats.filter(
                seat =>
                    seat !== seatNumber
            );

    }

    else {

        if (
            selectedSeats.length >=
            maximumSeats
        ) {

            alert(
                `You can only select ${maximumSeats} seat${maximumSeats === 1 ? "" : "s"}.`
            );

            return;
        }


        seat.classList.remove(
            "available"
        );

        seat.classList.add(
            "selected"
        );

        selectedSeats.push(
            seatNumber
        );
    }


    updateSelectedCount();
}


/* =========================================================
   SELECTED COUNT
   ========================================================= */

function updateSelectedCount() {

    if (!selectedCount) return;

    selectedCount.textContent =
        selectedSeats.length;
}


/* =========================================================
   STANDALONE SEATING PAGE
   ========================================================= */

if (aircraftSelect) {

    createAircraftOptions();

    createSeatMap(
        aircraftSelect.value,
        "economy"
    );


    aircraftSelect.addEventListener(
        "change",
        () => {

            createSeatMap(
                aircraftSelect.value,
                "economy"
            );

        }
    );
}


/* =========================================================
   BOOKING SEARCH
   ========================================================= */

const bookingForm =
    document.getElementById(
        "booking-search"
    );

const results =
    document.getElementById(
        "flight-results"
    );

const status =
    document.getElementById(
        "booking-status"
    );


const returnField =
    document.getElementById(
        "return-field"
    );

const returnDate =
    document.getElementById(
        "return-date"
    );


/* Trip type */

document
    .querySelectorAll(
        'input[name="trip-type"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            updateTripType
        );

    });


function updateTripType() {

    const selected =
        document.querySelector(
            'input[name="trip-type"]:checked'
        );

    if (!selected) return;


    if (
        selected.value ===
        "oneway"
    ) {

        if (returnField)
            returnField.style.display =
                "none";

        if (returnDate) {
            returnDate.required =
                false;

            returnDate.value = "";
        }

    }

    else {

        if (returnField)
            returnField.style.display =
                "";

        if (returnDate)
            returnDate.required =
                true;
    }
}


updateTripType();


/* =========================================================
   SEARCH FLIGHTS
   ========================================================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const from =
                document
                    .getElementById("from")
                    .value
                    .trim()
                    .toUpperCase();


            const to =
                document
                    .getElementById("to")
                    .value
                    .trim()
                    .toUpperCase();


            const departure =
                document
                    .getElementById(
                        "departure-date"
                    )
                    .value;


            const returnDateValue =
                document
                    .getElementById(
                        "return-date"
                    )
                    .value;


            const passengers =
                Number(
                    document
                        .getElementById(
                            "passengers"
                        )
                        .value
                );


            const cabin =
                document
                    .getElementById(
                        "cabin-class"
                    )
                    .value;


            const tripType =
                document.querySelector(
                    'input[name="trip-type"]:checked'
                ).value;


            if (
                tripType === "roundtrip" &&
                returnDateValue &&
                departure &&
                returnDateValue < departure
            ) {

                if (status) {

                    status.textContent =
                        "Return date must be after your departure date.";

                }

                return;
            }


            const matchingFlights =
                flights.filter(
                    flight =>
                        flight.from === from &&
                        flight.to === to
                );


            if (!matchingFlights.length) {

                if (status) {

                    status.textContent =
                        "No Bula Air flights were found for that route.";

                }

                if (results)
                    results.innerHTML = "";

                return;
            }


            bookingData = {

                from,
                to,
                departure,
                returnDate:
                    returnDateValue,

                passengers,

                cabin,

                tripType
            };


            if (status) {

                status.textContent =
                    `${matchingFlights.length} flight${matchingFlights.length === 1 ? "" : "s"} found.`;

            }


            displayFlights(
                matchingFlights
            );

        }
    );
}


/* =========================================================
   DISPLAY FLIGHTS
   ========================================================= */

function displayFlights(
    matchingFlights
) {

    if (!results) return;

    results.innerHTML = `
        <div class="results-header">
            <div>
                <span class="eyebrow">Available flights</span>
                <h2>
                    ${bookingData.from}
                    →
                    ${bookingData.to}
                </h2>
            </div>
        </div>
    `;


    matchingFlights.forEach(
        flight => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "flight-card";


            card.innerHTML = `

                <div class="flight-main">

                    <div class="flight-time">
                        <strong>
                            ${flight.departureTime}
                        </strong>

                        <span>
                            ${flight.from}
                        </span>
                    </div>


                    <div class="flight-line">

                        <span></span>

                        <small>
                            ${flight.aircraft}
                        </small>

                        <span></span>

                    </div>


                    <div class="flight-time">
                        <strong>
                            ${flight.arrivalTime}
                        </strong>

                        <span>
                            ${flight.to}
                        </span>
                    </div>

                </div>


                <div class="flight-info">

                    <div>
                        <span class="badge">
                            ${flight.flight}
                        </span>

                        <span class="badge">
                            ${flight.aircraft}
                        </span>
                    </div>


                    <strong class="flight-price">
                        NZ$${flight.price}
                    </strong>


                    <button
                        type="button"
                        class="button"
                        data-flight="${flight.flight}"
                    >
                        Select flight
                    </button>

                </div>
            `;


            card
                .querySelector(
                    "[data-flight]"
                )
                .addEventListener(
                    "click",
                    () => {

                        selectFlight(
                            flight
                        );

                    }
                );


            results.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   SELECT FLIGHT
   ========================================================= */

function selectFlight(
    flight
) {

    bookingData.flight =
        flight;


    showPassengerStep();
}


/* =========================================================
   PASSENGER DETAILS
   ========================================================= */

function showPassengerStep() {

    if (!results) return;


    results.innerHTML = `

        <section class="booking-section">

            <div class="booking-section-heading">

                <span class="eyebrow">
                    Step 3
                </span>

                <h2>
                    Passenger details
                </h2>

                <p>
                    Tell us who's travelling.
                </p>

            </div>


            <div
                id="passenger-forms"
                class="passenger-forms"
            ></div>


            <button
                id="continue-passengers"
                class="button"
                type="button"
            >
                Continue to seats
            </button>

        </section>
    `;


    const passengerForms =
        document.getElementById(
            "passenger-forms"
        );


    for (
        let i = 1;
        i <= bookingData.passengers;
        i++
    ) {

        const passenger =
            document.createElement(
                "div"
            );

        passenger.className =
            "passenger-card";


        passenger.innerHTML = `

            <div class="passenger-number">
                ${i}
            </div>

            <div class="passenger-fields">

                <h3>
                    Passenger ${i}
                </h3>

                <div class="form-grid">

                    <label>
                        <span>
                            First name
                        </span>

                        <input
                            class="input passenger-first"
                            type="text"
                            required
                        >
                    </label>


                    <label>
                        <span>
                            Last name
                        </span>

                        <input
                            class="input passenger-last"
                            type="text"
                            required
                        >
                    </label>

                </div>

            </div>
        `;


        passengerForms.appendChild(
            passenger
        );
    }


    document
        .getElementById(
            "continue-passengers"
        )
        .addEventListener(
            "click",
            savePassengers
        );
}


/* =========================================================
   SAVE PASSENGERS
   ========================================================= */

function savePassengers() {

    const firstNames =
        document.querySelectorAll(
            ".passenger-first"
        );

    const lastNames =
        document.querySelectorAll(
            ".passenger-last"
        );


    const passengerDetails = [];


    for (
        let i = 0;
        i < firstNames.length;
        i++
    ) {

        const firstName =
            firstNames[i]
                .value
                .trim();

        const lastName =
            lastNames[i]
                .value
                .trim();


        if (
            !firstName ||
            !lastName
        ) {

            alert(
                "Please enter every passenger's first and last name."
            );

            return;
        }


        passengerDetails.push({

            firstName,
            lastName

        });
    }


    bookingData.passengerDetails =
        passengerDetails;


    showBookingSeatStep();
}


/* =========================================================
   BOOKING SEAT SELECTION
   ========================================================= */

function showBookingSeatStep() {

    results.innerHTML = `

        <section class="booking-section">

            <div class="booking-section-heading">

                <span class="eyebrow">
                    Step 4
                </span>

                <h2>
                    Choose your seats
                </h2>

                <p>
                    ${formatCabin(bookingData.cabin)}
                    ·
                    ${bookingData.flight.aircraft}
                </p>

            </div>


            <div
                id="booking-seat-map"
                class="seat-map"
            ></div>


            <div class="legend">

                <span>
                    <i class="legend-seat available"></i>
                    Available
                </span>

                <span>
                    <i class="legend-seat selected"></i>
                    Selected
                </span>

                <span>
                    <i class="legend-seat occupied"></i>
                    Occupied
                </span>

            </div>


            <button
                id="continue-seats"
                class="button"
                type="button"
            >
                Review booking
            </button>

        </section>
    `;


    const oldSeatMap =
        seatMap;

    const bookingSeatMap =
        document.getElementById(
            "booking-seat-map"
        );


    /*
     * Temporarily point the global
     * seatMap variable at the booking map.
     */

    const originalSeatMap =
        seatMap;


    /*
     * Generate directly into booking map.
     */

    generateBookingSeatMap(
        bookingSeatMap,
        bookingData.flight.aircraft,
        bookingData.cabin
    );


    document
        .getElementById(
            "continue-seats"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    selectedSeats.length !==
                    bookingData.passengers
                ) {

                    alert(
                        `Please select ${bookingData.passengers} seat${bookingData.passengers === 1 ? "" : "s"}.`
                    );

                    return;
                }


                bookingData.selectedSeats =
                    [...selectedSeats];

                showReviewStep();

            }
        );
}


/* =========================================================
   BOOKING MAP GENERATOR
   ========================================================= */

function generateBookingSeatMap(
    target,
    aircraftName,
    cabinName
) {

    target.innerHTML = "";

    selectedSeats = [];


    const aircraft =
        aircraftLayouts[aircraftName];

    if (!aircraft) return;


    const cabin =
        aircraft.cabins[cabinName];

    if (!cabin) return;


    const cabinHeader =
        document.createElement(
            "div"
        );

    cabinHeader.className =
        "seat-cabin-header";

    cabinHeader.innerHTML = `

        <div>

            <span class="eyebrow">
                ${aircraftName}
            </span>

            <h2>
                ${cabin.name}
            </h2>

        </div>

        <span class="seat-layout-label">
            ${cabin.layout}
        </span>
    `;

    target.appendChild(
        cabinHeader
    );


    for (
        let row = 1;
        row <= cabin.rows;
        row++
    ) {

        const rowElement =
            document.createElement(
                "div"
            );

        rowElement.className =
            `seat-row seat-row-${cabin.type}`;


        const rowNumber =
            document.createElement(
                "span"
            );

        rowNumber.className =
            "row-number";

        rowNumber.textContent =
            row;

        rowElement.appendChild(
            rowNumber
        );


        cabin.letters.forEach(
            letter => {

                if (letter === "") {

                    const aisle =
                        document.createElement(
                            "div"
                        );

                    aisle.className =
                        "seat-aisle";

                    rowElement.appendChild(
                        aisle
                    );

                    return;
                }


                const seat =
                    document.createElement(
                        "button"
                    );

                seat.type =
                    "button";

                seat.className =
                    `seat ${cabin.type} available`;


                const seatNumber =
                    `${row}${letter}`;

                seat.dataset.seat =
                    seatNumber;


                if (
                    cabin.type ===
                    "apartment"
                ) {

                    seat.innerHTML = `
                        <span class="seat-door"></span>
                        <strong>${seatNumber}</strong>
                        <small>Suite</small>
                    `;

                }

                else if (
                    cabin.type ===
                    "herringbone"
                ) {

                    seat.innerHTML = `
                        <span class="suite-shell"></span>
                        <strong>${seatNumber}</strong>
                    `;

                }

                else if (
                    cabin.type ===
                    "staggered"
                ) {

                    seat.innerHTML = `
                        <span class="staggered-shell"></span>
                        <strong>${seatNumber}</strong>
                    `;

                }

                else if (
                    cabin.type ===
                    "business"
                ) {

                    seat.innerHTML = `
                        <span class="business-shell"></span>
                        <strong>${seatNumber}</strong>
                    `;

                }

                else {

                    seat.textContent =
                        seatNumber;
                }


                if (
                    Math.random() <
                    0.12
                ) {

                    seat.classList.remove(
                        "available"
                    );

                    seat.classList.add(
                        "occupied"
                    );

                }


                seat.addEventListener(
                    "click",
                    () => {

                        toggleSeat(
                            seat,
                            bookingData.passengers
                        );

                    }
                );


                rowElement.appendChild(
                    seat
                );

            }
        );


        target.appendChild(
            rowElement
        );
    }
}


/* =========================================================
   REVIEW
   ========================================================= */

function showReviewStep() {

    results.innerHTML = `

        <section class="booking-section">

            <div class="booking-section-heading">

                <span class="eyebrow">
                    Step 5
                </span>

                <h2>
                    Review your booking
                </h2>

            </div>


            <div class="booking-summary">

                <div class="booking-summary-row">
                    <span>
                        Flight
                    </span>

                    <strong>
                        ${bookingData.flight.flight}
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Route
                    </span>

                    <strong>
                        ${bookingData.from}
                        →
                        ${bookingData.to}
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Aircraft
                    </span>

                    <strong>
                        ${bookingData.flight.aircraft}
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Cabin
                    </span>

                    <strong>
                        ${formatCabin(
                            bookingData.cabin
                        )}
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Seats
                    </span>

                    <strong>
                        ${bookingData.selectedSeats.join(", ")}
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Passengers
                    </span>

                    <strong>
                        ${bookingData.passengerDetails
                            .map(
                                passenger =>
                                    `${passenger.firstName} ${passenger.lastName}`
                            )
                            .join(", ")
                        }
                    </strong>
                </div>


                <div class="booking-summary-row">
                    <span>
                        Total
                    </span>

                    <strong>
                        NZ$${bookingData.flight.price *
                            bookingData.passengers}
                    </strong>
                </div>

            </div>


            <button
                id="confirm-booking"
                class="button"
                type="button"
            >
                Confirm booking
            </button>

        </section>
    `;


    document
        .getElementById(
            "confirm-booking"
        )
        .addEventListener(
            "click",
            completeBooking
        );
}


/* =========================================================
   COMPLETE BOOKING
   ========================================================= */

function completeBooking() {

    bookingData.selectedSeats =
        [...selectedSeats];


    bookingData.confirmationNumber =
        generateConfirmationNumber();


    sessionStorage.setItem(
        "bulaAirBooking",
        JSON.stringify(
            bookingData
        )
    );


    window.location.href =
        "confirmation.html";
}


/* =========================================================
   CONFIRMATION NUMBER
   ========================================================= */

function generateConfirmationNumber() {

    const letters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ";

    let result = "";


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        result +=
            letters[
                Math.floor(
                    Math.random() *
                    letters.length
                )
            ];
    }


    result += "-";


    result +=
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return result;
}


/* =========================================================
   CABIN FORMATTER
   ========================================================= */

function formatCabin(
    cabin
) {

    const names = {

        economy:
            "Economy",

        "premium-economy":
            "Premium Economy",

        business:
            "Business Class",

        first:
            "First Class"
    };


    return names[cabin] ||
        cabin;
}