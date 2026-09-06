const DATA_ROOT = "../data/";
const FALLBACK_DATA = {
  fleet: [
    {
      "id": "A350-1000",
      "model": "Airbus A350-1000",
      "type": "Flagship wide-body",
      "fleetCount": 28,
      "capacity": 314,
      "layout": {
        "sections": [
          { "name": "First", "startRow": 1, "rows": 2, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3] },
          { "name": "Business", "startRow": 5, "rows": 6, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5], "seatStyle": "staggered-suite" },
          { "name": "Premium Economy", "startRow": 13, "rows": 3, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5] },
          { "name": "Economy", "startRow": 18, "rows": 27, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "K"], "aislesAfter": [3, 6] }
        ]
      },
      "range": 16100,
      "image": "../assets/images/aircraft/a350-1000.png",
      "notes": "The Bula Air flagship, built for premium long-haul Pacific services."
    },
    {
      "id": "B777-9",
      "model": "Boeing 777-9",
      "type": "Long-haul wide-body",
      "fleetCount": 24,
      "capacity": 416,
      "layout": {
        "sections": [
          { "name": "First", "startRow": 1, "rows": 2, "seats": ["A", "F", "K"], "aislesAfter": [1, 2] },
          { "name": "Business", "startRow": 5, "rows": 2, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3], "seatStyle": "premium-herringbone" },
          { "name": "Premium Economy", "startRow": 9, "rows": 14, "seats": ["A", "C", "D", "E", "F", "G", "H", "K"], "aislesAfter": [2, 6] },
          { "name": "Economy", "startRow": 25, "rows": 29, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"], "aislesAfter": [3, 7] }
        ]
      },
      "range": 13500,
      "image": "../assets/images/aircraft/boeing-777-9.png",
      "notes": "High-capacity twinjet for busy trunk routes."
    },
    {
      "id": "A321NEO",
      "model": "Airbus A321neo",
      "type": "Narrow-body",
      "fleetCount": 24,
      "capacity": 206,
      "layout": {
        "sections": [
          { "name": "Premium Economy", "startRow": 1, "rows": 8, "seats": ["A", "B", "D", "E"], "aislesAfter": [2] },
          { "name": "Economy", "startRow": 12, "rows": 29, "seats": ["A", "B", "C", "D", "E", "F"], "aislesAfter": [3] }
        ]
      },
      "range": 7400,
      "image": "../assets/images/aircraft/a321-200.png",
      "notes": "Quiet, efficient narrow-body for regional routes."
    },
    {
      "id": "A350-900",
      "model": "Airbus A350-900",
      "type": "Wide-body",
      "fleetCount": 10,
      "capacity": 308,
      "layout": {
        "sections": [
          { "name": "First", "startRow": 1, "rows": 1, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3] },
          { "name": "Business", "startRow": 4, "rows": 3, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5], "seatStyle": "staggered-suite" },
          { "name": "Premium Economy", "startRow": 9, "rows": 7, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5] },
          { "name": "Economy", "startRow": 18, "rows": 26, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "K"], "aislesAfter": [3, 6] }
        ]
      },
      "range": 15000,
      "image": "../assets/images/aircraft/a350-900.png",
      "notes": "Long-range comfort with a lighter footprint."
    },
    {
      "id": "A320NEO",
      "model": "Airbus A320neo",
      "type": "Narrow-body",
      "fleetCount": 6,
      "capacity": 180,
      "layout": { "rows": 30, "seats": ["A", "B", "C", "D", "E", "F"] },
      "range": 6500,
      "image": "../assets/images/aircraft/a320neo.png",
      "notes": "A clean everyday workhorse for short and medium flights."
    },
    {
      "id": "A321-200",
      "model": "Airbus A321-200",
      "type": "Narrow-body",
      "fleetCount": 5,
      "capacity": 206,
      "layout": {
        "sections": [
          { "name": "Premium Economy", "startRow": 1, "rows": 8, "seats": ["A", "B", "D", "E"], "aislesAfter": [2] },
          { "name": "Economy", "startRow": 12, "rows": 29, "seats": ["A", "B", "C", "D", "E", "F"], "aislesAfter": [3] }
        ]
      },
      "range": 5950,
      "image": "../assets/images/aircraft/a321neo.png",
      "notes": "Flexible capacity for holiday routes and peak travel."
    },
    {
      "id": "ATR72",
      "model": "ATR 72-600",
      "type": "Turboprop",
      "fleetCount": 5,
      "capacity": 70,
      "layout": { "rows": 18, "seats": ["A", "B", "C", "D"] },
      "range": 1500,
      "image": "../assets/images/aircraft/atr-72-600.png",
      "notes": "Short-hop aircraft for island connections."
    },
    {
      "id": "A330-900",
      "model": "Airbus A330-900",
      "type": "Wide-body",
      "fleetCount": 5,
      "capacity": 314,
      "layout": {
        "sections": [
          { "name": "Business", "startRow": 1, "rows": 3, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5], "seatStyle": "staggered-suite" },
          { "name": "Premium Economy", "startRow": 6, "rows": 11, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5] },
          { "name": "Economy", "startRow": 19, "rows": 27, "seats": ["A", "B", "D", "E", "F", "G", "J", "K"], "aislesAfter": [2, 6] }
        ]
      },
      "range": 13300,
      "image": "../assets/images/aircraft/a330-900.png",
      "notes": "Balanced range and comfort for medium-long services."
    },
    {
      "id": "A321XLR",
      "model": "Airbus A321XLR",
      "type": "Long-range narrow-body",
      "fleetCount": 4,
      "capacity": 190,
      "layout": {
        "sections": [
          { "name": "Premium Economy", "startRow": 1, "rows": 7, "seats": ["A", "B", "D", "E"], "aislesAfter": [2], "seatStyle": "premium-economy-plus" },
          { "name": "Economy", "startRow": 10, "rows": 27, "seats": ["A", "B", "C", "D", "E", "F"], "aislesAfter": [3] }
        ]
      },
      "range": 8700,
      "image": "../assets/images/aircraft/a321xlr.png",
      "notes": "Slim long-range aircraft for thinner international routes."
    },
    {
      "id": "A380-800",
      "model": "Airbus A380-800",
      "type": "Double-deck wide-body",
      "fleetCount": 3,
      "capacity": 582,
      "layout": {
        "sections": [
          { "name": "Business Suite", "deck": "Upper Deck", "startRow": 14, "rows": 3, "seats": ["A", "B", "D", "E", "G", "K"], "aislesAfter": [2, 4], "seatStyle": "staggered-suite" },
          { "name": "Snack Bar", "deck": "Upper Deck", "amenity": "snack-bar", "seats": ["L1", "L2", "L3", "L4"] },
          { "name": "Business Suite", "deck": "Upper Deck", "startRow": 22, "rows": 4, "seats": ["A", "B", "D", "E", "G", "K"], "aislesAfter": [2, 4], "seatStyle": "staggered-suite" },
          { "name": "Apartment Suite", "deck": "Main Deck", "startRow": 1, "rows": 10, "seats": ["A", "K"], "aislesAfter": [1], "seatStyle": "apartment-suite" },
          { "name": "Business", "deck": "Main Deck", "startRow": 12, "rows": 2, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3], "seatStyle": "premium-herringbone" },
          { "name": "Business", "deck": "Main Deck", "startRow": 16, "rows": 2, "seats": ["A", "B", "D", "E", "G", "K"], "aislesAfter": [2, 4], "seatStyle": "staggered-suite" },
          { "name": "Premium Economy", "deck": "Main Deck", "startRow": 20, "rows": 10, "seats": ["A", "B", "C", "D", "E", "F", "G", "H"], "aislesAfter": [2, 6] },
          { "name": "Economy", "deck": "Main Deck", "startRow": 32, "rows": 42, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"], "aislesAfter": [3, 7] }
        ]
      },
      "range": 14800,
      "image": "../assets/images/aircraft/a380-800.png",
      "notes": "Special high-demand aircraft with a gold Vinaka livery."
    },
    {
      "id": "A350-1000ULR",
      "model": "Airbus A350-1000ULR",
      "type": "Ultra-long-range wide-body",
      "fleetCount": 2,
      "capacity": 300,
      "layout": {
        "sections": [
          { "name": "First", "startRow": 1, "rows": 4, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3], "seatStyle": "ulr-first" },
          { "name": "Business", "startRow": 7, "rows": 15, "seats": ["A", "D", "G", "K"], "aislesAfter": [1, 3], "seatStyle": "ulr-business" },
          { "name": "Premium Economy", "startRow": 24, "rows": 32, "seats": ["A", "C", "D", "E", "F", "H", "K"], "aislesAfter": [2, 5], "seatStyle": "ulr-premium" }
        ]
      },
      "range": 18000,
      "image": "../assets/images/aircraft/a350-1000ulr.png",
      "notes": "Ultra-long-range flagship variant for the longest Bula Air missions."
    }
  ],
  routes: [
    { "id": "NAN-AKL", "origin": "NAN", "originName": "Nadi", "destination": "AKL", "destinationName": "Auckland", "distance": 2100, "sampleFare": 420 },
    { "id": "NAN-SYD", "origin": "NAN", "originName": "Nadi", "destination": "SYD", "destinationName": "Sydney", "distance": 2900, "sampleFare": 510 },
    { "id": "NAN-LAX", "origin": "NAN", "originName": "Nadi", "destination": "LAX", "destinationName": "Los Angeles", "distance": 8900, "sampleFare": 980 },
    { "id": "NAN-HNL", "origin": "NAN", "originName": "Nadi", "destination": "HNL", "destinationName": "Honolulu", "distance": 5100, "sampleFare": 760 }
  ],
  bookings: [
    { "bookingId": "BA1001", "aircraftId": "A320NEO", "routeId": "NAN-AKL", "passenger": "Mere V.", "seats": ["1A", "1B", "12C", "18F"] },
    { "bookingId": "BA1002", "aircraftId": "A350-1000", "routeId": "NAN-LAX", "passenger": "Jonah K.", "seats": ["1A", "3D", "15A", "15B", "22K"] },
    { "bookingId": "BA1003", "aircraftId": "ATR72", "routeId": "NAN-HNL", "passenger": "Litia R.", "seats": ["2A", "5D", "9B"] }
  ]
};
let fleetData = [];
let routeData = [];
let bookingData = [];
let selectedSeats = new Set();

