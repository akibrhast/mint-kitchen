from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from square import Square
from square.environment import SquareEnvironment
from dotenv import load_dotenv
import os
import logging
import uuid

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mint Kitchen API", version="1.0.0")

# Configure CORS for React frontend
# For AWS deployment, we allow all origins since API Gateway handles CORS
# For local/Synology, we use specific origins
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
    "http://localhost:5173",  # Vite default dev server
    "http://localhost:5174",  # Vite alternative port
    "http://localhost:3000",  # Alternative React dev server
    "http://localhost:4173",  # Vite preview server
    "https://mintkichen.akibrhast.synology.me",  # Production domain (Synology)
    "http://mintkichen.akibrhast.synology.me",   # Production domain (http)
]

# If running in Lambda (AWS), allow all origins (API Gateway manages CORS)
if os.getenv("AWS_EXECUTION_ENV"):
    CORS_ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False if "*" in CORS_ORIGINS else True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize Square client
SQUARE_ACCESS_TOKEN_SANDBOX = os.getenv("SQUARE_ACCESS_TOKEN_SANDBOX")
SQUARE_ACCESS_TOKEN_PRODUCTION = os.getenv("SQUARE_ACCESS_TOKEN_PRODUCTION")
SQAURE_ACCESS_TOKEN = ''

if not SQUARE_ACCESS_TOKEN_SANDBOX:
    logger.warning("SQUARE_ACCESS_TOKEN_SANDBOX not found in environment variables")

if not SQUARE_ACCESS_TOKEN_PRODUCTION:
    logger.warning("SQUARE_ACCESS_TOKEN_PRODUCTION not found in environment variables")

# Initialize Square client
# Note: Use sandbox token for testing, production token for live
environment = os.getenv("SQUARE_ENVIRONMENT")
if environment == "sandbox":
    SQUARE_ACCESS_TOKEN = SQUARE_ACCESS_TOKEN_SANDBOX
    client = Square(
        environment=SquareEnvironment.SANDBOX,  
        token=SQUARE_ACCESS_TOKEN_SANDBOX
    )
else:
    SQUARE_ACCESS_TOKEN = SQUARE_ACCESS_TOKEN_PRODUCTION
    client = Square(
        environment=SquareEnvironment.PRODUCTION,
        token=SQUARE_ACCESS_TOKEN_PRODUCTION
    )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Mint Kitchen API is running",
        "version": "1.0.0",
        "square_configured": bool(SQUARE_ACCESS_TOKEN)
    }


@app.get("/api/menu")
async def get_menu():
    """
    Fetch all menu items from Square Catalog API
    Returns organized menu data by category
    """
    if not SQUARE_ACCESS_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Square API not configured. Please set SQUARE_ACCESS_TOKEN in .env file"
        )

    try:
        # Fetch ALL catalog objects (items and categories)
        all_objects = []

        # Iterate through paginated results - fetch everything
        for obj in client.catalog.list():
            all_objects.append(obj)

        # Build category ID to name mapping
        category_map = {}
        for obj in all_objects:
            if obj.type == "CATEGORY" and hasattr(obj, 'category_data'):
                category_data = obj.category_data
                if hasattr(category_data, 'name'):
                    category_name = category_data.name.lower()
                    category_map[obj.id] = category_name
                    logger.info(f"Found category: {obj.id} -> {category_name}")

        # Organize items by category
        menu_data = {
            "dosas": [],
            "biryanis": [],
            "curries": [],
            "other": []
        }

        for item in all_objects:
            # Items are CatalogObject instances with attributes
            if item.type != "ITEM":
                continue

            # Access item_data attribute
            item_data = item.item_data if hasattr(item, 'item_data') else None
            if not item_data:
                continue

            # Get the first variation (assuming single variation per item)
            variations = item_data.variations if hasattr(item_data, 'variations') else []
            price = "$0.00"

            if variations and len(variations) > 0:
                variation = variations[0]
                if hasattr(variation, 'item_variation_data'):
                    variation_data = variation.item_variation_data
                    if hasattr(variation_data, 'price_money'):
                        price_money = variation_data.price_money
                        if hasattr(price_money, 'amount'):
                            amount = price_money.amount
                            # Convert from cents to dollars
                            price = f"${amount / 100:.2f}"

            # Get image URL if available
            image_url = None
            image_ids = item_data.image_ids if hasattr(item_data, 'image_ids') else []
            if image_ids and len(image_ids) > 0:
                try:
                    # Fetch image details using batch_get
                    response = client.catalog.batch_get(
                        object_ids=[image_ids[0]]
                    )
                    # Access the objects from the response
                    if hasattr(response, 'objects') and response.objects:
                        image_obj = response.objects[0]
                        if hasattr(image_obj, 'image_data'):
                            image_data = image_obj.image_data
                            if hasattr(image_data, 'url'):
                                image_url = image_data.url
                except Exception as e:
                    logger.warning(f"Failed to fetch image for item {item.id}: {str(e)}")

            # Get category name from item's categories
            category_name = None
            categories = item_data.categories if hasattr(item_data, 'categories') else []
            if categories and len(categories) > 0:
                # Get first category ID
                first_category = categories[0]
                if hasattr(first_category, 'id'):
                    category_id = first_category.id
                    category_name = category_map.get(category_id)
                    logger.info(f"Item {item_data.name} has category: {category_name}")

            # Build menu item
            menu_item = {
                "id": item.id,
                "name": item_data.name if hasattr(item_data, 'name') else "Unknown Item",
                "description": item_data.description if hasattr(item_data, 'description') else "",
                "price": price,
                "image": image_url,
                "category": category_name or ""
            }

            # Categorize by Square category name first, then fall back to name matching
            if category_name:
                if "dosa" in category_name:
                    menu_data["dosas"].append(menu_item)
                elif "biryani" in category_name:
                    menu_data["biryanis"].append(menu_item)
                elif "curry" in category_name or "curries" in category_name:
                    menu_data["curries"].append(menu_item)
                else:
                    menu_data["other"].append(menu_item)
            else:
                # Fallback to name-based categorization
                item_name_lower = menu_item["name"].lower()
                if "dosa" in item_name_lower:
                    menu_data["dosas"].append(menu_item)
                elif "biryani" in item_name_lower:
                    menu_data["biryanis"].append(menu_item)
                elif "curry" in item_name_lower or "butter chicken" in item_name_lower or "paneer butter" in item_name_lower:
                    menu_data["curries"].append(menu_item)
                else:
                    menu_data["other"].append(menu_item)

        return menu_data

    except Exception as e:
        logger.error(f"Error fetching menu: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching menu: {str(e)}"
        )


