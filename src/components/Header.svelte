<script>
  import DarkMode from "./DarkMode.svelte";
</script>

<header class="main-header">
  <h1 class="title">Todo</h1>
  <DarkMode />
</header>

<style lang="scss">
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
  }

  .title {
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1rem;
    margin-top: 0;
    margin-bottom: 0;

    @media screen and (min-width: 768px) {
      font-size: 2.5rem;
      letter-spacing: 1.3rem;
    }
  }
</style>