async function fetchJSON(path) {
  const fileName = path.split("/").pop();
  if (window.location.protocol === "file:") {
    if (fileName === "fleet.json") return FALLBACK_DATA.fleet;
    if (fileName === "routes.json") return FALLBACK_DATA.routes;
    if (fileName === "bookings.json") return FALLBACK_DATA.bookings;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  } catch (error) {
    if (fileName === "fleet.json") return FALLBACK_DATA.fleet;
    if (fileName === "routes.json") return FALLBACK_DATA.routes;
    if (fileName === "bookings.json") return FALLBACK_DATA.bookings;
    throw error;
  }
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function getAircraftFromQuery() {
  return new URLSearchParams(window.location.search).get("aircraft");
}

function normalizeLayout(layout) {
  if (layout.sections) return layout.sections;
  return [{ name: "Main cabin", rows: layout.rows, seats: layout.seats, startRow: 1 }];
}

function occupiedSeatsForAircraft(aircraftId) {
  return new Set(bookingData.filter((booking) => booking.aircraftId === aircraftId).flatMap((booking) => booking.seats));
}

function getSelectedSeatIds() {
  return [...selectedSeats].sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10) || a.localeCompare(b));
}

function updateSelectedCount() {
  const count = document.getElementById("selected-count");
  if (count) count.textContent = selectedSeats.size;
  updateBookingSummary();
}

