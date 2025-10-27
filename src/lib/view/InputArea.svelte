<script>
    import sendSvg from '../../assets/send.svg'
    import settingsSvg from '../../assets/settings.svg'

    let { value = $bindable(), onClickSettings, onClickSend} = $props();
    
    let textarea;
    let maxHeight = 120;

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();
                onClickSend();
            }
        }
    }

    $effect(() => {
        value;
        console.log("EFFECT", textarea.scrollHeight);

        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = newHeight + "px";
    });
</script>

<div class="chat-wrapper">
    <div class="textarea-container">
        <textarea
            bind:this={textarea}
            bind:value
            onkeydown={handleKeyDown}
            placeholder="Введите сообщение..."
            rows="1"
        ></textarea>
        <div class="buttons">
            <button class="send-button" onclick={onClickSettings}>
                <img height="20px" src={settingsSvg} alt="Star icon" />
            </button>
            <button class="send-button" onclick={onClickSend}>
                <img height="20px" src={sendSvg} alt="Star icon" />
            </button>
        </div>
    </div>
</div>

<style>
    .chat-wrapper {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: auto;
    }

    .textarea-container {
        display: flex;
        flex-direction: column;
        position: relative;
        background: white;
        border: 1px solid #ddd;
        border-radius: 24px;
        padding: 8px;
        min-width: 60vw;
    }

    textarea {
        width: 100%;
        border: none;
        outline: none;
        resize: none;
        min-height: 24px;
        max-height: 120px;
        font-size: 14px;
        line-height: 1.4;
        background: transparent;
        padding: 0;
        margin: 0;
    }

    .buttons {
        align-self: flex-end;
        display: flex;
        gap: 4px;
        margin-top: 8px;
    }
    .send-button {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: var(--orange-primary);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .send-button:hover {
        background-color: var(--orange-dark);
    }
</style>
