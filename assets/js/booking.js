"use strict";

/*
 * ============================================================
 * BULA AIR BOOKING SYSTEM
 * ============================================================
 *
 * Flow:
 * Aircraft → Route → Date → Fare → Details → Confirmation
 *
 * Data:
 * ../data/fleet.json
 * ../data/routes.json
 * ============================================================
 */

const ROUTES_URL = "../data/routes.json";
const FLEET_URL = "../data/fleet.json";


/* ============================================================
   STATE
============================================================ */

const state = {
  fleet: [],
  routes: [],
  aircraft: null,
  flight: null,
  travelDate: null,
  passengers: 1,
  cabin: "economy",
  booking: null
};


/* ============================================================
   DOM
============================================================ */

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
  fareCabinDisplay: $("#fare-cabin-display"),
  farePassengers: $("#fare-passengers"),
  fareBase: $("#fare-base"),
  fareTotal: $("#fare-total"),

  passengerForm: $("#passenger-form"),
  familyName: $("#family-name"),
  contactEmail: $("#contact-email"),
  contactPhone: $("#contact-phone"),

  successReference: $("#success-reference"),
  successName: $("#success-name"),
  successFlight: $("#success-flight"),
  successAircraft: $("#success-aircraft"),
  successRoute: $("#success-route"),
  successDate: $("#success-date"),
  successCabin: $("#success-cabin"),
  successPassengers: $("#success-passengers"),
  successTotal: $("#success-total"),

  backAircraft: $("#back-aircraft"),
  backRoute: $("#back-route"),
  backDate: $("#back-date"),
  backFare: $("#back-fare"),

  continueDate: $("#continue-date"),
  continueDetails: $("#continue-details")
};


/* ============================================================
   STATUS
============================================================ */

function setStatus(message, type) {
  if (!elements.status) {
    return;
  }

  elements.status.textContent = message || "";
  elements.status.hidden = !message;

  elements.status.classList.toggle(
    "error",
    type === "error"
  );
}


/* ============================================================
   AIRCRAFT NORMALISATION
============================================================ */

function normaliseAircraft(value) {
  if (!value) {
    return "";
  }

  const raw = String(value).trim();

  const aliases = {
    "A220-300": "Airbus A220-300",
    "Airbus A220-300": "Airbus A220-300",

    "A320neo": "Airbus A320neo",
    "Airbus A320neo": "Airbus A320neo",

    "A321neo": "Airbus A321neo",
    "Airbus A321neo": "Airbus A321neo",

    "A321-200": "Airbus A321-200",
    "Airbus A321-200": "Airbus A321-200",

    "A321XLR": "Airbus A321XLR",
    "Airbus A321XLR": "Airbus A321XLR",

    "A330neo": "Airbus A330-900",
    "A330-900neo": "Airbus A330-900",
    "A330-900": "Airbus A330-900",
    "Airbus A330-900": "Airbus A330-900",

    "A350-900": "Airbus A350-900",
    "Airbus A350-900": "Airbus A350-900",

    "A350-1000": "Airbus A350-1000",
    "Airbus A350-1000": "Airbus A350-1000",

    "A350-1000ULR": "Airbus A350-1000ULR",
    "Airbus A350-1000ULR": "Airbus A350-1000ULR",

    "A380": "Airbus A380-800",
    "A380-800": "Airbus A380-800",
    "Airbus A380-800": "Airbus A380-800",

    "777-9": "Boeing 777-9",
    "Boeing 777-9": "Boeing 777-9",
    "777X": "Boeing 777-9",
    "Boeing 777X": "Boeing 777-9",

    "ATR72": "ATR 72-600",
    "ATR72-600": "ATR 72-600",
    "ATR 72-600": "ATR 72-600"
  };

  return aliases[raw] || raw;
}


/* ============================================================
   FIND AIRCRAFT IN ROUTE
============================================================ */

