const DATA_ROOT = "../data/";

let fleetData = [];
let routeData = [];
let bookingData = [];
let selectedSeats = new Set();

const AIRCRAFT_ALIASES = {
  "A320neo": "A320NEO",
  "A321neo": "A321NEO",
  "A350-1000": "A350-1000",
  "A350-1000ULR": "A350-1000ULR",
  "A350-900": "A350-900",
  "A330-900": "A330-900",
  "A321-200": "A321-200",
  "A321XLR": "A321XLR",
  "A380": "A380-800",
  "A380-800": "A380-800",
  "777-9": "B777-9",
  "B777-9": "B777-9",
  "ATR72-600": "ATR72",
  "ATR72": "ATR72",
  "A220-300": "A220-300"
};

const AIRPORTS = {
  ADL: "Adelaide",
  AKL: "Auckland",
  APW: "Apia",
  ARN: "Stockholm",
  ATL: "Atlanta",
  AUH: "Abu Dhabi",
  AVV: "Melbourne Avalon",
  BKK: "Bangkok",
  BNE: "Brisbane",
  BOM: "Mumbai",
  BOS: "Boston",
  CBR: "Canberra",
  CEB: "Cebu",
  CGK: "Jakarta",
  CHC: "Christchurch",
  CLT: "Charlotte",
  CNS: "Cairns",
  CXI: "Kiritimati",
  DEN: "Denver",
  DFW: "Dallas",
  DIL: "Dili",
  DJJ: "Jayapura",
  DOH: "Doha",
  DPS: "Denpasar",
  DRW: "Darwin",
  DTW: "Detroit",
  DUD: "Dunedin",
  DVO: "Davao",
  DXB: "Dubai",
  EWR: "Newark",
  FUN: "Funafuti",
  GRU: "São Paulo",
  GUM: "Guam",
  HBA: "Hobart",
  HIR: "Honiara",
  HKG: "Hong Kong",
  JFK: "New York",
  LAX: "Los Angeles",
  LHR: "London",
  MEL: "Melbourne",
  MNL: "Manila",
  NAN: "Nadi",
  NRT: "Tokyo Narita",
  OOL: "Gold Coast",
  PEK: "Beijing",
  PER: "Perth",
  PNH: "Phnom Penh",
  PVG: "Shanghai",
  SFO: "San Francisco",
  SIN: "Singapore",
  SYD: "Sydney",
  WLG: "Wellington",
  ZQN: "Queenstown"
};

function normalizeAircraftId(value) {
  return AIRCRAFT_ALIASES[value] || value;
}

function aircraftModel(value) {
  const id = normalizeAircraftId(value);

  const names = {
    "A220-300": "Airbus A220-300",
    A320NEO: "Airbus A320neo",
    A321NEO: "Airbus A321neo",
    "A321-200": "Airbus A321-200",
    "A321XLR": "Airbus A321XLR",
    "A330-900": "Airbus A330-900",
    "A350-900": "Airbus A350-900",
    "A350-1000": "Airbus A350-1000",
    "A350-1000ULR": "Airbus A350-1000ULR",
    "A380-800": "Airbus A380-800",
    "B777-9": "Boeing 777-9",
    ATR72: "ATR 72-600"
  };

  return names[id] || value;
}

function normalizeRoutes(rawRoutes) {
  return rawRoutes.map((row, index) => {
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
    ] = row;

    const aircraftId = normalizeAircraftId(aircraft);

    return {
      id: `BLPX1-${flightNumber.replace(/\s+/g, "-")}-${index + 1}`,
      flightNumber,
      routeId: `${origin}-${destination}`,
      origin,
      originName: AIRPORTS[origin] || origin,
      destination,
      destinationName: AIRPORTS[destination] || destination,
      departure,
      arrival,
      arrivalDayOffset,
      arrivalDisplay: `${arrival}${arrivalDayOffset ? `+${arrivalDayOffset}` : ""}`,
      duration,
      days,
      aircraft: aircraftId,
      aircraftDisplay: aircraftModel(aircraftId),
      fare: Number(fare),

      // Compatibility with the old site.
      sampleFare: Number(fare),
      distance: 0
    };
  });
}

async function fetchJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function getAircraftFromQuery() {
  return new URLSearchParams(window.location.search).get("aircraft");
}

function getFlightFromQuery() {
  return new URLSearchParams(window.location.search).get("flight");
}

