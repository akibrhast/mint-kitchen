# Square Payment Integration Guide

This document explains the complete implementation of Square payment processing in your Mint Kitchen application.

## Overview

The payment flow works as follows:
1. User adds items to cart in your React app
2. User clicks "Continue to Checkout"
3. Checkout page displays order summary
4. User enters card details via Square Web Payments SDK
5. Backend creates Square order
6. Backend processes payment
7. User sees confirmation or error

## Backend Implementation ✅ COMPLETED

### New Endpoints Added to `backend/main.py`:

#### 1. Create Order (`POST /api/orders/create`)
- Converts cart items to Square order
- Returns `order_id` and `total_money`
- Required for payment processing

**Request Body:**
```json
{
  "line_items": [
    {
      "item_id": "chicken-biryani",
      "name": "Chicken Biryani",
      "quantity": 2,
      "price": "$14.00"
    }
  ]
}
```

**Response:**
```json
{
  "order_id": "ABC123",
  "total_money": {
    "amount": 2800,
    "currency": "USD"
  },
  "location_id": "LOC123"
}
```

#### 2. Create Payment (`POST /api/payments/create`)
- Processes payment for an order
- Returns payment status and receipt URL

**Request Body:**
```json
{
  "source_id": "cnon:card-nonce-ok",
  "order_id": "ABC123",
  "amount_money": 2800
}
```

**Response:**
```json
{
  "payment_id": "PAY123",
  "status": "COMPLETED",
  "receipt_url": "https://squareup.com/receipt/...",
  "order_id": "ABC123"
}
```

### API Service Functions ✅ COMPLETED

Added to `src/services/api.js`:
- `createOrder(lineItems)` - Creates Square order
- `createPayment(sourceId, orderId, amountMoney)` - Processes payment

## Frontend Implementation - REMAINING STEPS

### Step 1: Install Square Web Payments SDK

You need to install the Square Web Payments SDK to handle card input:

```bash
npm install @square/web-payments-sdk-react
```

### Step 2: Get Your Square Application ID

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Copy your **Application ID** (different from access token)
4. Add to your frontend `.env` file:

**Create `.env` in project root (not backend folder):**
```env
VITE_SQUARE_APPLICATION_ID=your_application_id_here
VITE_SQUARE_LOCATION_ID=your_location_id_here
```

### Step 3: Create Checkout Components

I'll create these files for you:

1. **`src/components/CheckoutPage.jsx`**
   - Order summary
   - Payment form container
   - Handles checkout flow

2. **`src/components/PaymentForm.jsx`**
   - Square card input field
   - Payment button
   - Error handling

3. **`src/App.jsx` updates**
   - Add routing (react-router-dom)
   - Add checkout route

### Step 4: Update CartModal

Change "Continue to Checkout" to navigate to `/checkout` page instead of external redirect.

## Payment Flow Diagram

```
User adds items to cart
         ↓
Cart Modal → "Continue to Checkout"
         ↓
Checkout Page (shows order summary)
         ↓
User enters card details (Square Web SDK)
         ↓
Frontend: createOrder() → Backend: POST /api/orders/create
         ↓
Backend creates Square order, returns order_id
         ↓
User clicks "Pay Now"
         ↓
Square SDK tokenizes card → returns source_id
         ↓
Frontend: createPayment(source_id, order_id) → Backend: POST /api/payments/create
         ↓
Backend processes payment with Square
         ↓
Success: Show confirmation + receipt URL
Failure: Show error message
```

## Testing Strategy

### With Sandbox (Recommended):
1. Set `SQUARE_ENVIRONMENT=sandbox` in backend `.env`
2. Use sandbox Application ID
3. Use test card: `4111 1111 1111 1111`
4. CVV: Any 3 digits
5. Expiry: Any future date
6. ZIP: Any 5 digits

### With Production (After Activation):
1. Set `SQUARE_ENVIRONMENT=production` in backend `.env`
2. Activate your Square account at squareup.com/activate
3. Use production Application ID
4. Real cards will be charged

## What You'll See in Square Dashboard

### Orders Tab:
- Order ID
- Line items (menu items ordered)
- Total amount
- Customer info (if collected)
- Order status

### Transactions Tab:
- Payment ID
- Amount
- Card type (Visa, Mastercard, etc.)
- Last 4 digits of card
- Date/time
- Status (Completed, Failed, etc.)

## Security Notes

1. **Never expose access tokens in frontend** - they're in backend only ✅
2. **Application ID is safe to expose** - it's public-facing
3. **Card data never touches your server** - Square SDK handles tokenization
4. **Use HTTPS in production** - required by Square

## Next Steps

Would you like me to:

1. **Install the Square SDK and create the checkout components?**
   - I'll set up the complete payment form
   - Add routing between cart and checkout
   - Handle payment success/error states

2. **Just provide you the code snippets?**
   - You can manually create the files
   - I'll guide you through each piece

3. **Test with your current setup first?**
   - Verify backend endpoints work
   - Use tools like Postman to test API

## Quick Test Command

Test that your backend endpoints work:

```bash
# Test order creation
curl -X POST http://localhost:8000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [
      {
        "item_id": "test",
        "name": "Test Item",
        "quantity": 1,
        "price": "$10.00"
      }
    ]
  }'
```

This will show if Square API is properly configured and if you can create orders.
