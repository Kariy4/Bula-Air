(() => {
  "use strict";

  const ROUTES_URL = "../data/routes.json";
  const FLEET_URL = "../data/fleet.json";

  let flights = [];
  let fleet = [];

  let selectedAircraft = null;
  let selectedRoute = null;
  let selectedDate = null;

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    status: $("#booking-status"),

    aircraftGrid: $("#aircraft-grid"),
    routeGrid: $("#route-grid"),

    routeDescription: $("#route-description"),
    dateDescription: $("#date-description"),

    travelDate: $("#travel-date"),

    farePassengerCount: $("#fare-passenger-count"),
    fareCabin: $("#fare-cabin"),

    fareRouteTitle: $("#fare-route-title"),
    fareAircraft: $("#fare-aircraft"),
    fareDeparture: $("#fare-departure"),
    fareArrival: $("#fare-arrival"),
    fareDate: $("#fare-date"),
    fareCabinDisplay: $("#fare-cabin"),
    farePassengers: $("#fare-passengers"),
    fareBase: $("#fare-base"),
    fareTotal: $("#fare-total"),

    passengerForm: $("#passenger-form"),

    familyName: $("#family-name"),
    email: $("#contact-email"),
    phone: $("#contact-phone"),

    successReference: $("#success-reference"),
    successName: $("#success-name"),
    successFlight: $("#success-flight"),
    successAircraft: $("#success-aircraft"),
    successRoute: $("#success-route"),
    successDate: $("#success-date"),
    successCabin: $("#success-cabin"),
    successPassengers: $("#success-passengers"),
    successTotal: $("#success-total")
  };

  /*
   * =========================================================
   * AIRCRAFT NORMALISATION
   * =========================================================
   */

  function normaliseAircraft(value) {
    if (!value) return "Unknown aircraft";

    const text = String(value)
      .replace(/\s+/g, " ")
      .trim();

    const aliases = {
      "A220-300": "Airbus A220-300",
      "Airbus A220": "Airbus A220-300",

      "A320neo": "Airbus A320neo",
      "A320-200neo": "Airbus A320neo",

      "A321neo": "Airbus A321neo",
      "A321-200neo": "Airbus A321neo",

      "A321-200": "Airbus A321-200",

      "A330neo": "Airbus A330-900",
      "A330-900neo": "Airbus A330-900",
      "A330-900": "Airbus A330-900",

      "A350-900": "Airbus A350-900",
      "A350-1000": "Airbus A350-1000",
      "A350-1000ULR": "Airbus A350-1000ULR",

      "A380": "Airbus A380-800",
      "A380-800": "Airbus A380-800",

      "777-9": "Boeing 777-9",
      "Boeing 777X": "Boeing 777-9",

      "ATR72": "ATR 72-600",
      "ATR 72": "ATR 72-600",
      "ATR 72-600": "ATR 72-600"
    };

    return aliases[text] || text;
  }

  /*
   * =========================================================
   * NORMALISE FLIGHTS
   * =========================================================
   */

  function normaliseFlight(raw, index) {
    if (Array.isArray(raw)) {
      const [
        flightNumber,
        origin,
        destination,
        departure,
        arrival,
        arrivalDayOffset,
        duration,
        days,
        aircraft,
        fare
      ] = raw;

      return {
        id: `${String(flightNumber || "flight")
          .replace(/\s+/g, "-")}-${index}`,

        flightNumber: String(
          flightNumber || `BLPX1 ${1000 + index}`
        ),

        origin: String(origin || "").toUpperCase(),

        destination: String(destination || "").toUpperCase(),

        departure: String(departure || ""),

        arrival: String(arrival || ""),

        arrivalDayOffset: Number(arrivalDayOffset || 0),

        duration: String(duration || ""),

        days: String(days || "MTWTFSS"),

        aircraft: normaliseAircraft(aircraft),

        fare: Number(fare) || 0
      };
    }

    return {
      id: `${String(raw.flightNumber || raw.id || "flight")
        .replace(/\s+/g, "-")}-${index}`,

      flightNumber: String(
        raw.flightNumber ||
        raw.flight_number ||
        raw.number ||
        raw.code ||
        raw.id ||
        `BLPX1 ${1000 + index}`
      ),

      origin: String(
        raw.origin ||
        raw.from ||
        raw.departureAirport ||
        ""
      ).toUpperCase(),

      destination: String(
        raw.destination ||
        raw.to ||
        raw.arrivalAirport ||
        ""
      ).toUpperCase(),

      departure: String(
        raw.departure ||
        raw.departureTime ||
        raw.departure_time ||
        ""
      ),

      arrival: String(
        raw.arrival ||
        raw.arrivalTime ||
        raw.arrival_time ||
        ""
      ),

      arrivalDayOffset: Number(
        raw.arrivalDayOffset ??
        raw.arrival_day_offset ??
        raw.dayOffset ??
        0
      ),

      duration: String(
        raw.duration ||
        raw.flightDuration ||
        ""
      ),

      days: String(
        raw.days ||
        raw.operatingDays ||
        "MTWTFSS"
      ),

      aircraft: normaliseAircraft(
        raw.aircraft ||
        raw.aircraftType ||
        raw.aircraft_type ||
        ""
      ),

      fare: Number(
        raw.fare ??
        raw.price ??
        raw.baseFare ??
        raw.base_fare ??
        raw.amount ??
        0
      )
    };
  }

  /*
   * =========================================================
   * LOAD DATA
   * =========================================================
   */

  async function loadData() {
    setStatus("Loading Bula Air booking system...");

    try {
      const [fleetResponse, routesResponse] = await Promise.all([
        fetch(`${FLEET_URL}?v=${Date.now()}`),
        fetch(`${ROUTES_URL}?v=${Date.now()}`)
      ]);

      if (!fleetResponse.ok) {
        throw new Error(`fleet.json returned ${fleetResponse.status}`);
      }

      if (!routesResponse.ok) {
        throw new Error(`routes.json returned ${routesResponse.status}`);
      }

      const fleetData = await fleetResponse.json();
      const routesData = await routesResponse.json();

      fleet = Array.isArray(fleetData)
        ? fleetData
        : fleetData.fleet || [];

      let rawFlights = routesData;

      if (Array.isArray(routesData.routes)) {
        rawFlights = routesData.routes;
      } else if (Array.isArray(routesData.flights)) {
        rawFlights = routesData.flights;
      } else if (Array.isArray(routesData.schedule)) {
        rawFlights = routesData.schedule;
      }

      if (!Array.isArray(rawFlights)) {
        throw new Error("routes.json does not contain a valid flight array.");
      }

      flights = rawFlights
        .map(normaliseFlight)
        .filter((flight) => {
          return (
            flight.origin &&
            flight.destination &&
            flight.departure &&
            flight.arrival
          );
        });

      renderAircraft();

      clearStatus();

      console.log(
        `Bula Air booking: loaded ${fleet.length} aircraft types and ${flights.length} flights.`
      );

    } catch (error) {
      console.error("Bula Air booking error:", error);

      setStatus(
        "Unable to load the Bula Air booking data. Check fleet.json and routes.json.",
        true
      );
    }
  }

  /*
   * =========================================================
   * STEP MANAGEMENT
   * =========================================================
   */

  function showStep(step) {
    document
      .querySelectorAll(".booking-step")
      .forEach((section) => {
        section.classList.remove("active");
      });

    const target = $(`#step-${step}`);

    if (target) {
      target.classList.add("active");
    }

    updateProgress(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function updateProgress(step) {
    const stepMap = {
      aircraft: 1,
      route: 2,
      date: 3,
      fare: 4,
      details: 5,
      success: 5
    };

    const current = stepMap[step] || 1;

    document
      .querySelectorAll(".progress-item")
      .forEach((item) => {
        const number = Number(item.dataset.progress);

        item.classList.remove("active", "complete");

        if (number === current) {
          item.classList.add("active");
        }

        if (number < current) {
          item.classList.add("complete");
        }
      });
  }

  /*
   * =========================================================
   * STEP 1 — AIRCRAFT
   * =========================================================
   */

  function renderAircraft() {
    elements.aircraftGrid.innerHTML = "";

    const usableFleet = fleet.filter(
      (aircraft) => Number(aircraft.fleetCount || 0) > 0
    );

    usableFleet.forEach((aircraft) => {
      const name = normaliseAircraft(
        aircraft.model || aircraft.id
      );

      const card = document.createElement("article");

      card.className = "aircraft-card";

      card.innerHTML = `
        <div class="aircraft-image">
          <img
            src="${escapeHtml(aircraft.image || "")}"
            alt="${escapeHtml(name)}"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="aircraft-info">

          <h3>${escapeHtml(name)}</h3>

          <p>
            ${escapeHtml(
              aircraft.notes ||
              aircraft.type ||
              "Bula Air aircraft"
            )}
          </p>

          <div class="aircraft-meta">

            <span class="booking-pill">
              ${Number(aircraft.capacity || 0)} seats
            </span>

            <span class="booking-pill">
              ${Number(aircraft.range || 0).toLocaleString()} km
            </span>

            <span class="booking-pill">
              ${Number(aircraft.fleetCount || 0)} aircraft
            </span>

          </div>

        </div>
      `;

      card.addEventListener("click", () => {
        chooseAircraft(aircraft);
      });

      elements.aircraftGrid.appendChild(card);
    });
  }

  function chooseAircraft(aircraft) {
    selectedAircraft = aircraft;

    document
      .querySelectorAll(".aircraft-card")
      .forEach((card) => {
        card.classList.remove("selected");
      });

    const matchingName = normaliseAircraft(
      aircraft.model || aircraft.id
    );

    const cards = [
      ...document.querySelectorAll(".aircraft-card")
    ];

    const selectedCard = cards.find((card) =>
      card.querySelector("h3")?.textContent === matchingName
    );

    if (selectedCard) {
      selectedCard.classList.add("selected");
    }

    renderRoutesForAircraft();

    showStep("route");
  }

  /*
   * =========================================================
   * STEP 2 — ROUTES
   * =========================================================
   */

  function renderRoutesForAircraft() {
    elements.routeGrid.innerHTML = "";

    if (!selectedAircraft) {
      return;
    }

    const aircraftName = normaliseAircraft(
      selectedAircraft.model ||
      selectedAircraft.id
    );

    const matchingFlights = flights
      .filter((flight) => {
        return normaliseAircraft(flight.aircraft) === aircraftName;
      })
      .sort((a, b) => {
        if (a.origin !== b.origin) {
          return a.origin.localeCompare(b.origin);
        }

        if (a.destination !== b.destination) {
          return a.destination.localeCompare(b.destination);
        }

        return a.departure.localeCompare(b.departure);
      });

    elements.routeDescription.textContent =
      `${matchingFlights.length} scheduled service${
        matchingFlights.length === 1 ? "" : "s"
      } operated by ${aircraftName}.`;

    if (!matchingFlights.length) {
      elements.routeGrid.innerHTML = `
        <div class="booking-status error">
          No scheduled routes currently use the ${escapeHtml(
            aircraftName
          )}.
        </div>
      `;

      return;
    }

    matchingFlights.forEach((flight) => {
      const card = document.createElement("article");

      card.className = "route-card";

      card.innerHTML = `
        <div>

          <div class="route-flight-number">
            ${escapeHtml(flight.flightNumber)}
          </div>

          <div class="route-main">

            <div>
              <div class="airport-code">
                ${escapeHtml(flight.origin)}
              </div>

              <div class="route-time">
                ${escapeHtml(flight.departure)}
              </div>
            </div>

            <div class="route-arrow">
              →
            </div>

            <div>
              <div class="airport-code">
                ${escapeHtml(flight.destination)}
              </div>

              <div class="route-time">
                ${escapeHtml(flight.arrival)}
                ${
                  flight.arrivalDayOffset > 0
                    ? ` +${flight.arrivalDayOffset}`
                    : ""
                }
              </div>
            </div>

          </div>

          <div class="route-details">

            <span class="booking-pill">
              ${escapeHtml(flight.duration)}
            </span>

            <span class="booking-pill">
              ${flight.days === "MTWTFSS" ? "Daily" : escapeHtml(flight.days)}
            </span>

          </div>

        </div>

        <div class="route-price">

          <small>Economy from</small>

          <strong>
            ${formatMoney(flight.fare)}
          </strong>

          <button
            type="button"
            class="button button-primary"
          >
            Choose
          </button>

        </div>
      `;

      card.addEventListener("click", () => {
        chooseRoute(flight);
      });

      elements.routeGrid.appendChild(card);
    });
  }

  function chooseRoute(flight) {
    selectedRoute = flight;

    document
      .querySelectorAll(".route-card")
      .forEach((card) => {
        card.classList.remove("selected");
      });

    const cards = [
      ...document.querySelectorAll(".route-card")
    ];

    const selectedCard = cards.find((card) =>
      card.querySelector(".route-flight-number")?.textContent.trim() ===
      flight.flightNumber
    );

    if (selectedCard) {
      selectedCard.classList.add("selected");
    }

    elements.dateDescription.textContent =
      `${flight.origin} → ${flight.destination} on flight ${flight.flightNumber}.`;

    showStep("date");
  }

  /*
   * =========================================================
   * STEP 3 — DATE
   * =========================================================
   */

  function continueFromDate() {
    if (!selectedRoute) {
      setStatus("Please choose a route first.", true);
      return;
    }

    const date = elements.travelDate.value;

    if (!date) {
      setStatus("Please choose a departure date.", true);
      return;
    }

    if (!flightOperatesOnDate(selectedRoute, date)) {
      setStatus(
        `Flight ${selectedRoute.flightNumber} does not operate on ${formatDate(date)}.`,
        true
      );

      return;
    }

    selectedDate = date;

    calculateFare();

    showStep("fare");
  }

  function getDayCode(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    const day = date.getDay();

    return ["S", "M", "T", "W", "T", "F", "S"][day];
  }

  function flightOperatesOnDate(flight, date) {
    const dayCode = getDayCode(date);

    const days = String(flight.days || "")
      .replace(/\s/g, "")
      .toUpperCase();

    if (days === "MTWTFSS") {
      return true;
    }

    if (/^[1-7]+$/.test(days)) {
      const numericDays = {
        M: "1",
        T: "2",
        W: "3",
        R: "4",
        F: "5",
        S: "6",
        U: "7"
      };

      return days.includes(
        numericDays[dayCode] || ""
      );
    }

    return days.includes(dayCode);
  }

  /*
   * =========================================================
   * STEP 4 — PRICING
   * =========================================================
   *
   * Economy = base fare
   * Premium Economy = +50%
   * Business = +125%
   * First = +250%
   *
   * Passenger count multiplies the cabin fare.
   */

  function getCabinMultiplier(cabin) {
    switch (cabin) {
      case "premium-economy":
        return 1.5;

      case "business":
        return 2.25;

      case "first":
        return 3.5;

      case "economy":
      default:
        return 1;
    }
  }

  function getCabinName(cabin) {
    const names = {
      economy: "Economy",
      "premium-economy": "Premium Economy",
      business: "Business",
      first: "First Class"
    };

    return names[cabin] || "Economy";
  }

  function calculateFare() {
    if (!selectedRoute || !selectedDate) {
      return;
    }

    const passengers =
      Number(elements.farePassengerCount.value || 1);

    const cabin =
      elements.fareCabin.value || "economy";

    const baseFare = Number(selectedRoute.fare || 0);

    const cabinFare =
      baseFare * getCabinMultiplier(cabin);

    const total =
      cabinFare * passengers;

    elements.fareRouteTitle.textContent =
      `${selectedRoute.origin} → ${selectedRoute.destination}`;

    elements.fareAircraft.textContent =
      selectedRoute.aircraft;

    elements.fareDeparture.textContent =
      selectedRoute.departure;

    elements.fareArrival.textContent =
      selectedRoute.arrival;

    elements.fareDate.textContent =
      formatDate(selectedDate);

    elements.fareCabinDisplay.textContent =
      getCabinName(cabin);

    elements.farePassengers.textContent =
      `${passengers}`;

    elements.fareBase.textContent =
      formatMoney(cabinFare);

    elements.fareTotal.textContent =
      formatMoney(total);
  }

  /*
   * =========================================================
   * STEP 5 — PASSENGER DETAILS
   * =========================================================
   */

  function continueToDetails() {
    calculateFare();
    showStep("details");
  }

  /*
   * =========================================================
   * CONFIRM BOOKING
   * =========================================================
   */

  function confirmBooking(event) {
    event.preventDefault();

    if (!selectedRoute || !selectedDate) {
      setStatus(
        "Your flight information is incomplete.",
        true
      );

      return;
    }

    const familyName =
      elements.familyName.value.trim();

    const email =
      elements.email.value.trim();

    const phone =
      elements.phone.value.trim();

    if (!familyName || !email) {
      setStatus(
        "Please enter the passenger / family name and email.",
        true
      );

      return;
    }

    const passengers =
      Number(elements.farePassengerCount.value || 1);

    const cabin =
      elements.fareCabin.value || "economy";

    const cabinFare =
      Number(selectedRoute.fare || 0) *
      getCabinMultiplier(cabin);

    const totalFare =
      cabinFare * passengers;

    const bookingReference =
      generateBookingReference();

    const booking = {
      bookingReference,

      createdAt:
        new Date().toISOString(),

      passengerFamilyName:
        familyName,

      email,

      phone,

      passengers,

      cabin,

      date:
        selectedDate,

      flight:
        selectedRoute,

      aircraft:
        selectedAircraft,

      totalFare,

      seats: []
    };

    localStorage.setItem(
      "bulaAirBooking",
      JSON.stringify(booking)
    );

    localStorage.setItem(
      "bulaAirSelectedFlight",
      JSON.stringify({
        flight: selectedRoute,
        aircraft: selectedAircraft,
        date: selectedDate,
        passengers,
        cabin
      })
    );

    renderSuccess(booking);

    showStep("success");
  }

  /*
   * =========================================================
   * SUCCESS SCREEN
   * =========================================================
   */

  function renderSuccess(booking) {
    elements.successReference.textContent =
      booking.bookingReference;

    elements.successName.textContent =
      booking.passengerFamilyName;

    elements.successFlight.textContent =
      booking.flight.flightNumber;

    elements.successAircraft.textContent =
      booking.flight.aircraft;

    elements.successRoute.textContent =
      `${booking.flight.origin} → ${booking.flight.destination}`;

    elements.successDate.textContent =
      formatDate(booking.date);

    elements.successCabin.textContent =
      getCabinName(booking.cabin);

    elements.successPassengers.textContent =
      booking.passengers;

    elements.successTotal.textContent =
      formatMoney(booking.totalFare);
  }

  /*
   * =========================================================
   * BOOKING REFERENCE
   * =========================================================
   */

  function generateBookingReference() {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "BA";

    for (let i = 0; i < 6; i++) {
      result += chars[
        Math.floor(Math.random() * chars.length)
      ];
    }

    return result;
  }

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  function formatMoney(value) {
    return `$${Number(value || 0).toLocaleString(
      "en-NZ",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    )}`;
  }

  function formatDate(value) {
    if (!value) return "";

    const date =
      new Date(`${value}T12:00:00`);

    return date.toLocaleDateString(
      "en-NZ",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setStatus(message, error = false) {
    elements.status.hidden = false;

    elements.status.className =
      `booking-status${error ? " error" : ""}`;

    elements.status.textContent = message;
  }

  function clearStatus() {
    elements.status.hidden = true;
    elements.status.textContent = "";
  }

  /*
   * =========================================================
   * BUTTON EVENTS
   * =========================================================
   */

  $("#back-aircraft").addEventListener("click", () => {
    showStep("aircraft");
  });

  $("#back-route").addEventListener("click", () => {
    showStep("route");
  });

  $("#back-date").addEventListener("click", () => {
    showStep("date");
  });

  $("#back-fare").addEventListener("click", () => {
    showStep("fare");
  });

  $("#continue-date").addEventListener(
    "click",
    continueFromDate
  );

  $("#continue-details").addEventListener(
    "click",
    continueToDetails
  );

  elements.farePassengerCount.addEventListener(
    "change",
    calculateFare
  );

  elements.fareCabin.addEventListener(
    "change",
    calculateFare
  );

  elements.passengerForm.addEventListener(
    "submit",
    confirmBooking
  );

  /*
   * =========================================================
   * DATE SETUP
   * =========================================================
   */

  const today = new Date();

  const localToday =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  elements.travelDate.min =
    localToday;

  elements.travelDate.value =
    localToday;

  /*
   * =========================================================
   * START
   * =========================================================
   */

  loadData();

})();