<template>
    <div :class="['okey-result', {'full-screen': isFullScreen}]">
        <h1 v-if="!isFullScreen">{{ headerText }}</h1>
        <div v-if="isFullScreen" class="okey-rack">
            <div v-for="(group, groupIndex) in resultData" :key="groupIndex" class="okey-group">
                <OkeyPiece
                    v-for="(piece, pieceIndex) in group"
                    :key="pieceIndex"
                    :number="piece.number"
                    :color="piece.color"
                    :type="piece.type"
                />
            </div>
        </div>
        <h2 v-if="isFullScreen" class="score">Elin skoru: {{ score }}</h2>
    </div>
</template>

<script>
import OkeyPiece from "./OkeyPiece.vue";

export default {
    name: "OkeyResult",
    components: {
        OkeyPiece,
    },
    props: {
        headerText: String,
        isFullScreen: Boolean,
        resultData: Array,
        score: Number,
    },
};
</script>

<style scoped>
.okey-result {
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    width: auto;
    height: 40px;
    text-wrap: nowrap;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 100px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
}

.okey-result.full-screen {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 0;
    transform: translateX(0) translateY(0);
}

.okey-result h1 {
    font-size: 0.8rem;
    font-weight: 100;
    font-family: monospace;
    color: white;
}

.okey-rack {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    column-gap: 20px;
    row-gap: 5px;
}

.okey-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.score {
    font-weight: 900;
    margin-top: 20px;
    font-family: monospace;
    color: #fafafa;
}
</style>
