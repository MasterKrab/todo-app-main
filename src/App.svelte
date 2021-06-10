<script>
  import Header from "./components/Header.svelte";
  import Todo from "./components/Todo/Todo.svelte";
</script>

<Header />
<Todo />

<style lang="scss">
  :global(html) {
    overflow-x: hidden;
  }

  :global(body) {
    background-image: url(../assets/images/bg-mobile-light.jpg);
    background-repeat: no-repeat;
    background-size: contain;
    background-color: var(--primary-color);
    font-family: "Josefin Sans", sans-serif;
    padding: 50px 25px;
    transition: background-color 0.2s;
    overflow-x: hidden;

    @media screen and (min-width: 768px) {
      background-image: url(../assets/images/bg-desktop-light.jpg);
      padding-top: 75px;
      padding-bottom: 75px;
    }
  }

  :global(body::-webkit-scrollbar) {
    width: 8px;
  }

  :global(body::-webkit-scrollbar-track) {
    background-color: var(--element-color);
  }

  :global(body::-webkit-scrollbar-thumb) {
    background-color: var((--text-color));
    border-radius: 5px;
  }

  :global(.dark-theme) {
    background-image: url(../assets/images/bg-mobile-dark.jpg);

    @media screen and (min-width: 768px) {
      background-image: url(../assets/images/bg-desktop-dark.jpg);
    }
  }
</style>
