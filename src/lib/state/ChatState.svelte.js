import ModelName from "../data/ModelName.js"
import Metric from "../data/Metric.js"
import Api from "../data/Api.js"

class ChatState {
    #api = new Api()

    messages = $state([])

    input = $state("")
    model_name = $state(ModelName.ModelName)
    metric = $state(Metric.Cosine)
    length = $state(5)

    async send() {
        console.log($state.snapshot(this.messages))
        this.messages.push({ type: "text", sender: "user", data: this.input })
        console.log(this.input)
        this.input = ""
        console.log(this.input)

        try {
            const results = await this.#api.send({
                input: this.input,
                model_name: this.model_name,
                metric: this.metric,
                length: this.length
            })

            for (const result of results) {
                this.messages.push({ type: "link", sender: "bot", data: result })
            }
        }
        catch (error) {
            this.messages.push({ type: "text", sender: "bot", data: error.message })
        }
    }
}

const chatState = new ChatState()
export default chatState