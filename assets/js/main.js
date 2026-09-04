const DATA_ROOT = "../data/";
let fleetData = [];
let routeData = [];
let bookingData = [];
let selectedSeats = new Set();

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
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

  list.innerHTML = fleetData.map((aircraft) => `
    <article class="card">
      <p class="eyebrow">${aircraft.type}</p>
      <h2>${aircraft.model}</h2>
      <p>${aircraft.notes}</p>
      <p><strong>${aircraft.capacity}</strong> seats &middot; <strong>${aircraft.range.toLocaleString()}</strong> km range</p>
      <a class="button" href="../pages/seating.html?aircraft=${encodeURIComponent(aircraft.id)}">Preview seating</a>
    </article>
  `).join("");
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
