<script>
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { nanoid as id } from "nanoid";
  import defaultTodos from "./defaultTodos";

  // Todo

  let todos = JSON.parse(localStorage.getItem("todos")) || defaultTodos;

  let todo = {
    title: "",
    id: id(),
    done: false,
  };

  const handleNewTodo = () => {
    if (todo.title.trim().length > 0) {
      todos = [...todos, todo];
      todo = { title: "", id: id(), done: false };
    }
  };

  const handleDeleteTask = (id) => {
    const filterTodos = todos.filter((todo) => todo.id !== id);
    todos = filterTodos;
  };

  const handleClearCompleted = () => {
    const filterTodos = todos.filter((todo) => !todo.done);
    todos = filterTodos;
  };

  $: localStorage.setItem("todos", JSON.stringify(todos));

  let filterClass = "all";

  let filterCb = (todo) => todo;

  $: filterTodos = () => todos.filter((todo) => filterCb(todo));

  const handleShowAll = () => {
    filterCb = (todo) => todo;
    filterClass = "all";
  };

  const handleFilterActive = () => {
    filterCb = (todo) => !todo.done;
    filterClass = "active";
  };

  const handleFilterCompleted = () => {
    filterCb = (todo) => todo.done;
    filterClass = "completed";
  };

  // Drag and drop

  let drag = false;

  let ghostWidth = 300;

  let elementDragIndex = 0;

  let mouseIsDown = false;

  let position = { x: 0, y: 0 };

  let touches = [];

  const handleMouseDown = (e) => {
    const todoElement = e.target.parentElement;
    mouseIsDown = true;

    if (!drag && mouseIsDown && e.target.classList.contains("todo__drag")) {
      ghostWidth = todoElement.offsetWidth;
      elementDragIndex = todoElement.dataset.index;
      drag = true;
      moveGhost(e);
    }
  };

  const moveGhost = (e) => {
    const elementMoving = document.getElementById(elementDragIndex);

    touches = e.touches;

    position.y =
      (e.pageY ? e.pageY : touches[0].pageY) -
      elementMoving.offsetHeight / 2 +
      document.body.scrollTop;
    position.x =
      (e.pageX ? e.pageX : touches[0].pageX) - elementMoving.offsetWidth / 2;
  };

  const handleMouseMove = (e) => {
    drag && mouseIsDown ? moveGhost(e) : null;
  };

  const handleMouseUp = (e) => {
    mouseIsDown = false;
    if (drag) {
      let elementDropindex = document.elementsFromPoint(
        e.pageX ? e.pageX : touches[0].pageX,
        e.pageY ? e.pageY : touches[0].pageY
      );

      elementDropindex =
        parseInt(elementDropindex[1].dataset.index) > elementDragIndex
          ? elementDropindex[1].dataset.index
          : elementDropindex[2].dataset.index;

      todos.splice(elementDropindex, 0, todos.splice(elementDragIndex, 1)[0]);
      todos = todos;

      drag = false;
    }
  };
</script>

<svelte:window
  on:touchmove={handleMouseMove}
  on:touchend={handleMouseUp}
  on:mousemove={handleMouseMove}
/>