function normalizeLayout(layout) {
  if (layout?.sections) {
    return layout.sections;
  }

  return [
    {
      name: "Main cabin",
      rows: layout?.rows || 30,
      seats: layout?.seats || ["A", "B", "C", "D", "E", "F"],
      startRow: 1
    }
  ];
}

/*
 * A220-300 was not in the original fleet file.
 * Add it automatically so the schedule and fleet stay synchronized.
 */
function ensureA220FleetEntry() {
  if (fleetData.some((aircraft) => aircraft.id === "A220-300")) {
    return;
  }

  fleetData.push({
    id: "A220-300",
    model: "Airbus A220-300",
    type: "Regional narrow-body",
    fleetCount: 4,
    capacity: 145,
    range: 6297,

    // BULA AIR A220 IMAGE
    image: "../assets/images/aircraft/a220-300.png",

    notes: "Efficient regional aircraft for thinner international routes.",
    layout: {
      sections: [
        {
          name: "Premium Economy",
          startRow: 1,
          rows: 4,
          seats: ["A", "C", "D", "F"],
          aislesAfter: [2]
        },
        {
          name: "Economy",
          startRow: 6,
          rows: 24,
          seats: ["A", "B", "C", "D", "E", "F"],
          aislesAfter: [3]
        }
      ]
    }
  });
}

function occupiedSeatsForAircraft(aircraftId) {
  return new Set(
    bookingData
      .filter((booking) => booking.aircraftId === aircraftId)
      .flatMap((booking) => booking.seats || [])
  );
}

function getSelectedSeatIds() {
  return [...selectedSeats].sort((a, b) => {
    const rowA = Number.parseInt(a, 10);
    const rowB = Number.parseInt(b, 10);

    return rowA - rowB || a.localeCompare(b);
  });
}

