import ModelName from "../data/ModelName.js";
import Metric from "../data/Metric.js";
import Api from "../data/Api.js";

class ChatState {
  #api = new Api();
  #controller = null;

  messages = $state([]);
  input = $state("");
  metric = $state(Metric.Cosine);
  topChunks = $state(50);
  topDocuments = $state(2);
  stream = $state(true);

  isStreaming = $state(false);
  


  async send() {
    if (this.input == "") {
      return
    }

    this.messages.push({ type: "text", sender: "user", data: this.input });
    const curInput = this.input;
    this.input = "";

    console.log($state.snapshot(this.stream));

    if (!this.stream) {
      try {
        const result = await this.#api.send({
          input: curInput,
          metric: this.metric,
          topChunks: this.topChunks,
          topDocuments: this.topDocuments,
        });

        this.messages.push({ type: "text", sender: "bot", data: result.answer });

      } catch (error) {
        this.messages.push({ type: "text", sender: "bot", data: error?.message ?? String(error) });
      }
      return;
    }

    const botMsg = { type: "text", sender: "bot", data: "" };
    this.messages.push(botMsg);
    const botIndex = $state.snapshot(this.messages).length - 1;

    this.isStreaming = true;
    this.#controller = this.#api.createController();

    try {
      await this.#api.streamMessage(
        {
          input: curInput,
          metric: this.metric,
          topChunks: this.topChunks,
          topDocuments: this.topDocuments,
        },
        {
          signal: this.#controller.signal,
          onOpen: async (response) => {
            // optional: read response body for errors
            // await Promise.resolve(); // keep as async to match signature
          },
          onToken: (token) => {
            this.messages[botIndex].data += token;
          },
          onDone: () => {
            this.isStreaming = false;
          },
          onError: (err) => {
            this.isStreaming = false;
            this.messages.push({ type: "text", sender: "bot", data: err?.message ?? String(err) });
          },
          onClose: () => {
            this.isStreaming = false;
          },
        }
      );
    } catch (err) {
      this.isStreaming = false;
      this.messages.push({ type: "text", sender: "bot", data: err?.message ?? String(err) });
    } finally {
      this.#controller = null;
    }
  }

  cancelStream() {
    if (this.#controller) {
      this.#controller.abort();
      this.#controller = null;
      this.isStreaming = false;
    }
  }

  async getHistory() {
    try {
      const history = await this.#api.getHistory();
      console.log(history)
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