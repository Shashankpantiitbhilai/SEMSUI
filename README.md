# Temperature Analysis Dashboard

A React-based web application designed to analyze and visualize temperature and humidity data, including local and battery temperatures, with the ability to calculate and track ambient temperature over time. The app also provides a history of calculated temperatures and a variety of customization settings for the user.

## Features

- **Temperature Chart**: Visualize local temperature, battery temperature, and humidity across a 24-hour period.
- **Historical Data**: View past calculated ambient temperatures and timestamps.
- **Ambient Temperature Calculation**: Calculate ambient temperature based on weighted averages of local and battery temperatures.
- **Customizable Settings**: Toggle dark mode, show/hide tips, and adjust the temperature threshold.
- **Interactive Controls**: Select an hour of the day to calculate the ambient temperature.
- **Responsive Design**: The app is fully responsive and works well on mobile and desktop devices.

## Technologies Used

- **Frontend**: 
  - **React**: For building the user interface.
  - **Recharts**: For rendering the interactive temperature chart.
  - **Lucide**: For adding icons.
  - **TailwindCSS**: For styling and responsive design.
  - **Dialog and Sheet**: For displaying modals and side drawers.
  - **Slider and Switch**: For interactive controls.
  
- **Backend**:
  - **Node.js**: For handling server-side logic.
  - **Express**: Web framework for routing and handling API requests.
  - **MongoDB**: For storing temperature data, historical records, and user settings.
  - **Mongoose**: For interacting with MongoDB using object models.
  - **API Endpoints**:
    - `/api/temperature` – Endpoint to fetch real-time temperature data.
    - `/api/history` – Endpoint to retrieve historical temperature data.
    - `/api/settings` – Endpoint to update user settings like temperature threshold.
  
- **State Management**: Using React's `useState` and `useEffect` hooks.

## Installation

To get started with the project, clone the repository and install the dependencies.

```bash
git clone https://github.com/your-username/temperature-analyzer.git
cd temperature-analyzer
npm install