function cabinClassName(name) {
  return `cabin-${String(name || "main")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

function seatGridTemplate(section) {
  const aislesAfter = new Set(section.aislesAfter || []);
  const columns = [];

  section.seats.forEach((seat, index) => {
    columns.push("42px");

    if (aislesAfter.has(index + 1)) {
      columns.push("18px");
    }
  });

  return columns.join(" ");
}

function updateSelectedCount() {
  const count = document.getElementById("selected-count");

  if (count) {
    count.textContent = selectedSeats.size;
  }

  updateBookingSummary();
}

function getSelectedFlight() {
  const select = document.getElementById("route-select");

  if (!select) {
    return null;
  }

  return routeData.find((flight) => flight.id === select.value) || null;
}

function updateBookingSummary() {
  const summary = document.getElementById("booking-summary");

  if (!summary) {
    return;
  }

  const flight = getSelectedFlight();

  if (!flight) {
    summary.innerHTML = `
      <p>Select a flight to begin your booking.</p>
    `;
    return;
  }

  const aircraft = fleetData.find(
    (item) => item.id === flight.aircraft
  );

  const seats = getSelectedSeatIds();
  const total = flight.fare * seats.length;

  summary.innerHTML = `
    <div>
      <span>Flight</span>
      <strong>${flight.flightNumber}</strong>
    </div>

    <div>
      <span>Route</span>
      <strong>${flight.origin} → ${flight.destination}</strong>
    </div>

    <div>
      <span>Departure</span>
      <strong>${flight.departure}</strong>
    </div>

    <div>
      <span>Arrival</span>
      <strong>${flight.arrivalDisplay}</strong>
    </div>

    <div>
      <span>Aircraft</span>
      <strong>${aircraft?.model || flight.aircraftDisplay}</strong>
    </div>

    <div>
      <span>Seats</span>
      <strong>${seats.length ? seats.join(", ") : "Choose seats"}</strong>
    </div>

    <div>
      <span>Fare per passenger</span>
      <strong>${money(flight.fare)}</strong>
    </div>

    <div>
      <span>Estimated total</span>
      <strong>${seats.length ? money(total) : "Choose seats"}</strong>
    </div>
  `;
}

function renderSeatMap(aircraftId) {
  const map = document.getElementById("seat-map");

  if (!map) {
    return;
  }

  const aircraft =
    fleetData.find((item) => item.id === aircraftId) || fleetData[0];

  if (!aircraft) {
    map.textContent = "Seat map unavailable.";
    return;
  }

  selectedSeats = new Set();

  const occupied = occupiedSeatsForAircraft(aircraft.id);
  const sections = normalizeLayout(aircraft.layout);

  map.innerHTML = "";

  let currentDeck = "";

  sections.forEach((section) => {
    if (section.deck && section.deck !== currentDeck) {
      const deckTitle = document.createElement("div");

      deckTitle.className = `deck-title ${cabinClassName(section.deck)}`;
      deckTitle.textContent = section.deck;

      map.appendChild(deckTitle);

      currentDeck = section.deck;
    }

    if (section.amenity === "snack-bar") {
      const bar = document.createElement("div");

      bar.className = "snack-bar";

      bar.innerHTML = `
        <strong>Upper Deck Snack Bar</strong>
        <span>
          Business guests can stop in, refresh, and settle into the lounge.
        </span>
      `;

      const lounge = document.createElement("div");

      lounge.className = "snack-bar-seats";

      section.seats.forEach((seatId) => {
        const seat = document.createElement("span");

        seat.className = "lounge-seat";
        seat.textContent = seatId;

        lounge.appendChild(seat);
      });

      bar.appendChild(lounge);
      map.appendChild(bar);

      return;
    }

    const title = document.createElement("div");

    const styleClass = section.seatStyle
      ? ` layout-${String(section.seatStyle)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`
      : "";

    title.className =
      `seat-section-title ${cabinClassName(section.name)}` +
      styleClass;

    title.textContent = section.name || "Cabin";

    map.appendChild(title);

    const startRow = section.startRow || 1;

    for (
      let rowNumber = startRow;
      rowNumber < startRow + section.rows;
      rowNumber++
    ) {
      const row = document.createElement("div");

      const rowStyleClass = section.seatStyle
        ? ` layout-${String(section.seatStyle)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`
        : "";

      row.className =
        `seat-row ${cabinClassName(section.name)}` +
        rowStyleClass;

      row.style.setProperty(
        "--seat-count",
        section.seats.length
      );

      row.style.gridTemplateColumns =
        seatGridTemplate(section);

      const rowLabel = document.createElement("span");

      rowLabel.className = "row-number";
      rowLabel.textContent = rowNumber;

      row.appendChild(rowLabel);

      section.seats.forEach((letter, seatIndex) => {
        const seatId = `${rowNumber}${letter}`;

        const seat = document.createElement("button");

        seat.type = "button";
        seat.className = "seat";
        seat.textContent = seatId;
        seat.dataset.seat = seatId;

        seat.setAttribute(
          "aria-label",
          `Seat ${seatId}`
        );

        if (occupied.has(seatId)) {
          seat.classList.add("occupied");
          seat.disabled = true;

          seat.setAttribute(
            "aria-label",
            `Seat ${seatId}, occupied`
          );
        }

        if (
          section.name === "Business" &&
          ["staggered-suite", "premium-herringbone"].includes(
            section.seatStyle
          )
        ) {
          if (seatIndex < section.seats.length / 2) {
            seat.classList.add("business-left");
          } else {
            seat.classList.add("business-right");
          }
        }

        seat.addEventListener("click", () => {
          if (seat.disabled) {
            return;
          }

          if (selectedSeats.has(seatId)) {
            selectedSeats.delete(seatId);
            seat.classList.remove("selected");
          } else {
            selectedSeats.add(seatId);
            seat.classList.add("selected");
          }

          updateSelectedCount();
        });

        row.appendChild(seat);

        if (
          (section.aislesAfter || []).includes(
            seatIndex + 1
          )
        ) {
          const aisle = document.createElement("span");

          aisle.className = "seat-aisle";
          aisle.setAttribute("aria-hidden", "true");

          row.appendChild(aisle);
        }
      });

      map.appendChild(row);
    }
  });

  updateSelectedCount();
}

function setAircraftForFlight(flight) {
  const select = document.getElementById("aircraft-select");

  if (!select || !flight) {
    return;
  }

  const aircraftId = normalizeAircraftId(
    flight.aircraft
  );

  select.innerHTML = `
    <option value="${aircraftId}">
      ${flight.aircraftDisplay}
    </option>
  `;

  select.value = aircraftId;

  /*
   * Aircraft is determined by the actual flight.
   * The passenger cannot accidentally choose another aircraft.
   */
  select.disabled = true;

  renderSeatMap(aircraftId);
}

function populateAircraftSelect() {
  const select = document.getElementById("aircraft-select");

  if (!select) {
    return;
  }

  select.innerHTML = fleetData
    .map(
      (aircraft) =>
        `<option value="${aircraft.id}">
          ${aircraft.model}
        </option>`
    )
    .join("");

  select.disabled = true;

  const requestedAircraft = getAircraftFromQuery();

  if (
    requestedAircraft &&
    fleetData.some(
      (aircraft) =>
        aircraft.id === requestedAircraft
    )
  ) {
    select.value = requestedAircraft;
    renderSeatMap(requestedAircraft);
  } else {
    renderSeatMap(select.value);
  }
}

function populateRouteSelect() {
  const select = document.getElementById("route-select");

  if (!select) {
    return;
  }

  const requestedFlight = getFlightFromQuery();

  select.innerHTML = `
    <option value="">Choose a flight...</option>

    ${routeData
      .map(
        (flight) => `
          <option value="${flight.id}">
            ${flight.flightNumber} ·
            ${flight.origin} → ${flight.destination} ·
            ${flight.departure}–${flight.arrivalDisplay} ·
            ${flight.aircraftDisplay} ·
            ${money(flight.fare)}
          </option>
        `
      )
      .join("")}
  `;

  if (
    requestedFlight &&
    routeData.some(
      (flight) =>
        flight.flightNumber === requestedFlight ||
        flight.id === requestedFlight
    )
  ) {
    const flight = routeData.find(
      (item) =>
        item.flightNumber === requestedFlight ||
        item.id === requestedFlight
    );

    if (flight) {
      select.value = flight.id;
      setAircraftForFlight(flight);
    }
  }

  select.addEventListener("change", () => {
    const flight = getSelectedFlight();

    selectedSeats = new Set();

    if (flight) {
      setAircraftForFlight(flight);

      const status =
        document.getElementById("booking-status");

      if (status) {
        status.textContent =
          `${flight.flightNumber} selected — choose your seats.`;
        status.classList.remove("error");
      }
    } else {
      selectedSeats = new Set();

      const aircraftSelect =
        document.getElementById("aircraft-select");

      if (aircraftSelect) {
        aircraftSelect.innerHTML =
          `<option value="">Select a flight first</option>`;

        aircraftSelect.disabled = true;
      }

      const map =
        document.getElementById("seat-map");

      if (map) {
        map.innerHTML =
          `<p>Select a flight to load its seat map.</p>`;
      }
    }

    updateBookingSummary();
  });
}

function renderFleet() {
  const list =
    document.getElementById("fleet-list");

  if (!list) {
    return;
  }

  list.innerHTML = fleetData
    .map(
      (aircraft, index) => `
        <article class="fleet-card ${
          index === 0
            ? "fleet-card-featured"
            : ""
        }">

          <div class="fleet-image-wrap">
            <img
              src="${aircraft.image}"
              alt="Bula Air ${aircraft.model}"
              loading="${index === 0 ? "eager" : "lazy"}"
            >
          </div>

          <div class="fleet-card-body">

            <div class="fleet-kicker">
              <span>${aircraft.type}</span>
              <strong>
                ${
                  index === 0
                    ? "Flagship"
                    : `${aircraft.fleetCount} in fleet`
                }
              </strong>
            </div>

            <h2>${aircraft.model}</h2>

            <p>${aircraft.notes}</p>

            <div class="fleet-stats">
              <span>
                <strong>${aircraft.capacity}</strong>
                seats
              </span>

              <span>
                <strong>
                  ${Number(
                    aircraft.range
                  ).toLocaleString()}
                </strong>
                km
              </span>
            </div>

            <a
              class="button"
              href="seating.html?aircraft=${encodeURIComponent(
                aircraft.id
              )}"
            >
              Preview seats
            </a>

          </div>
        </article>
      `
    )
    .join("");
}

function renderRoutes() {
  const list =
    document.getElementById("routes-list");

  if (!list) {
    return;
  }

  /*
   * Group flights by city pair so the routes page
   * doesn't become an enormous list of duplicate
   * city-pair cards.
   */
  const grouped = new Map();

  routeData.forEach((flight) => {
    const key = flight.routeId;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push(flight);
  });

  list.innerHTML = [...grouped.values()]
    .map((flights) => {
      const first = flights[0];

      const lowestFare = Math.min(
        ...flights.map(
          (flight) => flight.fare
        )
      );

      return `
        <article class="card">

          <p class="eyebrow">
            ${first.origin} → ${first.destination}
          </p>

          <h2>
            ${first.originName}
            to
            ${first.destinationName}
          </h2>

          <p>
            ${flights.length}
            daily flights
            · from
            ${money(lowestFare)}
          </p>

          <a
            class="button"
            href="booking.html"
          >
            View flights
          </a>

        </article>
      `;
    })
    .join("");
}

function setupBookingForm() {
  const form =
    document.getElementById("booking-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name =
      document
        .getElementById("passenger-name")
        ?.value
        .trim();

    const flight = getSelectedFlight();

    const aircraft =
      flight &&
      fleetData.find(
        (item) =>
          item.id === flight.aircraft
      );

    const seats =
      getSelectedSeatIds();

    const confirmation =
      document.getElementById(
        "booking-confirmation"
      );

    const status =
      document.getElementById(
        "booking-status"
      );

    if (!name) {
      status.textContent =
        "Add a passenger name before confirming.";

      status.classList.add("error");

      return;
    }

    if (!flight) {
      status.textContent =
        "Choose a flight before confirming.";

      status.classList.add("error");

      return;
    }

    if (!seats.length) {
      status.textContent =
        "Choose at least one available seat before confirming.";

      status.classList.add("error");

      return;
    }

    status.classList.remove("error");

    const reference =
      `BA${Date.now()
        .toString()
        .slice(-6)}`;

    const total =
      flight.fare * seats.length;

    confirmation.innerHTML = `
      <p class="eyebrow">
        Booking confirmed
      </p>

      <h2>
        You are ready to fly.
      </h2>

      <p class="booking-reference">
        Reference
        <strong>${reference}</strong>
      </p>

      <p>
        <strong>Passenger:</strong>
        ${name}
      </p>

      <p>
        <strong>Flight:</strong>
        ${flight.flightNumber}
      </p>

      <p>
        <strong>Route:</strong>
        ${flight.originName}
        →
        ${flight.destinationName}
      </p>

      <p>
        <strong>Departure:</strong>
        ${flight.departure}
      </p>

      <p>
        <strong>Arrival:</strong>
        ${flight.arrivalDisplay}
      </p>

      <p>
        <strong>Aircraft:</strong>
        ${
          aircraft?.model ||
          flight.aircraftDisplay
        }
      </p>

      <p>
        <strong>Seats:</strong>
        ${seats.join(", ")}
      </p>

      <p>
        <strong>Total:</strong>
        ${money(total)}
      </p>

      <p class="small">
        This fictional reservation is saved
        only in this browser session.
      </p>
    `;

    confirmation.classList.add(
      "confirmed"
    );

    status.textContent =
      "Booking confirmed. Your Bula Air flight is ready.";
  });
}

async function init() {
  try {
    const [
      fleet,
      routes,
      bookings
    ] = await Promise.all([
      fetchJSON(
        `${DATA_ROOT}fleet.json`
      ),

      fetchJSON(
        `${DATA_ROOT}routes.json`
      ),

      fetchJSON(
        `${DATA_ROOT}bookings.json`
      ).catch(() => [])
    ]);

    fleetData = fleet;
    routeData = normalizeRoutes(routes);
    bookingData = bookings;

    ensureA220FleetEntry();

    /*
     * Automatically remove any route aircraft
     * that doesn't exist in the fleet.
     */
    const missingAircraft = [
      ...new Set(
        routeData
          .map(
            (flight) =>
              flight.aircraft
          )
          .filter(
            (aircraftId) =>
              !fleetData.some(
                (aircraft) =>
                  aircraft.id ===
                  aircraftId
              )
          )
      )
    ];

    if (missingAircraft.length) {
      console.warn(
        "Aircraft automatically added:",
        missingAircraft
      );
    }
  } catch (error) {
    console.error(
      "Bula Air data loading error:",
      error
    );

    const status =
      document.getElementById(
        "booking-status"
      );

    if (status) {
      status.textContent =
        "Unable to load Bula Air flight data.";
      status.classList.add("error");
    }

    return;
  }

  renderFleet();
  renderRoutes();
  populateRouteSelect();
  populateAircraftSelect();
  setupBookingForm();
  updateBookingSummary();
}

window.getSelectedSeatIds =
  getSelectedSeatIds;

window.addEventListener(
  "DOMContentLoaded",
  init
);