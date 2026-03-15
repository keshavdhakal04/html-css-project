# Arc Ring Clock

A minimalist **real-time clock** built with **HTML, CSS, and JavaScript**.
The clock uses **animated SVG arc rings** to display hours, minutes, and seconds, along with a digital time display and date.

---

## Preview

The clock shows time using three animated circular rings:

* **Hours** → inner gold ring
* **Minutes** → middle violet ring
* **Seconds** → outer cyan ring

The rings smoothly animate based on the current system time.

---

## Features

* Real-time clock with **second updates**
* **Animated SVG rings** for hour, minute, and second progress
* **Digital time display** with AM/PM
* **Date display**
* **Auto-generated tick marks** around the clock
* **Responsive design** for phone, tablet, and desktop
* Smooth animation using `stroke-dashoffset`

---

## Tech Stack

* **HTML5** – page structure
* **CSS3** – styling and responsiveness
* **JavaScript (Vanilla JS)** – clock logic and animation
* **SVG** – circular progress rings

---

## Project Structure

```
arc-ring-clock
│
├── index.html     # main structure
├── style.css      # styling and responsive layout
├── clock.js       # clock logic and SVG animation
└── README.md
```

---

## How It Works

The clock calculates the **progress fraction of time** and maps it to SVG circle circumference.

Example:

```
fraction = seconds / 60
offset = circumference × (1 - fraction)
```

This value is applied to:

```
stroke-dashoffset
```

which visually fills the arc rings as time progresses.

---

## Run Locally

1. Clone the repository

```
git clone https://github.com/yourusername/arc-ring-clock.git
```

2. Open the project folder

```
cd arc-ring-clock
```

3. Open `index.html` in your browser.

No dependencies or build tools required.

---

## Future Improvements

Possible enhancements:

* Dark / light theme toggle
* Timezone selector
* Alarm feature
* 24-hour mode
* PWA support (installable clock)

---

## Author

**Keshav Dhakal**

