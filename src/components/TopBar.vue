<template>
    <div class="top-bar-div">
        <div class="elements">
            <a class="app-href" href="https://aciyo-mu-m3gt.vercel.app">
                <img class="app-logo" src="@/assets/app-logo.png" alt="App Logo" />
                Açıyo mu
            </a>
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
    height: 100px;
    background-image: linear-gradient(black, transparent);
    z-index: 1;
}

.top-bar-div a {
    color: #fafafa;
    font-family: monospace;
    font-weight: 900;
    font-size: 1.3rem;
}

.elements {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 10px;
}

#github-link {
    width: 40px;
    height: 40px;
}

.github-logo {
    object-fit: contain;
    width: 100%;
    height: 100%;
}

.app-href {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
}

.app-logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
</style>
