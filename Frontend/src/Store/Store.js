import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
	persist(
		(set) => ({
			data: null,
			setData: (d) => set({ data: d }),

			clearData: () => set({ data: null }),

			isDarkMode: false,
			toggleDarkMode: () =>
				set((state) => ({ isDarkMode: !state.isDarkMode })),
			
            lang: 'en',
			setLang: (lang) => set({ lang }),
		}),
		{
			name: "SIH", // Name of the key in local storage
			partialize: (state) => state, // Optionally persist only specific keys (currently persists all)
		}
	)
);

export default useStore;
