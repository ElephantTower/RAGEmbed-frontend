<script>
    import Metric from "../data/Metric";
    import ModelName from "../data/ModelName";
    import Modal from "./Modal.svelte";

    let {
        showModal = $bindable(),
        topChunks = $bindable(),
        topDocuments = $bindable(),
        stream = $bindable(),
        metric = $bindable(),
        modelName = $bindable(),
    } = $props();

</script>

<Modal bind:showModal>
    {#snippet header()}
        <h3>Настройки поиска</h3>
    {/snippet}

    <div class="horizontal-container">
        <div class="vertical-container">
            {#each Object.values(Metric) as curMetric}
                <label>
                    <input
                        type="radio"
                        name="metric"
                        value={curMetric}
                        bind:group={metric}
                    />
                    {curMetric}
                </label>
            {/each}
        </div>

        <div class="vertical-container">
            {#each Object.values(ModelName) as curModelName}
                <label>
                    <input
                        type="radio"
                        name="model name"
                        value={curModelName}
                        bind:group={modelName}
                    />
                    {curModelName}
                </label>
            {/each}
        </div>
    </div>

    <label>
        <input type="range" bind:value={topChunks} min={1} max={50} />
        {topChunks}
    </label>

    <label>
        <input type="range" bind:value={topChunks} min={1} max={50} />
        {topChunks}
    </label>

    <label>
        <input type="range" bind:value={topDocuments} min={1} max={50} />
        {topDocuments}
    </label>

    <label>
        <input type="checkbox" bind:checked={stream} />
    </label>
</Modal>
