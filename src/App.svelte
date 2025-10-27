<script>
  import InputArea from "./lib/view/InputArea.svelte";
  import chatState from "./lib/state/ChatState.svelte";
  import SettingsModal from "./lib/view/SettingsModal.svelte";
  import Message from "./lib/view/Message.svelte";

  let showModal = $state(false);

  let messagesEnd;

  function scrollToBottom() {
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  $effect(() => {
    if (chatState.messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  });
</script>

<main>
  <h1>RAGEMBED</h1>

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
    bind:modelName={chatState.model_name}
    bind:length={chatState.length}
  ></SettingsModal>

  <InputArea
    bind:value={chatState.input}
    onClickSend={() => chatState.send()}
    onClickSettings={() => {
      showModal = true;
    }}
  ></InputArea>
</main>

<style>
  main {
    height: 100vh;
    padding: 0;
    margin: 0;
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

  /* Стили для скроллбара (опционально) */
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
