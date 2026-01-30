import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    items: number[]; // Product IDs
    addToWishlist: (productId: number) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    toggleWishlist: (productId: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToWishlist: (id) => set((state) => ({ items: [...state.items, id] })),
            removeFromWishlist: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
            isInWishlist: (id) => get().items.includes(id),
            toggleWishlist: (id) => {
                const { items, addToWishlist, removeFromWishlist } = get();
                if (items.includes(id)) {
                    removeFromWishlist(id);
                } else {
                    addToWishlist(id);
                }
            },
        }),
        {
            name: 'mall_wishlist',
        }
    )
);
