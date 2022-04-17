<script lang="ts">
  import { onMount } from "svelte";

  import Icon from "../components/Icon.svelte";
  import SimpleButton from "../components/SimpleButton.svelte";

  let user: Promise<User | { msg: string }> = new Promise(() => {});
  onMount(updateUser);

  async function updateUser() {
    user = await (await fetch("/api/current-user")).json();
  }

  function isValid(user: User | { msg: string }): user is User {
    return !(<{ msg: string }>user)?.msg;
  }

  async function logOut() {
    const response = await fetch("/api/log-out");
    if (response.ok) updateUser();
  }
</script>

<div id="main">
  <h1>OBS Now Playing</h1>
  <div class="buttons">
    <SimpleButton icon={{ name: "spotify", style: "brands" }} link="/api/login">
      Log in with Spotify
    </SimpleButton>
    <span>and then</span>
    <SimpleButton
      accent={false}
      icon={{ name: "list-check", style: "duotone" }}
    >
      Pick a skin
    </SimpleButton>
  </div>
</div>
<div id="current-status">
  {#await user}
    Loading
  {:then u}
    {#if isValid(u)}
      <div class="user">
        <a class="main" href="https://open.spotify.com/user/{u.id}">
          <img class="profile-picture" src={u.images[0].url} alt="profile" />
          <div class="content">
            <span class="display-name">{u.display_name}</span>
            <span class="id">{u.id}</span>
          </div>
        </a>
        <button class="log-out" title="Log out" on:click={logOut}>
          <Icon name="arrow-right-from-bracket" style="regular" />
        </button>
      </div>
    {:else}
      Not logged in
    {/if}
  {/await}
</div>

<style lang="scss">
  :global(html),
  :global(body) {
    height: 100%;
  }

  #main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    gap: 20px;

    .buttons {
      display: flex;
      flex-direction: column;
      place-items: center;
      gap: 7.5px;
    }
  }

  #current-status {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    .user {
      &,
      > .main {
        display: flex;
        flex-direction: row;
        gap: 7.5px;
      }

      place-items: center;

      .main {
        img {
          height: 45px;
          border-radius: 99px;
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .id {
            font-size: 14px;
            color: var(--bg-alt-shade4);
          }
        }
      }

      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        height: min-content;
        padding: 7.5px;
      }

      a,
      a :global(*) {
        text-decoration: none;
        color: var(--bg-alt);
      }
    }
  }
</style>
