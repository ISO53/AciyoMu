<template>
    <Carousel class="main">
        <Slide key="1">
            <div class="carousel__item">
                <h1>Açıyo mu?</h1>
                <p>
                    Açıyo mu sitesine hoş geldin. Sen okeydeki elinin fotoğrafını bize yolla, biz elinin açıp açmadığını sana
                    söyleyelim.
                </p>
            </div>
        </Slide>
        <Slide key="2">
            <div class="carousel__item">2</div>
        </Slide>
        <Slide key="3">
            <div class="carousel__item">3</div>
        </Slide>

        <template #addons>
            <Pagination />
        </template>
    </Carousel>
</template>

<script>
import {defineComponent} from "vue";
import {Carousel, Pagination, Slide} from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
    name: "Basic",
    components: {
        Carousel,
        Slide,
        Pagination,
    },
});
</script>

<style>
.main {
    position: absolute;
    width: 100%;
    bottom: 0;
}

.carousel__item {
    font-family: monospace;
    min-height: 200px;
    width: 100%;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px
}

.carousel__item h1 {
    font-weight: 500;
}

.carousel__item p {
    text-align: left;
    font-weight: 100;
    color: #aaaaaa;
}

.carousel__slide {
    padding: 10px;
}
</style>
