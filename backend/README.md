# Mint Kitchen Backend API

FastAPI backend for integrating Mint Kitchen website with Square API.

## Features

- Fetch menu items from Square Catalog API
- Automatic categorization by item type (Dosas, Biryanis, Curries)
- CORS enabled for React frontend
- Fallback to static data if API is unavailable

## Prerequisites

- Python 3.8+
- Square Developer Account
- Square Access Token

## Setup Instructions

### 1. Get Your Square API Credentials

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application or select an existing one
3. Navigate to the "Credentials" tab
4. Copy your **Access Token** (use Sandbox for testing, Production for live)
5. (Optional) Copy your **Location ID** if you have multiple locations

### 2. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Square credentials:

```env
SQUARE_ACCESS_TOKEN=your_actual_square_access_token_here
SQUARE_ENVIRONMENT=sandbox  # or "production"
SQUARE_LOCATION_ID=your_location_id_here  # optional
```

### 4. Run the Server

```bash
# Make sure you're in the backend directory and virtual environment is activated
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
```
Returns API status and Square configuration info.

### Get Full Menu
```
GET /api/menu
```
Returns all menu items organized by category (dosas, biryanis, curries).

**Response:**
```json
{
  "dosas": [
    {
      "id": "CATALOG_ITEM_ID",
      "name": "Ghee Dosa",
      "description": "Thin and crispy...",
      "price": "$6.00",
      "image": "https://...",
      "category": "CATEGORY_ID"
    }
  ],
  "biryanis": [...],
  "curries": [...]
}
```

### Get Categories
```
GET /api/categories
```
Returns all categories from Square Catalog.

### Get Single Item
```
GET /api/items/{item_id}
```
Returns details for a specific item by ID.

## Testing with curl

```bash
# Check if server is running
curl http://localhost:8000

# Get menu data
curl http://localhost:8000/api/menu

# Get categories
curl http://localhost:8000/api/categories
```

## Setting Up Your Square Catalog

For the API to return menu items, you need to add items to your Square Catalog:

1. Log in to [Square Dashboard](https://squareup.com/dashboard)
2. Go to "Items & Orders" → "Items"
3. Add your menu items with:
   - Name (e.g., "Ghee Dosa")
   - Description
   - Price
   - Category (optional, but helpful)
   - Images (optional)

The API will automatically categorize items based on their names (items with "dosa" in the name go to dosas category, etc.).

## Troubleshooting

### API returns empty menu
- Check that you have items in your Square Catalog
- Verify your SQUARE_ACCESS_TOKEN is correct
- Check the server logs for error messages

### CORS errors in browser
- Make sure the FastAPI server is running on port 8000
- Check that your React app URL is in the CORS allowed origins list in `main.py`

### Authentication errors
- Verify you're using the correct access token
- Check if you're using sandbox vs production environment correctly
- Ensure your Square app has the necessary permissions (Catalog Read)

## Development

To add more endpoints or customize the API:

1. Edit `main.py`
2. The server will auto-reload if you used `--reload` flag
3. API docs are auto-generated at `http://localhost:8000/docs`

## Production Deployment

For production:

1. Change `SQUARE_ENVIRONMENT=production` in `.env`
2. Use production Square access token
3. Deploy to a hosting service (Heroku, AWS, DigitalOcean, etc.)
4. Update the frontend API URL to point to your production backend
5. Use environment variables for sensitive data
6. Consider adding authentication/rate limiting
