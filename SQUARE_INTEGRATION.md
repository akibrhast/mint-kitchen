# Square API Integration Guide

This guide will help you integrate your Mint Kitchen website with Square API to dynamically display menu items.

## Quick Start

### Step 1: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your Square credentials
```

### Step 2: Get Square API Credentials

1. Go to https://developer.squareup.com/apps
2. Create an app or select existing one
3. Go to "Credentials" tab
4. Copy your **Sandbox Access Token** (for testing)
5. Paste it in `backend/.env` file:
   ```
   SQUARE_ACCESS_TOKEN=your_token_here
   SQUARE_ENVIRONMENT=sandbox
   ```

### Step 3: Add Items to Square Catalog

1. Log in to https://squareup.com/dashboard
2. Go to "Items & Orders" → "Items"
3. Click "Create an item"
4. Add your menu items with:
   - **Name**: e.g., "Ghee Dosa"
   - **Description**: Item description
   - **Price**: e.g., $6.00
   - **Category**: Create categories like "Dosas", "Biryanis", "Curries"
   - **Images**: Upload food photos (optional)

### Step 4: Run the Backend

```bash
cd backend
python main.py
```

The API will start at `http://localhost:8000`

### Step 5: Run the Frontend

In a new terminal:

```bash
# From project root
npm run dev
# or
yarn dev
```

The website will open at `http://localhost:5173`

## How It Works

### Automatic Categorization

The backend automatically categorizes items based on their names:
- Items with "dosa" → **Dosas** tab
- Items with "biryani" → **Biryanis** tab
- Items with "curry", "butter chicken", or "paneer butter" → **Curries** tab
- Everything else → **Other** category

### Fallback Behavior

If the backend isn't running or Square API is unavailable:
- Frontend will display static/hardcoded menu data
- No errors will be shown to users
- Console will log "API not available, using static data"

When Square API is connected:
- Menu items load from Square Catalog
- "Menu powered by Square" badge appears on the page
- Items, prices, and descriptions sync with your Square dashboard

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/menu` | Get all menu items by category |
| `GET /api/categories` | Get all Square categories |
| `GET /api/items/{id}` | Get specific item details |

## Customization

### Adding More Categories

Edit [backend/main.py](backend/main.py:108-118) in the categorization logic:

```python
item_name_lower = menu_item["name"].lower()
if "your_category" in item_name_lower:
    menu_data["your_category"].append(menu_item)
```

### Using Category IDs from Square

Instead of name-based categorization, you can use Square's category IDs:

```python
category_id = item_data.get("category_id", "")
# Map category_id to your frontend categories
```

### Changing API URL

If deploying backend to a different URL, update [src/App.jsx](src/App.jsx:56):

```javascript
const response = await fetch('https://your-backend-url.com/api/menu');
```

## Troubleshooting

### "Square API not configured" error
- Check that `.env` file exists in backend directory
- Verify `SQUARE_ACCESS_TOKEN` is set correctly
- Make sure you copied the token from Square Developer Dashboard

### Empty menu returned
- Add items to your Square Catalog
- Check items have proper names and prices
- View server logs for errors: look at terminal running `python main.py`

### CORS errors
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- If using different ports, update the allowed origins

### Frontend shows static data
- Verify backend is running at `http://localhost:8000`
- Check browser console for errors
- Test API directly: `curl http://localhost:8000/api/menu`

## Going to Production

1. **Get Production Credentials**
   - Switch to Production access token in Square Dashboard
   - Update `.env`: `SQUARE_ENVIRONMENT=production`

2. **Deploy Backend**
   - Deploy to Heroku, AWS, Railway, or DigitalOcean
   - Set environment variables on hosting platform
   - Update frontend API URL to production backend URL

3. **Update Frontend**
   - Change API URL in `App.jsx` from localhost to production
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or your hosting provider

4. **Security Considerations**
   - Never commit `.env` file (already in `.gitignore`)
   - Use HTTPS for production API
   - Consider adding rate limiting
   - Add API authentication if needed

## Next Steps

- Add payment processing with Square Checkout API
- Implement order management
- Add inventory tracking
- Set up webhooks for real-time catalog updates
- Create admin panel for managing items

## Support

- Square API Docs: https://developer.squareup.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Need help? Check the logs or reach out to your development team
