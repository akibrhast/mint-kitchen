const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Fetch menu data from the backend API
 * @returns {Promise<Object>} Menu data organized by category
 */
export const fetchMenuData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menu`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.warn('Failed to fetch menu from API:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch categories from the backend API
 * @returns {Promise<Object>} Categories data
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.warn('Failed to fetch categories from API:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch a single item by ID
 * @param {string} itemId - The item ID
 * @returns {Promise<Object>} Item data
 */
export const fetchItem = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.warn(`Failed to fetch item ${itemId} from API:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Create a Square order from cart items
 * @param {Array} lineItems - Array of {item_id, name, quantity, price}
 * @returns {Promise<Object>} Order data with order_id and total
 */
export const createOrder = async (lineItems) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ line_items: lineItems }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Failed to create order:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Process payment for an order
 * @param {string} sourceId - Payment token from Square Web Payments SDK
 * @param {string} orderId - Square order ID
 * @param {number} amountMoney - Amount in cents
 * @returns {Promise<Object>} Payment result
 */
export const createPayment = async (sourceId, orderId, amountMoney) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: sourceId,
        order_id: orderId,
        amount_money: amountMoney,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Failed to process payment:', error.message);
    return { data: null, error: error.message };
  }
};