@app.get("/api/categories")
async def get_categories():
    """
    Fetch all categories from Square Catalog API
    """
    if not SQUARE_ACCESS_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Square API not configured"
        )

    try:
        categories = []

        # Iterate through paginated results
        for category in client.catalog.list(types="CATEGORY"):
            if category.type != "CATEGORY":
                continue

            category_data = category.category_data if hasattr(category, 'category_data') else None
            if not category_data:
                continue

            categories.append({
                "id": category.id,
                "name": category_data.name if hasattr(category_data, 'name') else "Unknown Category"
            })

        return {"categories": categories}

    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching categories: {str(e)}"
        )


@app.get("/api/items/{item_id}")
async def get_item(item_id: str):
    """
    Fetch a specific item by ID from Square Catalog API
    """
    if not SQUARE_ACCESS_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Square API not configured"
        )

    try:
        # Use batch_get to retrieve a single item
        result = client.catalog.batch_get(
            object_ids=[item_id],
            include_related_objects=True
        )

        # The result should be a list of objects
        if not result or len(result) == 0:
            raise HTTPException(
                status_code=404,
                detail="Item not found"
            )

        # Return the first (and only) item
        return result[0]

    except Exception as e:
        logger.error(f"Error fetching item: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching item: {str(e)}"
        )


# Pydantic models for payment requests
class OrderLineItem(BaseModel):
    item_id: str
    name: str
    quantity: int
    price: str  # e.g., "$14.00"


class CreateOrderRequest(BaseModel):
    line_items: List[OrderLineItem]
    idempotency_key: Optional[str] = None


class CreatePaymentRequest(BaseModel):
    source_id: str  # Payment token from Square Web Payments SDK
    order_id: str
    amount_money: int  # Amount in cents
    idempotency_key: Optional[str] = None


@app.post("/api/orders/create")
async def create_order(request: CreateOrderRequest):
    """
    Create a Square order from cart items
    """
    if not SQUARE_ACCESS_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Square API not configured"
        )

    try:
        # Get location ID (required for orders)
        locations_response = client.locations.list()

        if not hasattr(locations_response, 'locations') or not locations_response.locations:
            raise HTTPException(
                status_code=500,
                detail="No Square location found. Please configure a location in your Square account."
            )

        location_id = locations_response.locations[0].id

        # Build line items for Square order
        square_line_items = []
        for item in request.line_items:
            # Convert price string to cents (e.g., "$14.00" -> 1400)
            price_str = item.price.replace('$', '').replace(',', '')
            price_cents = int(float(price_str) * 100)

            square_line_items.append({
                "name": item.name,
                "quantity": str(item.quantity),
                "base_price_money": {
                    "amount": price_cents,
                    "currency": "USD"
                }
            })

        # Create the order
        idempotency_key = request.idempotency_key or str(uuid.uuid4())

        result = client.orders.create(

            idempotency_key=idempotency_key,
            order={
                "location_id": location_id,
                "line_items": square_line_items,
            }
            
        )

        if result.errors:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create order: {result.errors}"
            )

        order = result.order

        return {
            "order_id": order.id,
            "total_money": {
                "amount": order.total_money.amount,
                "currency": order.total_money.currency
            },
            "location_id": location_id
        }

    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating order: {str(e)}"
        )


@app.post("/api/payments/create")
async def create_payment(request: CreatePaymentRequest):
    """
    Process a payment for an order
    """
    if not SQUARE_ACCESS_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Square API not configured"
        )

    try:
        # Get location ID
        locations_response = client.locations.list()

        if not hasattr(locations_response, 'locations') or not locations_response.locations:
            raise HTTPException(
                status_code=500,
                detail="No Square location found"
            )

        location_id = locations_response.locations[0].id

        # Create payment
        idempotency_key = request.idempotency_key or str(uuid.uuid4())

        result = client.payments.create(

                idempotency_key=idempotency_key,
                source_id=request.source_id,
                amount_money={
                    "amount": request.amount_money,
                    "currency": "USD"
                },
                location_id=location_id,
                order_id=request.order_id

        )

        if result.errors :
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create payment: {result.errors}"
            )

        payment = result.payment

        return {
            "payment_id": payment.id,
            "status": payment.status,
            "receipt_url": payment.receipt_url,
            "order_id": payment.order_id
        }

    except Exception as e:
        logger.error(f"Error creating payment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating payment: {str(e)}"
        )


# Lambda handler (for AWS deployment)
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    # Mangum not installed (local development)
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
