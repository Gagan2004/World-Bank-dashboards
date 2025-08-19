# World Bank Dashboard

This project is a web application that displays World Bank data on primary completion rates. It features a Django backend and a React frontend.

## Project Structure

- `backend/`: The Django backend.
- `frontend/`: The React frontend.

## Setup Instructions

First, clone the repository from GitHub:

```bash
git clone https://github.com/Gagan2004/World-Bank-dashboards.git
```

Then, to set up the project locally, follow these steps:

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv .venv
    .venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```

    The backend will be running at `http://localhost:8000`.

### Frontend

1.  **Navigate  back to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The frontend will be running at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend provides the following API endpoints:

- **`POST /api/token/`**: Get a new JWT token.
  - **Request Body:**
    ```json
    {
      "username": "your-username",
      "password": "your-password"
    }
    ```

- **`POST /api/token/refresh/`**: Refresh an existing JWT token.
  - **Request Body:**
    ```json
    {
      "refresh": "your-refresh-token"
    }
    ```

- **`GET /api/filter-options/`**: Get the filter options for the dashboard.
  - **Response:**
    ```json
    {
      "countries": ["Country1", "Country2", ...],
      "year_range": {
        "min_year": 1960,
        "max_year": 2024
      }
    }
    ```

- **`GET /api/world-data/`**: Get the world data.
  - **Query Parameters:**
    - `start_year` (integer): The start year for the data.
    - `end_year` (integer): The end year for the data.
    - `countries[]` (string): A list of countries to include.
  - **Example:** `/api/world-data/?start_year=2000&end_year=2010&countries[]=United+States&countries[]=Canada`