function updateBookingSummary() {
  const summary = document.getElementById("booking-summary");
  if (!summary) return;

  const route = routeData.find((item) => item.id === document.getElementById("route-select")?.value);
  const aircraft = fleetData.find((item) => item.id === document.getElementById("aircraft-select")?.value);
  if (!route || !aircraft) return;

  const seats = getSelectedSeatIds();
  const estimatedFare = route.sampleFare * Math.max(seats.length, 1);
  summary.innerHTML = `
    <div><span>Route</span><strong>${route.origin} to ${route.destination}</strong></div>
    <div><span>Aircraft</span><strong>${aircraft.model}</strong></div>
    <div><span>Seats</span><strong>${seats.length ? seats.join(", ") : "Choose seats"}</strong></div>
    <div><span>Estimated total</span><strong>${money(estimatedFare)}</strong></div>
  `;
}

function seatGridTemplate(section) {
  const aislesAfter = new Set(section.aislesAfter || []);
  const columns = [];

  section.seats.forEach((seat, index) => {
    columns.push("42px");
    if (aislesAfter.has(index + 1)) columns.push("18px");
  });

  return columns.join(" ");
}

function cabinClassName(name) {
  return `cabin-${String(name || "main").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function renderSeatMap(aircraftId) {
  const map = document.getElementById("seat-map");
  if (!map) return;

  const aircraft = fleetData.find((item) => item.id === aircraftId) || fleetData[0];
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
      bar.innerHTML = `<strong>Upper Deck Snack Bar</strong><span>Business guests can stop in, refresh, and settle into the lounge seats.</span>`;

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
    const sectionStyleClass = section.seatStyle ? ` layout-${cabinClassName(section.seatStyle).replace("cabin-", "")}` : "";
    title.className = `seat-section-title ${cabinClassName(section.name)}${sectionStyleClass}`;
    title.textContent = section.name || "Cabin";
    map.appendChild(title);

    const startRow = section.startRow || 1;
    for (let rowNumber = startRow; rowNumber < startRow + section.rows; rowNumber += 1) {
      const row = document.createElement("div");
      const layoutClass = section.seatStyle ? ` layout-${cabinClassName(section.seatStyle).replace("cabin-", "")}` : "";
      row.className = `seat-row ${cabinClassName(section.name)}${layoutClass}`;
      row.style.setProperty("--seat-count", section.seats.length);
      row.style.gridTemplateColumns = seatGridTemplate(section);

      const rowLabel = document.createElement("span");
      rowLabel.className = "row-number";
      rowLabel.textContent = rowNumber;
      row.appendChild(rowLabel);

      section.seats.forEach((letter) => {
        const seatId = `${rowNumber}${letter}`;
        const seat = document.createElement("button");
        seat.type = "button";
        const seatIndex = section.seats.indexOf(letter);
        const businessDirection = section.name === "Business" && ["staggered-suite", "premium-herringbone"].includes(section.seatStyle)
          ? seatIndex < section.seats.length / 2 ? " business-left" : " business-right"
          : "";
        seat.className = `seat${businessDirection}`;
        seat.textContent = seatId;
        seat.dataset.seat = seatId;
        seat.setAttribute("aria-label", `Seat ${seatId}`);

        if (occupied.has(seatId)) {
          seat.classList.add("occupied");
          seat.disabled = true;
          seat.setAttribute("aria-label", `Seat ${seatId}, occupied`);
        }

        seat.addEventListener("click", () => {
          if (seat.disabled) return;
          seat.classList.toggle("selected");
          if (selectedSeats.has(seatId)) selectedSeats.delete(seatId);
          else selectedSeats.add(seatId);
          updateSelectedCount();
        });

        row.appendChild(seat);

        if ((section.aislesAfter || []).includes(seatIndex + 1)) {
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

function populateAircraftSelect() {
  const select = document.getElementById("aircraft-select");
  if (!select) return;

  const requested = getAircraftFromQuery();
  select.innerHTML = fleetData.map((aircraft) => `<option value="${aircraft.id}">${aircraft.model}</option>`).join("");
  if (requested && fleetData.some((aircraft) => aircraft.id === requested)) select.value = requested;
  select.addEventListener("change", () => {
    renderSeatMap(select.value);
    updateBookingSummary();
  });
  renderSeatMap(select.value);
}

function renderFleet() {
  const list = document.getElementById("fleet-list");
  if (!list) return;

  list.innerHTML = fleetData.map((aircraft, index) => {
    if (index === 0) {
      // Flagship: show image plus a compact text panel
      return `
        <article class="fleet-card fleet-card-featured">
          <div class="fleet-image-wrap">
            <img src="${aircraft.image}" alt="Bula Air ${aircraft.model}" loading="eager">
          </div>
          <div class="fleet-card-body">
            <div class="fleet-kicker"><span>${aircraft.type}</span><strong>Flagship</strong></div>
            <h2>${aircraft.model}</h2>
            <p class="small">${aircraft.notes}</p>
            <div class="fleet-stats">
              <span><strong>${aircraft.capacity}</strong> seats</span>
              <span><strong>${aircraft.range.toLocaleString()}</strong> km</span>
            </div>
            <a class="button" href="seating.html?aircraft=${encodeURIComponent(aircraft.id)}">Preview seats</a>
          </div>
        </article>
      `;
    }

    return `
      <article class="fleet-card">
        <div class="fleet-image-wrap">
          <img src="${aircraft.image}" alt="Bula Air ${aircraft.model}" loading="lazy">
        </div>
        <div class="fleet-card-body">
          <div class="fleet-kicker"><span>${aircraft.type}</span><strong>${aircraft.fleetCount} in fleet</strong></div>
          <h2>${aircraft.model}</h2>
          <p>${aircraft.notes}</p>
          <div class="fleet-stats">
            <span><strong>${aircraft.capacity}</strong> seats</span>
            <span><strong>${aircraft.range.toLocaleString()}</strong> km</span>
          </div>
          <a class="button" href="seating.html?aircraft=${encodeURIComponent(aircraft.id)}">Preview seats</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderRoutes() {
  const list = document.getElementById("routes-list");
  if (!list) return;

  list.innerHTML = routeData.map((route) => `
    <article class="card">
      <p class="eyebrow">${route.origin} to ${route.destination}</p>
      <h2>${route.originName} to ${route.destinationName}</h2>
      <p>${route.distance.toLocaleString()} km &middot; from ${money(route.sampleFare)}</p>
    </article>
  `).join("");
}

function populateRouteSelect() {
  const select = document.getElementById("route-select");
  if (!select) return;

  select.innerHTML = routeData.map((route) => `<option value="${route.id}">${route.originName} to ${route.destinationName}</option>`).join("");
  select.addEventListener("change", updateBookingSummary);
}

function setupBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("passenger-name").value.trim();
    const route = routeData.find((item) => item.id === document.getElementById("route-select").value);
    const aircraft = fleetData.find((item) => item.id === document.getElementById("aircraft-select").value);
    const seats = getSelectedSeatIds();
    const confirmation = document.getElementById("booking-confirmation");
    const status = document.getElementById("booking-status");

    if (!name || !route || !aircraft || !seats.length) {
      status.textContent = !seats.length ? "Choose at least one available seat before confirming." : "Add a passenger name before confirming.";
      status.classList.add("error");
      return;
    }

    status.classList.remove("error");
    status.textContent = "Booking confirmed. Your island escape is ready.";
    const reference = `BA${Date.now().toString().slice(-6)}`;
    const estimatedFare = route.sampleFare * seats.length;

    confirmation.innerHTML = `
      <p class="eyebrow">Booking confirmed</p>
      <h2>You are ready to fly.</h2>
      <p class="booking-reference">Reference <strong>${reference}</strong></p>
      <p><strong>Passenger:</strong> ${name}</p>
      <p><strong>Route:</strong> ${route.originName} to ${route.destinationName}</p>
      <p><strong>Aircraft:</strong> ${aircraft.model}</p>
      <p><strong>Seats:</strong> ${seats.join(", ")}</p>
      <p><strong>Estimated total:</strong> ${money(estimatedFare)}</p>
      <p class="small">This fictional reservation is saved only in this browser session.</p>
    `;
    confirmation.classList.add("confirmed");
  });
}

async function init() {
  try {
    [fleetData, routeData, bookingData] = await Promise.all([
      fetchJSON(`${DATA_ROOT}fleet.json`),
      fetchJSON(`${DATA_ROOT}routes.json`),
      fetchJSON(`${DATA_ROOT}bookings.json`).catch(() => [])
    ]);
  } catch (error) {
    console.error(error);
  }

  renderFleet();
  renderRoutes();
  populateRouteSelect();
  populateAircraftSelect();
  setupBookingForm();
  updateBookingSummary();
}

window.addEventListener("DOMContentLoaded", init);

// Expose a helper for pages to read selected seats
window.getSelectedSeatIds = getSelectedSeatIds;
