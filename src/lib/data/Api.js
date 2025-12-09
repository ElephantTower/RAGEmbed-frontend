import { fetchEventSource } from '@microsoft/fetch-event-source';

export default class Api {
  constructor(baseURL = `${window.location.origin}/api/rag`) {
    this.baseURL = baseURL;
  }

  async findSimilar(data) {
        const url = `${this.baseURL}/findSimilar`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(
                `${JSON.stringify(response)} `
            );
        }

        const results = await response.json();
        return results;
    }

  async send(data) {
    const url = `${this.baseURL}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, stream: false }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
    }

    return res.json();
  }

  async streamMessage(data, options = {}) {
    const url = `${this.baseURL}/sendMessage`;
    const body = { ...data, stream: true };
    const {
      onToken = () => {},
      onDone = () => {},
      onError = () => {},
      onOpen = () => {},
      signal = undefined,
      onClose = () => {},
    } = options;

    try {
      await fetchEventSource(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
        async onopen(response) {
          await Promise.resolve(onOpen(response));
          if (!response.ok) {
            const err = new Error(`HTTP ${response.status}`);
            onError(err);
            throw err;
          }
        },
        onmessage(event) {
          let payload;
          try { payload = JSON.parse(event.data); } catch { return; }

          if (payload.token) onToken(payload.token);
          if (payload.done) onDone();
          if (payload.error) onError(new Error(String(payload.error)));
        },
        onerror(err) {
          onError(err);
        },
        onclose() {
          onClose();
        },
      });
    } catch (err) {
      onError(err);
      throw err;
    }
  }
  
  async getHistory() {
    const url = `${this.baseURL}/getHistory`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
    }
    return res.json();
  }

  createController() {
    return new AbortController();
  }
}