function findAircraftIndex(route) {
  if (!Array.isArray(route)) {
    return -1;
  }

  for (let i = 0; i < route.length; i += 1) {
    const value = route[i];

    if (typeof value !== "string") {
      continue;
    }

    const aircraft = normaliseAircraft(value);

    if (
      aircraft.startsWith("Airbus ") ||
      aircraft.startsWith("Boeing ") ||
      aircraft.startsWith("ATR ")
    ) {
      return i;
    }
  }

  return -1;
}


/* ============================================================
   NORMALISE ROUTE
============================================================ */

function normaliseFlight(raw) {
  if (!Array.isArray(raw) || raw.length < 8) {
    return null;
  }

  const flightNumber = raw[0];
  const origin = raw[1];
  const destination = raw[2];
  const departure = raw[3];
  const arrival = raw[4];
  const arrivalDayOffset = Number.isFinite(Number(raw[5]))
    ? Number(raw[5])
    : 0;

  const duration = raw[6];

  const aircraftIndex = findAircraftIndex(raw);

  if (aircraftIndex === -1) {
    return null;
  }

  const aircraft = normaliseAircraft(raw[aircraftIndex]);

  let days = "";
  let fare = null;

  for (let i = aircraftIndex + 1; i < raw.length; i += 1) {
    const value = raw[i];

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      fare = Number(value);
      continue;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) {
        continue;
      }

      if (
        !Number.isNaN(Number(trimmed)) &&
        trimmed !== ""
      ) {
        fare = Number(trimmed);
      } else {
        days = trimmed;
      }
    }
  }

  if (!days) {
    days = "MTWTFSS";
  }

  if (
    !flightNumber ||
    !origin ||
    !destination ||
    !departure ||
    !arrival ||
    !Number.isFinite(fare)
  ) {
    return null;
  }

  return {
    flightNumber: String(flightNumber),
    origin: String(origin).toUpperCase(),
    destination: String(destination).toUpperCase(),
    departure: String(departure),
    arrival: String(arrival),
    arrivalDayOffset,
    duration: duration ? String(duration) : "",
    days,
    aircraft,
    fare
  };
}


/* ============================================================
   NORMALISE FLEET AIRCRAFT
============================================================ */

function normaliseFleetAircraft(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const model = normaliseAircraft(
    raw.model ||
    raw.aircraft ||
    raw.name ||
    raw.type
  );

  if (!model) {
    return null;
  }

  return {
    ...raw,
    model,
    fleetCount: Number(raw.fleetCount) || 0,
    capacity: Number(raw.capacity) || 0,
    range: Number(raw.range) || 0,
    image: raw.image ? String(raw.image) : ""
  };
}


/* ============================================================
   LOAD DATA
============================================================ */

async function loadData() {
  setStatus("Loading Bula Air booking data...");

  try {
    const cacheVersion = Date.now();

    const fleetResponse = await fetch(
      `${FLEET_URL}?v=${cacheVersion}`,
      {
        cache: "no-store"
      }
    );

    if (!fleetResponse.ok) {
      throw new Error(
        `fleet.json returned HTTP ${fleetResponse.status}`
      );
    }

    const routesResponse = await fetch(
      `${ROUTES_URL}?v=${cacheVersion}`,
      {
        cache: "no-store"
      }
    );

    if (!routesResponse.ok) {
      throw new Error(
        `routes.json returned HTTP ${routesResponse.status}`
      );
    }

    const fleetData = await fleetResponse.json();
    const routesData = await routesResponse.json();

    if (!Array.isArray(fleetData)) {
      throw new Error("fleet.json is not an array.");
    }

    if (!Array.isArray(routesData)) {
      throw new Error("routes.json is not an array.");
    }

    state.fleet = fleetData
      .map(normaliseFleetAircraft)
      .filter(Boolean);

    state.routes = routesData
      .map(normaliseFlight)
      .filter(Boolean);

    if (state.fleet.length === 0) {
      throw new Error(
        "No usable aircraft were found in fleet.json."
      );
    }

    if (state.routes.length === 0) {
      throw new Error(
        "No usable routes were found in routes.json."
      );
    }

    renderAircraft();

    setStatus("");
  } catch (error) {
    console.error("Bula Air booking error:", error);

    setStatus(
      `Booking data could not be loaded. ${error.message}`,
      "error"
    );
  }
}


