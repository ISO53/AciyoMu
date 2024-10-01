<template>
    <div class="okey-piece">
        <h1 class="number" :style="{ color: color }">{{ number }}</h1>
        <div class="color" :style="{ backgroundColor: color }"></div>
    </div>
</template>

<script>
export default {
    name: "OkeyPiece",
    props: {
        number: Number,
        color: String,
    },
};
</script>

<style scoped>
    .okey-piece {
        width: 40px;
        height: 60px;
        background-color: burlywood;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        border-radius: 5px;
        margin: 0 2px 2px 0;
    }

    .number {
        font-size: 1.1rem;
        font-weight: 900;
        text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.4);
        margin: 0;
        line-height: 1.1rem;
    }

    .color {
        width: 16px;
        height: 16px;
        border-radius: 20px;
        box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.4);
        margin: 0;
    }
</style>
