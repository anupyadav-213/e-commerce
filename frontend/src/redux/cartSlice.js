import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const payload = action.payload;
            const normalizedItem = {
                ...payload,
                qty: payload.qty ?? payload.quantity ?? 1,
                productId: payload.productId ?? payload.id ?? payload._id,
            };

            const existItem = state.cartItems.find((x) =>
                x.productId === normalizedItem.productId || x.id === normalizedItem.productId || x._id === normalizedItem.productId
            );

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.productId === normalizedItem.productId || x.id === normalizedItem.productId || x._id === normalizedItem.productId
                        ? { ...x, ...normalizedItem }
                        : x
                );
            } else {
                state.cartItems = [...state.cartItems, normalizedItem];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) =>
                x.productId !== itemId && x.id !== itemId && x._id !== itemId
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;