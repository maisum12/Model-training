// src/reducers/cartReducer.js
export const initialCartState = {
  items: [],
  promoCode: '',
  discountPercent: 0,
  promoError: '',
};

const VALID_PROMOS = {
  WELCOME10: 10,
  FEAST20: 20,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => i.id === action.payload.id);
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1, note: '' }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i),
      };
    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0),
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, note: action.payload.note } : i),
      };
    case 'CLEAR_CART':
      return initialCartState;
    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase();
      if (VALID_PROMOS[code] !== undefined) {
        return { ...state, promoCode: code, discountPercent: VALID_PROMOS[code], promoError: '' };
      }
      return { ...state, promoError: 'Invalid promo code' };
    }
    case 'REMOVE_PROMO':
      return { ...state, promoCode: '', discountPercent: 0, promoError: '' };
    default:
      return state;
  }
}