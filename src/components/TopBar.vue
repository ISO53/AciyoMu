<template>
    <div class="top-bar-div">
        <div class="elements">
            <a href="https://aciyo-mu-m3gt.vercel.app">Açıyo mu</a>
            <a id="github-link" href="https://github.com/ISO53/AciyoMu" target="_blank" rel="noopener noreferrer">
                <img class="github-logo" src="@/assets/github-logo.svg" alt="GitHub Logo" />
            </a>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.top-bar-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 400px;
    background-image: linear-gradient(black, transparent);
}

.top-bar-div a {
    color: #fafafa;
    font-family: monospace;
    font-weight: 900;
    font-size: 1.4rem;
}

.elements {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 10px;
}

#github-link {
    width: 50px;
    height: 50px;
}

.github-logo {
    object-fit: contain;
    width: 100%;
    height: 100%;
}
</style>
