# Quick Start - Get Running in 5 Minutes

## 1. Install Python Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Get Square Credentials

Visit: https://developer.squareup.com/apps

- Sign in with your Square account
- Click on your app (or create one)
- Click "Credentials" tab
- Copy the **Sandbox Access Token**

## 3. Create .env File

```bash
cp .env.example .env
```

Edit `.env` and paste your token:

```
SQUARE_ACCESS_TOKEN=your_actual_token_here
SQUARE_ENVIRONMENT=sandbox
```

## 4. Run the Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 5. Test the API

Open another terminal and run:

```bash
curl http://localhost:8000
```

You should get:
```json
{
  "message": "Mint Kitchen API is running",
  "version": "1.0.0",
  "square_configured": true
}
```

## 6. Test Menu Endpoint

```bash
curl http://localhost:8000/api/menu
```

This will return your menu items from Square Catalog!

## 7. Run Frontend

In a new terminal (keep backend running):

```bash
cd ..
npm run dev
```

Visit http://localhost:5173

## Troubleshooting

**Problem**: "SQUARE_ACCESS_TOKEN not found"
- Make sure `.env` file exists in `backend/` directory
- Check that you didn't add quotes around the token

**Problem**: Empty menu returned
- Add items to your Square Catalog first
- Go to https://squareup.com/dashboard → Items & Orders → Items

**Problem**: Port 8000 already in use
- Kill the process: `lsof -ti:8000 | xargs kill -9`
- Or change port in `main.py`: `uvicorn.run(app, port=8001)`

That's it! You're now running with Square integration.
