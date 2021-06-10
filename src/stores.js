import { writable } from 'svelte/store';

const createDarkMmode = () => {
   let theme = JSON.parse(localStorage.getItem("dark-mode"))
   if(theme === null) theme = true;

   const {subscribe, set} = writable(theme);

   subscribe((theme) => {
      theme 
         ? document.body.classList.add("dark-theme")
         : document.body.classList.remove("dark-theme");

      localStorage.setItem("dark-mode", JSON.stringify(theme));
   });

   return {
      subscribe,
      set
   };
};

export const darkMode = createDarkMmode();