<!-- ChatMessage.svelte -->
<script>
    let { type, sender, data } = $props();
</script>

<div class="message {sender}">
    <div class="message-bubble">
        {#if type == "text"}
            <p class="message-content">{data}</p>
        {:else if (type == "link")}
            <a href={data.link}>{data.title} {data.distance}</a>
        {/if}
    </div>
</div>

<style>
    .message {
        display: flex;
        margin: 8px 0;
        padding: 0 16px;
    }

    .message.user {
        justify-content: flex-end;
    }

    .message.bot {
        justify-content: flex-start;
    }

    .message-bubble {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
        word-wrap: break-word;
        box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
    }

    .message.user .message-bubble {
        background: var(--bg-primary, #ffffff);
        color: var(--text-primary, #000000);
        border: 1px solid var(--border-light, #e8eaed);
        border-bottom-right-radius: 4px;
    }

    .message.bot .message-bubble {
        background: var(--orange-primary, #ff6b35);
        color: var(--text-inverse, #ffffff);
        border-bottom-left-radius: 4px;
    }

    .message-content {
        margin: 0;
        line-height: 1.4;
        font-size: 14px;
    }

    .message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
        text-align: right;
    }

    .message-status {
        font-size: 10px;
        margin-top: 2px;
        opacity: 0.6;
        text-align: right;
    }

    .message-bubble {
        animation: messageAppear 0.3s ease-out;
    }

    @keyframes messageAppear {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
</style>
