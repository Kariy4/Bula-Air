const DATA_ROOT = "../data/";
const FALLBACK_DATA = {
  fleet: [
    {
      "id": "A350-1000",
      "model": "Airbus A350-1000",
      "type": "Flagship wide-body",
      "fleetCount": 28,
      "capacity": 369,
      "layout": {
        "sections": [
          { "name": "Business", "startRow": 1, "rows": 11, "seats": ["A", "D", "G", "K"] },
          { "name": "Economy", "startRow": 15, "rows": 31, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "K"] }
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
      "capacity": 426,
      "layout": {
        "sections": [
          { "name": "Business", "startRow": 1, "rows": 10, "seats": ["A", "D", "G", "K"] },
          { "name": "Economy", "startRow": 15, "rows": 36, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"] }
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
      "capacity": 220,
      "layout": { "rows": 37, "seats": ["A", "B", "C", "D", "E", "F"] },
      "range": 7400,
      "image": "../assets/images/aircraft/a321-200.png",
      "notes": "Quiet, efficient narrow-body for regional routes."
    },
    {
      "id": "A350-900",
      "model": "Airbus A350-900",
      "type": "Wide-body",
      "fleetCount": 10,
      "capacity": 315,
      "layout": {
        "sections": [
          { "name": "Business", "startRow": 1, "rows": 8, "seats": ["A", "D", "G", "K"] },
          { "name": "Economy", "startRow": 12, "rows": 29, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "K"] }
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
      "layout": { "rows": 35, "seats": ["A", "B", "C", "D", "E", "F"] },
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
      "capacity": 287,
      "layout": {
        "sections": [
          { "name": "Business", "startRow": 1, "rows": 7, "seats": ["A", "D", "G", "K"] },
          { "name": "Economy", "startRow": 10, "rows": 28, "seats": ["A", "B", "C", "D", "E", "F", "G", "H"] }
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
      "layout": { "rows": 32, "seats": ["A", "B", "C", "D", "E", "F"] },
      "range": 8700,
      "image": "../assets/images/aircraft/a321xlr.png",
      "notes": "Slim long-range aircraft for thinner international routes."
    },
    {
      "id": "A380-800",
      "model": "Airbus A380-800",
      "type": "Double-deck wide-body",
      "fleetCount": 3,
      "capacity": 517,
      "layout": {
        "sections": [
          { "name": "First", "startRow": 1, "rows": 4, "seats": ["A", "K"] },
          { "name": "Business", "startRow": 8, "rows": 14, "seats": ["A", "D", "G", "K"] },
          { "name": "Economy", "startRow": 25, "rows": 42, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"] }
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
          { "name": "Business", "startRow": 1, "rows": 14, "seats": ["A", "D", "G", "K"] },
          { "name": "Premium Economy", "startRow": 18, "rows": 8, "seats": ["A", "C", "D", "E", "F", "H", "K"] },
          { "name": "Economy", "startRow": 30, "rows": 22, "seats": ["A", "B", "C", "D", "E", "F", "G", "H", "K"] }
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

  sections.forEach((section) => {
    const title = document.createElement("div");
    title.className = "seat-section-title";
    title.textContent = section.name || "Cabin";
    map.appendChild(title);

    const startRow = section.startRow || 1;
    for (let rowNumber = startRow; rowNumber < startRow + section.rows; rowNumber += 1) {
      const row = document.createElement("div");
      row.className = "seat-row";
      row.style.setProperty("--seat-count", section.seats.length);

      const rowLabel = document.createElement("span");
      rowLabel.className = "row-number";
      rowLabel.textContent = rowNumber;
      row.appendChild(rowLabel);

      section.seats.forEach((letter) => {
        const seatId = `${rowNumber}${letter}`;
        const seat = document.createElement("button");
        seat.type = "button";
        seat.className = "seat";
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
  select.addEventListener("change", () => renderSeatMap(select.value));
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

    confirmation.innerHTML = `
      <h2>Booking confirmed</h2>
      <p><strong>Passenger:</strong> ${name}</p>
      <p><strong>Route:</strong> ${route.originName} to ${route.destinationName}</p>
      <p><strong>Aircraft:</strong> ${aircraft.model}</p>
      <p><strong>Seats:</strong> ${seats.length ? seats.join(", ") : "No seats selected"}</p>
    `;
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
}

window.addEventListener("DOMContentLoaded", init);

// Expose a helper for pages to read selected seats
window.getSelectedSeatIds = getSelectedSeatIds;