/* ============================================================
   STEP CONTROL
============================================================ */

function showStep(name) {
  document
    .querySelectorAll(".booking-step")
    .forEach((step) => {
      step.classList.remove("active");
    });

  const target = document.querySelector(
    `#step-${name}`
  );

  if (target) {
    target.classList.add("active");
  }

  updateProgress(name);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ============================================================
   PROGRESS
============================================================ */

function updateProgress(stepName) {
  const numbers = {
    aircraft: 1,
    route: 2,
    date: 3,
    fare: 4,
    details: 5,
    success: 5
  };

  const current = numbers[stepName] || 1;

  document
    .querySelectorAll(".progress-item")
    .forEach((item) => {
      const number = Number(
        item.dataset.progress
      );

      item.classList.remove(
        "active",
        "complete"
      );

      if (number === current) {
        item.classList.add("active");
      } else if (number < current) {
        item.classList.add("complete");
      }
    });
}


/* ============================================================
   AIRCRAFT RENDERING
============================================================ */

function renderAircraft() {
  if (!elements.aircraftGrid) {
    throw new Error(
      "booking.html is missing #aircraft-grid."
    );
  }

  elements.aircraftGrid.innerHTML = "";

  state.fleet.forEach((aircraft) => {
    const card = document.createElement("article");

    card.className = "aircraft-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    let imageHTML = "";

    if (aircraft.image) {
      imageHTML = `
        <div class="aircraft-image">
          <img
            src="${escapeAttribute(aircraft.image)}"
            alt="${escapeAttribute(aircraft.model)}"
            loading="lazy"
          >
        </div>
      `;
    } else {
      imageHTML = `
        <div class="aircraft-image">
          <strong>${escapeHtml(aircraft.model)}</strong>
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHTML}

      <div class="aircraft-info">
        <h3>${escapeHtml(aircraft.model)}</h3>

        <p>
          Bula Air fleet aircraft
        </p>

        <div class="aircraft-meta">

          <span class="booking-pill">
            ${aircraft.capacity || "—"} seats
          </span>

          <span class="booking-pill">
            ${
              aircraft.range
                ? `${aircraft.range.toLocaleString()} km range`
                : "Range unavailable"
            }
          </span>

          <span class="booking-pill">
            ${aircraft.fleetCount || "—"} aircraft
          </span>

        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      selectAircraft(aircraft, card);
    });

    card.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        selectAircraft(aircraft, card);
      }
    });

    elements.aircraftGrid.appendChild(card);
  });
}


/* ============================================================
   SELECT AIRCRAFT
============================================================ */

function selectAircraft(aircraft, card) {
  state.aircraft = aircraft;
  state.flight = null;
  state.travelDate = null;

  document
    .querySelectorAll(".aircraft-card")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  card.classList.add("selected");

  renderRoutes();
  showStep("route");
}


/* ============================================================
   GET ROUTES FOR AIRCRAFT
============================================================ */

function getRoutesForAircraft() {
  if (!state.aircraft) {
    return [];
  }

  const selected = normaliseAircraft(
    state.aircraft.model
  );

  return state.routes.filter((route) => {
    return (
      normaliseAircraft(route.aircraft) === selected
    );
  });
}


/* ============================================================
   ROUTE RENDERING
============================================================ */

function renderRoutes() {
  if (!elements.routeGrid) {
    throw new Error(
      "booking.html is missing #route-grid."
    );
  }

  const routes = getRoutesForAircraft();

  elements.routeGrid.innerHTML = "";

  if (elements.routeDescription) {
    elements.routeDescription.textContent =
      `${routes.length} route${
        routes.length === 1 ? "" : "s"
      } operated by ${state.aircraft.model}.`;
  }

  if (routes.length === 0) {
    elements.routeGrid.innerHTML = `
      <div class="booking-empty">
        <strong>No routes currently available</strong>

        <p>
          Bula Air does not currently have a route
          assigned to this aircraft in routes.json.
        </p>
      </div>
    `;

    return;
  }

  routes.forEach((route) => {
    const card = document.createElement("article");

    card.className = "route-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.innerHTML = `
      <div>

        <div class="route-flight-number">
          ${escapeHtml(route.flightNumber)}
        </div>

        <div class="route-main">

          <div>
            <div class="airport-code">
              ${escapeHtml(route.origin)}
            </div>

            <div class="route-time">
              Departure ${escapeHtml(route.departure)}
            </div>
          </div>

          <div class="route-arrow">
            →
          </div>

          <div>
            <div class="airport-code">
              ${escapeHtml(route.destination)}
            </div>

            <div class="route-time">
              Arrival ${escapeHtml(route.arrival)}
            </div>
          </div>

        </div>

        <div class="route-details">

          <span class="booking-pill">
            ${escapeHtml(route.duration)}
          </span>

          <span class="booking-pill">
            ${escapeHtml(route.aircraft)}
          </span>

          <span class="booking-pill">
            ${escapeHtml(route.days)}
          </span>

        </div>

      </div>

      <div class="route-price">

        <small>From</small>

        <strong>
          ${formatCurrency(route.fare)}
        </strong>

        <small>
          per passenger
        </small>

      </div>
    `;

    card.addEventListener("click", () => {
      selectRoute(route, card);
    });

    card.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        selectRoute(route, card);
      }
    });

    elements.routeGrid.appendChild(card);
  });
}


/* ============================================================
   SELECT ROUTE
============================================================ */

function selectRoute(route, card) {
  state.flight = route;
  state.travelDate = null;

  document
    .querySelectorAll(".route-card")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  card.classList.add("selected");

  if (elements.dateDescription) {
    elements.dateDescription.textContent =
      `${route.flightNumber}: ${
        route.origin
      } → ${
        route.destination
      } · ${route.duration}`;
  }

  if (elements.travelDate) {
    elements.travelDate.value = "";
    elements.travelDate.min = getTodayString();
  }

  showStep("date");
}


/* ============================================================
   DATE
============================================================ */

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return String(dateString);
  }

  return new Intl.DateTimeFormat(
    "en-NZ",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}


function routeOperatesOnDate(route, dateString) {
  if (!route || !dateString) {
    return false;
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const jsDay = date.getDay();

  const dayIndex =
    jsDay === 0
      ? 6
      : jsDay - 1;

  const days = String(
    route.days || ""
  )
    .toUpperCase()
    .replace(/\s/g, "");

  if (!days || days === "MTWTFSS") {
    return true;
  }

  if (
    days.includes(
      String(dayIndex)
    )
  ) {
    return true;
  }

  const dayLetters = "MTWTFSS";

  return days.includes(
    dayLetters[dayIndex]
  );
}


function validateDate() {
  if (!state.flight) {
    setStatus(
      "Please choose a route first.",
      "error"
    );

    return false;
  }

  const date = elements.travelDate
    ? elements.travelDate.value
    : "";

  if (!date) {
    setStatus(
      "Please choose a travel date.",
      "error"
    );

    return false;
  }

  if (date < getTodayString()) {
    setStatus(
      "Please choose a date from today onwards.",
      "error"
    );

    return false;
  }

  if (
    !routeOperatesOnDate(
      state.flight,
      date
    )
  ) {
    setStatus(
      `Flight ${state.flight.flightNumber} does not operate on that day.`,
      "error"
    );

    return false;
  }

  state.travelDate = date;

  setStatus("");

  return true;
}


/* ============================================================
   FARE
============================================================ */

const CABIN_MULTIPLIERS = {
  economy: 1,
  "premium-economy": 1.5,
  business: 2.25,
  first: 3.5
};

const CABIN_NAMES = {
  economy: "Economy",
  "premium-economy": "Premium Economy",
  business: "Business",
  first: "First Class"
};


function getBaseFare() {
  if (!state.flight) {
    return 0;
  }

  return Number(
    state.flight.fare
  ) || 0;
}


function getTotalFare() {
  const base = getBaseFare();

  const multiplier =
    CABIN_MULTIPLIERS[state.cabin] || 1;

  return Math.round(
    base *
    multiplier *
    state.passengers
  );
}


function updateFare() {
  if (!state.flight) {
    return;
  }

  const base = getBaseFare();
  const total = getTotalFare();

  const cabinName =
    CABIN_NAMES[state.cabin] ||
    "Economy";

  if (elements.fareRouteTitle) {
    elements.fareRouteTitle.textContent =
      `${state.flight.origin} → ${state.flight.destination}`;
  }

  if (elements.fareAircraft) {
    elements.fareAircraft.textContent =
      state.flight.aircraft;
  }

  if (elements.fareDeparture) {
    elements.fareDeparture.textContent =
      state.flight.departure;
  }

  if (elements.fareArrival) {
    elements.fareArrival.textContent =
      state.flight.arrival;
  }

  if (elements.fareDate) {
    elements.fareDate.textContent =
      formatDate(state.travelDate);
  }

  if (elements.fareCabinDisplay) {
    elements.fareCabinDisplay.textContent =
      cabinName;
  }

  if (elements.farePassengers) {
    elements.farePassengers.textContent =
      String(state.passengers);
  }

  if (elements.fareBase) {
    elements.fareBase.textContent =
      `${formatCurrency(base)} × ${state.passengers}`;
  }

  if (elements.fareTotal) {
    elements.fareTotal.textContent =
      formatCurrency(total);
  }
}


/* ============================================================
   DATE → FARE
============================================================ */

function continueFromDate() {
  if (!validateDate()) {
    return;
  }

  state.passengers = Number(
    elements.farePassengerCount
      ? elements.farePassengerCount.value
      : 1
  ) || 1;

  state.cabin =
    elements.fareCabin
      ? elements.fareCabin.value
      : "economy";

  updateFare();

  showStep("fare");
}


/* ============================================================
   PASSENGER / CABIN CHANGES
============================================================ */

function updatePassengerCount() {
  state.passengers = Number(
    elements.farePassengerCount
      ? elements.farePassengerCount.value
      : 1
  ) || 1;

  updateFare();
}


function updateCabin() {
  state.cabin =
    elements.fareCabin
      ? elements.fareCabin.value
      : "economy";

  updateFare();
}


/* ============================================================
   FARE → DETAILS
============================================================ */

function continueToDetails() {
  if (
    !state.flight ||
    !state.travelDate
  ) {
    setStatus(
      "Please complete your flight and date selection first.",
      "error"
    );

    return;
  }

  updateFare();

  showStep("details");
}


/* ============================================================
   BACK BUTTONS
============================================================ */

function backToAircraft() {
  showStep("aircraft");
}


function backToRoute() {
  showStep("route");
}


function backToDate() {
  showStep("date");
}


function backToFare() {
  showStep("fare");
}


/* ============================================================
   CONFIRM BOOKING
============================================================ */

function confirmBooking(event) {
  event.preventDefault();

  if (
    !state.flight ||
    !state.travelDate
  ) {
    setStatus(
      "Your flight selection is incomplete.",
      "error"
    );

    return;
  }

  const familyName =
    elements.familyName
      ? elements.familyName.value.trim()
      : "";

  const email =
    elements.contactEmail
      ? elements.contactEmail.value.trim()
      : "";

  const phone =
    elements.contactPhone
      ? elements.contactPhone.value.trim()
      : "";

  if (!familyName) {
    setStatus(
      "Please enter the passenger or family name.",
      "error"
    );

    if (elements.familyName) {
      elements.familyName.focus();
    }

    return;
  }

  if (!email) {
    setStatus(
      "Please enter an email address.",
      "error"
    );

    if (elements.contactEmail) {
      elements.contactEmail.focus();
    }

    return;
  }

  const total = getTotalFare();

  state.booking = {
    reference: generateBookingReference(),

    familyName,
    email,
    phone,

    flightNumber:
      state.flight.flightNumber,

    aircraft:
      state.flight.aircraft,

    origin:
      state.flight.origin,

    destination:
      state.flight.destination,

    departure:
      state.flight.departure,

    arrival:
      state.flight.arrival,

    duration:
      state.flight.duration,

    travelDate:
      state.travelDate,

    cabin:
      state.cabin,

    cabinName:
      CABIN_NAMES[state.cabin] ||
      "Economy",

    passengers:
      state.passengers,

    total
  };

  saveBooking();
  renderSuccess();

  showStep("success");

  setStatus("");
}


/* ============================================================
   SUCCESS
============================================================ */

function renderSuccess() {
  const booking = state.booking;

  if (!booking) {
    return;
  }

  if (elements.successReference) {
    elements.successReference.textContent =
      booking.reference;
  }

  if (elements.successName) {
    elements.successName.textContent =
      booking.familyName;
  }

  if (elements.successFlight) {
    elements.successFlight.textContent =
      booking.flightNumber;
  }

  if (elements.successAircraft) {
    elements.successAircraft.textContent =
      booking.aircraft;
  }

  if (elements.successRoute) {
    elements.successRoute.textContent =
      `${booking.origin} → ${booking.destination}`;
  }

  if (elements.successDate) {
    elements.successDate.textContent =
      formatDate(booking.travelDate);
  }

  if (elements.successCabin) {
    elements.successCabin.textContent =
      booking.cabinName;
  }

  if (elements.successPassengers) {
    elements.successPassengers.textContent =
      String(booking.passengers);
  }

  if (elements.successTotal) {
    elements.successTotal.textContent =
      formatCurrency(booking.total);
  }
}


/* ============================================================
   SAVE BOOKING
============================================================ */

function saveBooking() {
  try {
    localStorage.setItem(
      "bulaAirBooking",
      JSON.stringify(state.booking)
    );

    localStorage.setItem(
      "bulaAirSelectedFlight",
      JSON.stringify(state.flight)
    );
  } catch (error) {
    console.warn(
      "Unable to save booking:",
      error
    );
  }
}


/* ============================================================
   BOOKING REFERENCE
============================================================ */

function generateBookingReference() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let reference = "BA";

  for (let i = 0; i < 6; i += 1) {
    reference +=
      characters[
        Math.floor(
          Math.random() *
          characters.length
        )
      ];
  }

  return reference;
}


/* ============================================================
   CURRENCY
============================================================ */

function formatCurrency(amount) {
  const number = Number(amount) || 0;

  return new Intl.NumberFormat(
    "en-NZ",
    {
      style: "currency",
      currency: "FJD",
      maximumFractionDigits: 0
    }
  ).format(number);
}


/* ============================================================
   HTML SAFETY
============================================================ */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
  return escapeHtml(value);
}


/* ============================================================
   EVENTS
============================================================ */

function setupEvents() {
  if (elements.continueDate) {
    elements.continueDate.addEventListener(
      "click",
      continueFromDate
    );
  }

  if (elements.continueDetails) {
    elements.continueDetails.addEventListener(
      "click",
      continueToDetails
    );
  }

  if (elements.backAircraft) {
    elements.backAircraft.addEventListener(
      "click",
      backToAircraft
    );
  }

  if (elements.backRoute) {
    elements.backRoute.addEventListener(
      "click",
      backToRoute
    );
  }

  if (elements.backDate) {
    elements.backDate.addEventListener(
      "click",
      backToDate
    );
  }

  if (elements.backFare) {
    elements.backFare.addEventListener(
      "click",
      backToFare
    );
  }

  if (elements.farePassengerCount) {
    elements.farePassengerCount.addEventListener(
      "change",
      updatePassengerCount
    );
  }

  if (elements.fareCabin) {
    elements.fareCabin.addEventListener(
      "change",
      updateCabin
    );
  }

  if (elements.passengerForm) {
    elements.passengerForm.addEventListener(
      "submit",
      confirmBooking
    );
  }
}


/* ============================================================
   START
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    setupEvents();
    loadData();
  }
);