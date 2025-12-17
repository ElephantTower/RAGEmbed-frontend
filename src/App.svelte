<script>
  import InputArea from "./lib/view/InputArea.svelte";
  import chatState from "./lib/state/ChatState.svelte";
  import SettingsModal from "./lib/view/SettingsModal.svelte";
  import Message from "./lib/view/Message.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    chatState.getHistory();
  });

  let showModal = $state(false);

  let messagesEnd;

  function scrollToBottom() {
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
  $effect(() => {
    if (chatState.messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  });
</script>

<main>
  <div class="horizontal-container">
    <h1>RAGEMBED</h1>
    <button
      onclick={() => {
        chatState.deleteCookies();
      }}
      class="refresh-btn"
      title="Restart chat"
    >
      <svg class="refresh-icon" viewBox="0 0 24 24">
        <path
          d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
        />
      </svg>
    </button>
  </div>

  <div class="dialog">
    {#each chatState.messages as message}
      <Message type={message.type} sender={message.sender} data={message.data}
      ></Message>
    {/each}
  </div>
  <div bind:this={messagesEnd} class="scroll-anchor"></div>
  <SettingsModal
    bind:showModal
    bind:metric={chatState.metric}
    bind:topChunks={chatState.topChunks}
    bind:topDocuments={chatState.topDocuments}
    bind:stream={chatState.stream}
  ></SettingsModal>

  <InputArea
    bind:value={chatState.input}
    onClickSend={() => chatState.send()}
    onClickSettings={() => {
      showModal = true;
    }}
    isStreaming={chatState.isStreaming}
  ></InputArea>
</main>

<style>
  main {
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .refresh-btn {
    background: linear-gradient(135deg, var(--orange-secondary) 0%, var(--orange-dark) 100%);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .refresh-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .refresh-btn:active {
    transform: rotate(180deg) scale(0.95);
  }

  .refresh-icon {
    width: 24px;
    height: 24px;
    fill: white;
  }

  h1 {
    padding: 16px;
    margin: 0;
    flex-shrink: 0;
  }

  .dialog {
    flex: 1;
    overflow-y: auto;
    padding: 0px 0px 160px 0px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scroll-anchor {
    height: 1px;
    width: 100%;
    flex-shrink: 0;
  }

  .dialog::-webkit-scrollbar {
    width: 6px;
  }

  .dialog::-webkit-scrollbar-track {
    background: var(--bg-tertiary, #f1f3f4);
  }

  .dialog::-webkit-scrollbar-thumb {
    background: var(--orange-light, #ffb48f);
    border-radius: 3px;
  }

  .dialog::-webkit-scrollbar-thumb:hover {
    background: var(--orange-primary, #ff6b35);
  }
</style>