<main class="main" class:no-selected={drag}>
  <form class="new-todo" on:submit|preventDefault={handleNewTodo}>
    <input
      type="checkbox"
      class="new-todo__checkbox"
      aria-label="New todo done"
      bind:checked={todo.done}
    />
    <input
      type="text"
      aria-label="New todo"
      placeholder="Create a new todo..."
      name="todo"
      class="new-todo__input"
      bind:value={todo.title}
    />
  </form>
  <div class="todo-result">
    <form>
      <ul class="todos" aria-live="polite">
        {#if filterTodos().length > 0}
          {#each filterTodos() as todo, index (todo)}
            <li
              class="todo"
              class:todo--position={drag && elementDragIndex == index}
              data-index={index}
              id={index}
              on:mousedown={handleMouseDown}
              on:touchstart={handleMouseDown}
              on:mouseup={handleMouseUp}
              style={drag && elementDragIndex == index
                ? `transform: translate(${position.x}px, ${position.y}px) rotate(2.5deg); 
                  --ghost-width: ${ghostWidth}px;`
                : ""}
              animate:flip={{ duration: drag ? 0 : 100 }}
              in:fade={{ duration: 200 }}
            >
              <input
                type="checkbox"
                id={todo.id}
                bind:checked={todo.done}
                disabled={drag}
                class="todo__checkbox"
              />
              <label class="todo__title" for={todo.id}>
                {todo.title}
              </label>
              <div class="todo__drag" />
              <button
                type="button"
                aria-label={`Delete task ${todo.title}`}
                class="todo__button"
                on:click={handleDeleteTask(todo.id)}
              />
            </li>
          {/each}
        {:else}
          <li class="todos__item">No todos yet</li>
        {/if}
      </ul>
    </form>
    <div class="filter">
      <p class="filter__text">
        {todos.filter((todo) => !todo.done).length} items left
      </p>
      <ul class="filter-list">
        <li class:active={filterClass === "all"}>
          <button class="filter-list__button" on:click={handleShowAll}
            >All</button
          >
        </li>
        <li class:active={filterClass === "active"}>
          <button class="filter-list__button" on:click={handleFilterActive}>
            Active
          </button>
        </li>
        <li class:active={filterClass === "completed"}>
          <button class="filter-list__button" on:click={handleFilterCompleted}
            >Completed</button
          >
        </li>
      </ul>
      <button class="filter__button" on:click={handleClearCompleted}
        >Clear Completed</button
      >
    </div>
  </div>
  <p class="drag">Drag and drop to reorder list</p>
</main>

<style lang="scss">
  $border-radius: 0.35rem;

  @mixin checkbox {
    display: inline-grid;
    place-items: center;
    position: relative;
    appearance: none;
    border: 1px solid var(--text-color-2);
    border-radius: 50%;
    margin: 15px 12px 15px 20px;
    min-width: 20px;
    height: 20px;
    cursor: pointer;
    @include focus-visible;
    @include scale-hover;

    @media screen and (min-width: 768px) {
      margin: 20px;

      &:hover {
        background-image: linear-gradient(
          var(--linear-gradient-1),
          var(--linear-gradient-2)
        );

        &::before {
          background-color: var(--element-color);
        }
      }
    }

    &::before {
      content: "";
      width: 90%;
      height: 90%;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &::after {
      content: "";
      background-image: url(../assets/images/icon-check.svg);
      width: 50%;
      height: 50%;
      transform: scale(0);
      transition: transform 0.2s;
    }

    &:checked {
      background-image: linear-gradient(
        var(--linear-gradient-1),
        var(--linear-gradient-2)
      );

      &::before {
        background-color: transparent;
      }

      &::after {
        transform: scale(1);
      }

      & + .todo__title {
        text-decoration: line-through;
        color: var(--text-color-2);
      }
    }
  }

  @mixin outline {
    outline: 3px dashed var(--text-color-hover);
    outline-offset: 5px;
  }

  @mixin focus-visible {
    &:focus,
    &:focus-visible {
      @include outline;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  @mixin scale-hover {
    @media screen and (min-width: 768px) {
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  @mixin reset-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .main {
    max-width: 540px;
    padding-bottom: 1rem;
    margin-top: 2.5rem;
    margin-left: auto;
    margin-right: auto;
  }

  .new-todo {
    display: flex;
    align-items: center;
    background-color: var(--element-color);
    border-radius: $border-radius;

    &__checkbox {
      @include checkbox;

      &:focus {
        @include outline;
      }
    }

    &__input {
      background-color: inherit;
      border: none;
      width: 80%;
      height: 50px;
      color: var(--text-color);

      &:focus {
        @include outline;
      }
    }
  }

  .todo-result {
    box-shadow: 0 30px 30px rgba(#000, 0.1);
    color: var(--text-color);
  }

  .todos {
    @include reset-list;
    margin-top: 1.5rem;
    background-color: var(--element-color);
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    overflow: hidden;
    text-align: center;

    &__item {
      margin-top: 1.5rem;
      margin-bottom: 0.2rem;
      font-size: 1.5rem;
    }
  }

  .todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--element-color);
    border-bottom: 1px solid var(--border-color);
    --button-opacity: 1;

    @media screen and (min-width: 768px) {
      --button-opacity: 0;

      &:hover {
        --button-opacity: 1;
      }
    }

    &--position {
      position: absolute;
      z-index: 10000;
      top: 0;
      left: 0;
      width: 300px;

      @media screen and (min-width: 768px) {
        width: var(--ghost-width);
      }
    }

    &__checkbox {
      @include checkbox;
      margin-right: 20px;
    }

    &__title {
      margin-top: 1rem;
      margin-bottom: 1rem;
      margin-right: auto;
      transition: color 0.2s;
      text-align: start;
      overflow-wrap: break-word;
      cursor: pointer;
    }

    &__drag {
      content: url(../assets/images/object-selected.svg);
      cursor: move;
      width: 20px;
      height: 20px;
      opacity: var(--button-opacity);
      filter: invert(27%) sepia(38%) saturate(428%) hue-rotate(197deg)
        brightness(96%) contrast(89%);

      @media screen and (min-width: 768px) {
        transition: opacity 0.5s;
      }
    }

    &__button {
      background-image: url(../assets/images/icon-cross.svg);
      background-repeat: no-repeat;
      background-position: center;
      background-color: transparent;
      margin: 15px 20px 15px 20px;
      border: none;
      width: 12px;
      height: 12px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      opacity: var(--button-opacity);
      @include focus-visible;
      @include scale-hover;

      @media screen and (min-width: 768px) {
        transition: opacity 0.5s;
      }

      &:active {
        background-color: transparent;
      }
    }
  }

  @mixin button {
    background-color: transparent;
    padding: 0;
    border: none;
    color: inherit;
    cursor: pointer;
    @include focus-visible;

    @media screen and (min-width: 768px) {
      transition: color 0.2s;

      &:hover {
        color: var(--text-color-hover);
      }
    }
  }

  .filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    background-color: var(--element-color);
    padding: 1.25rem 1.25rem 1.5rem;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    color: var(--text-color-2);

    &__text {
      margin-top: 0;
      margin-bottom: 0;
    }

    &__button {
      @include button;
    }
  }

  .filter-list {
    display: flex;
    gap: 15px;
    background-color: var(--element-color);
    @include reset-list;

    @media screen and (max-width: 768px) {
      position: absolute;
      left: 50%;
      top: 75px;
      transform: translateX(-50%);
      justify-content: center;
      width: 100%;
      padding: 1rem;
      border-radius: $border-radius;
      font-size: 1.2rem;
    }

    &__button {
      @include button;
    }
  }

  .active {
    color: var(--bright-blue);
  }

  .drag {
    color: var(--text-color-2);
    text-align: center;
    margin-top: 50px;
    font-size: 1rem;

    @media screen and (max-width: 768px) {
      margin-top: 115px;
    }
  }

  .no-selected {
    user-select: none;
  }
</style>
