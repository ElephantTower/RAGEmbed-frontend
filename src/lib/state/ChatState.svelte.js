import ModelName from "../data/ModelName.js";
import Metric from "../data/Metric.js";
import Api from "../data/Api.js";

class ChatState {
  #api = new Api();
  #controller = null;

  messages = $state([]);
  input = $state("");
  model_name = $state(ModelName.Nomic);
  metric = $state(Metric.Cosine);
  length = $state(5);
  streaming = $state(false);

  async send({ stream = false } = {}) {
    this.messages.push({ type: "text", sender: "user", data: this.input });
    const curInput = this.input;
    this.input = "";

    if (!stream) {
      try {
        const result = await this.#api.send({
          input: curInput,
          metric: this.metric,
          topChunks: this.length,
          topDocuments: 2,
        });

        this.messages.push({ type: "text", sender: "bot", data: result.content});
        
      } catch (error) {
        this.messages.push({ type: "text", sender: "bot", data: error?.message ?? String(error) });
      }
      return;
    }

    const botMsg = { type: "text", sender: "bot", data: "" };
    this.messages.push(botMsg);
    const botIndex = $state.snapshot(this.messages).length - 1;

    this.streaming = true;
    this.#controller = this.#api.createController();

    try {
      await this.#api.streamMessage(
        {
          input: curInput,
          metric: this.metric,
          topChunks: this.length,
          topDocuments: 2,
        },
        {
          signal: this.#controller.signal,
          onOpen: async (response) => {
            // optional: read response body for errors
            // await Promise.resolve(); // keep as async to match signature
          },
          onToken: (token) => {
            // append token to temporary bot message
            this.messages[botIndex].data += token;
          },
          onDone: () => {
            this.streaming = false;
            // stream finished; messages[botIndex] contains final assistant text
          },
          onError: (err) => {
            this.streaming = false;
            this.messages.push({ type: "text", sender: "bot", data: err?.message ?? String(err) });
          },
          onClose: () => {
            this.streaming = false;
          },
        }
      );
    } catch (err) {
      this.streaming = false;
      this.messages.push({ type: "text", sender: "bot", data: err?.message ?? String(err) });
    } finally {
      this.#controller = null;
    }
  }

  cancelStream() {
    if (this.#controller) {
      this.#controller.abort();
      this.#controller = null;
      this.streaming = false;
    }
  }

  async refreshHistory() {
    try {
      const history = await this.#api.getHistory();
      this.messages = history.map(m => ({
        type: 'text',
        sender: m.role === 'assistant' ? 'bot' : 'user',
        data: m.content
      }));
    } catch (err) {
      console.error('Failed to refresh history', err);
    }
  }
}

const chatState = new ChatState();
export default chatState;