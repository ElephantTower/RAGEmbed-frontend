export default class Api {
    constructor(baseURL = `${window.location.href}/api/rag`) {
        this.baseURL = baseURL;
    }

    async send(data) {
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
}