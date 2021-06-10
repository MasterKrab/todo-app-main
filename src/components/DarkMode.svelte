<script>
  import { darkMode } from "../stores";
</script>

<input
  type="checkbox"
  aria-label="Dark mode"
  class="toggle"
  bind:checked={$darkMode}
/>

<style lang="scss">
  .toggle {
    content: url(../assets/images/icon-moon.svg);
    position: relative;
    appearance: none;
    border: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
    user-select: none;
    transition: transform 0.3s;

    @media screen and (min-width: 768px) {
      width: 30px;
      height: 30px;
    }

    &:checked {
      content: url(../assets/images/icon-sun.svg);
      transform: rotate(360deg);
    }

    @media screen and (min-width: 768px) {
      transition: transform 0.3s, filter 0.2s;

      &:hover {
        filter: drop-shadow(5px 5px 5px rgba(255, 255, 255, 0.5));
      }
    }

    &:focus,
    &:focus-visible {
      outline: 3px dashed var(--text-color-hover);
      outline-offset: 5px;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }
</style>
