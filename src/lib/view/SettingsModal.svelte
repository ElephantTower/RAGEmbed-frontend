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
    </div>

    <div class="horizontal-container">
        <p>Top chunks</p>
        <input type="range" bind:value={topChunks} min={1} max={50} />
        <p>{topChunks}</p>
    </div>

    <div class="horizontal-container">
        <p>Top documents</p>
        <input type="range" bind:value={topDocuments} min={1} max={50} />
        <p>{topDocuments}</p>
    </div>

    <div class="horizontal-container">
        <p>Stream</p>
        <input type="checkbox" bind:checked={stream} />
    </div>
</Modal>
