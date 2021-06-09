import { writable } from 'svelte/store';

const createDarkMmode = () => {
   const {subscribe, set} = writable(true);

   return {
      subscribe,
      set,
      toggleTheme: (theme) => {
         set(!theme);
         document.body.classList.toggle('dark-theme');
      },
   };
};

export const darkMode = createDarkMmode();