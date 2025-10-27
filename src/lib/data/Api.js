export default class Api {
    constructor(baseURL = 'http://localhost:3000/rag') {
        this.baseURL = baseURL;
    }

    async send(data) {
        const url = `${this.baseURL}/findSimmilar`
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}`
            );
        }

        const results = await response.json();
        return results;
    }
}