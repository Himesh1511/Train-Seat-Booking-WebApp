// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rows = 12; // Total rows: 11 rows with 7 seats each + 1 row with 3 seats = 80 seats
  seatsPerRow = 7; // Maximum seats per row (except the last row)
  totalSeats = 80; // Total number of seats in the coach
  seats: { number: number, status: string }[] = []; // Array to store seat information
  bookedSeats: number[] = []; // Array to store booked seat numbers

  constructor() {
    this.initializeSeats(); // Initialize seat availability on component load
  }

  // Initialize all seats as available
  initializeSeats() {
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({ number: i, status: 'available' });
    }
  }

  // Handle seat booking logic
  bookSeats(requestedSeats: number) {
    if (requestedSeats < 1 || requestedSeats > 7) {
      alert('You can book a minimum of 1 seat and a maximum of 7 seats.');
      return; // Validate the input for number of seats
    }

    const availableSeats = this.seats.filter(seat => seat.status === 'available'); // Check available seats

    if (availableSeats.length < requestedSeats) {
      alert('Not enough seats available.');
      return; // Notify if not enough seats are available
    }

    const booked = this.findSeats(requestedSeats); // Attempt to find suitable seats
    if (booked) {
      this.bookedSeats = booked.map(seat => seat.number); // Store booked seat numbers
      booked.forEach(seat => seat.status = 'booked'); // Mark seats as booked
    } else {
      alert('Could not find adjacent seats.'); // Notify if adjacent seats are not available
    }
  }

  // Find suitable seats for booking
  findSeats(requestedSeats: number): { number: number, status: string }[] | null {
    // Attempt to find seats in the same row
    for (let i = 0; i < this.rows; i++) {
      const startIndex = i * this.seatsPerRow;
      const endIndex = startIndex + (i === this.rows - 1 ? 3 : this.seatsPerRow); // Handle last row with 3 seats
      const rowSeats = this.seats.slice(startIndex, endIndex); // Get seats in the current row
      const availableInRow = rowSeats.filter(seat => seat.status === 'available');

      if (availableInRow.length >= requestedSeats) {
        return availableInRow.slice(0, requestedSeats); // Return adjacent seats in the row
      }
    }

    // Fallback: Find nearest available seats across rows
    const availableSeats = this.seats.filter(seat => seat.status === 'available');
    return availableSeats.slice(0, requestedSeats); // Return seats from the start of available list
  }
}
