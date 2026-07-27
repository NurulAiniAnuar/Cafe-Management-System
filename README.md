# Cafe Order Management System

## Project Overview

This project is a web-based Cafe Order Management System developed using HTML, CSS, and JavaScript.

The system allows staff to create customer orders, kitchen staff to process orders, and managers to monitor order status through a dashboard.

## Features

- Create food and beverage orders
- Multiple food items per order
- Multiple beverage items per order
- FIFO (First In First Out) order queue
- Search order by Order ID
- Kitchen order management
- Order status tracking
- Dashboard monitoring
- Local Storage data persistence

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Local Storage

## System Modules

### Main Dashboard

- Display total active orders
- Display pending orders
- Show preparing orders
- Show serving orders

### Staff View

- Create new orders
- Search orders
- View current orders
- Mark served orders

### Kitchen View

- View kitchen orders
- Process pending orders
- Update status to Preparing
- Update status to Serving
- Display next FIFO order

## How to Run

1. Download the project files.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension (optional).
4. Open `index.html`.
5. Run using Live Server or open directly in a web browser.

## File Structure

```text
Project Folder/
│
├── index.html
├── staff.html
├── kitchen.html
├── style.css
├── script.js
└── README.md
```

## Data Storage

The system uses browser Local Storage.

Order data is stored locally and remains available after page refresh.

## Author

Nurul Aini Binti Anuar

Universiti Teknologi PETRONAS
