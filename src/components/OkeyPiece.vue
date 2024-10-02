<template>
    <div class="okey-piece">
        <h1 v-if="type !== 'okey' && type !== 'fake_okey'" class="number" :style="{color: color}">{{ number }}</h1>
        <div v-if="type !== 'okey' && type !== 'fake_okey'" class="color" :style="{backgroundColor: color}"></div>

        <!-- for fake okey -->
        <div v-if="type === 'fake_okey'" class="star"></div>
        <div v-if="type === 'fake_okey'" class="oval"></div>
    </div>
</template>

<script>
export default {
    name: "OkeyPiece",
    props: {
        number: Number,
        color: String,
        type: String,
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

.star {
    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.4);
    width: 20px;
    aspect-ratio: 1;
    background: linear-gradient(217deg, red, transparent 70.71%), linear-gradient(127deg, yellow, transparent 70.71%),
        linear-gradient(336deg, blue, transparent 70.71%);
    clip-path: polygon(
        50% 0,
        calc(50% * (1 + sin(0.4turn))) calc(50% * (1 - cos(0.4turn))),
        calc(50% * (1 - sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
        calc(50% * (1 + sin(0.2turn))) calc(50% * (1 - cos(0.2turn))),
        calc(50% * (1 - sin(0.4turn))) calc(50% * (1 - cos(0.4turn)))
    );
}

.oval {
    width: 16px;
    height: 16px;
    border-radius: 20px;
    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.4);
    margin: 0;
    background: linear-gradient(217deg, red, transparent 70.71%), linear-gradient(127deg, yellow, transparent 70.71%),
        linear-gradient(336deg, blue, transparent 70.71%);
}
</style>
