const aircraftLayouts = {
  "A350-900": {
    rows: 30,
    seatsPerRow: 9,
    layout: ["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]
  },

  "A330-900neo": {
    rows: 28,
    seatsPerRow: 9,
    layout: ["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]
  },

  "787-9": {
    rows: 29,
    seatsPerRow: 9,
    layout: ["A", "B", "C", "", "D", "E", "F", "", "G", "H", "I"]
  }
};

const aircraftSelect = document.getElementById("aircraft-select");
const seatMap = document.getElementById("seat-map");
const selectedCount = document.getElementById("selected-count");

let selectedSeats = [];

function createAircraftOptions() {
  Object.keys(aircraftLayouts).forEach(aircraft => {
    const option = document.createElement("option");
    option.value = aircraft;
    option.textContent = aircraft;
    aircraftSelect.appendChild(option);
  });
}

function createSeatMap(aircraftName) {
  seatMap.innerHTML = "";
  selectedSeats = [];
  updateSelectedCount();

  const aircraft = aircraftLayouts[aircraftName];

  for (let row = 1; row <= aircraft.rows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "seat-row";

    aircraft.layout.forEach(letter => {
      if (letter === "") {
        const aisle = document.createElement("div");
        aisle.className = "seat-aisle";
        rowElement.appendChild(aisle);
        return;
      }

      const seat = document.createElement("button");

      seat.type = "button";
      seat.className = "seat available";
      seat.textContent = `${row}${letter}`;
      seat.dataset.seat = `${row}${letter}`;

      seat.addEventListener("click", () => {
        toggleSeat(seat);
      });

      rowElement.appendChild(seat);
    });

    seatMap.appendChild(rowElement);
  }
}

function toggleSeat(seat) {
  const seatNumber = seat.dataset.seat;

  if (seat.classList.contains("occupied")) {
    return;
  }

  if (seat.classList.contains("selected")) {
    seat.classList.remove("selected");
    seat.classList.add("available");

    selectedSeats = selectedSeats.filter(
      seat => seat !== seatNumber
    );
  } else {
    seat.classList.remove("available");
    seat.classList.add("selected");

    selectedSeats.push(seatNumber);
  }

  updateSelectedCount();
}

function updateSelectedCount() {
  selectedCount.textContent = selectedSeats.length;
}

aircraftSelect.addEventListener("change", () => {
  createSeatMap(aircraftSelect.value);
});

createAircraftOptions();
createSeatMap(aircraftSelect.value);