<template>
    <div class="back-shadow"></div>
    <Carousel class="main" :mouseDrag="false" :touchDrag="false">
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
            <div class="carousel__item take-photo-div">
                <h1>Elinin Fotoğrafını Çek</h1>
                <button @click="takePhoto"></button>
            </div>
        </Slide>
        <Slide key="3">
            <div class="carousel__item choose-joker-div">
                <h1>Jokeri Seç</h1>
                <div style="margin-top: 10px">
                    <div>
                        <label for="number">Numara</label>
                        <VueScrollPicker :options="numberOptions" v-model="jokerNumber" :dragSensitivity="0.5" />
                    </div>
                    <div>
                        <label for="color">Renk</label>
                        <VueScrollPicker :options="colorOptions" v-model="jokerColor" :dragSensitivity="0.5" />
                    </div>
                </div>
            </div>
        </Slide>
        <Slide key="4">
            <div class="carousel__item result-div">
                <button @click="sendData">Sonucu Öğren</button>
            </div>
        </Slide>

        <template #addons>
            <Pagination />
            <Navigation />
        </template>
    </Carousel>
</template>

<script>
import {defineComponent, ref} from "vue";
import {Carousel, Pagination, Slide, Navigation} from "vue3-carousel";
import {VueScrollPicker} from "vue-scroll-picker";
import "vue3-carousel/dist/carousel.css";
import "vue-scroll-picker/lib/style.css";

export default defineComponent({
    name: "StepsCarousel",
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
        VueScrollPicker,
    },
    setup() {
        const photo = ref(null);
        const jokerNumber = ref(null);
        const jokerColor = ref(null);

        const takePhoto = () => {
            const video = document.querySelector("video");
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            photo.value = canvas.toDataURL("image/jpeg");
        };

        const sendData = async () => {
            const data = {
                image: photo.value,
                number: jokerNumber.value,
                color: jokerColor.value,
            };

            try {
                const response = await fetch("http://localhost:8000/api/process-image", { // aciyomu-iso53s-projects.vercel.app
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.error("Error sending data:", error);
            }
        };

        return {
            takePhoto,
            sendData,
            jokerNumber,
            jokerColor,
            numberOptions: Array.from({length: 13}, (v, k) => k + 1),
            colorOptions: ["Kırmızı", "Siyah", "Mavi", "Sarı"],
        };
    },
});
</script>

<style>
.back-shadow {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 200px;
    background-image: linear-gradient(to top, black, transparent);
}

.main {
    position: absolute;
    width: 100%;
    bottom: 15px;
    left: 0;
}

.carousel__item {
    font-family: monospace;
    width: 85%;
    color: white;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
    padding-bottom: 0px;
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
    padding: 10px 10px 0 10px;
}

.carousel__pagination-button::after {
    background-color: rgb(100, 100, 100);
}

.carousel__pagination-button--active::after {
    background-color: white;
}

.carousel__prev,
.carousel__next {
    box-sizing: content-box;
    color: white;
}

.take-photo-div {
    align-items: center;
}

.take-photo-div h1 {
    font-size: 0.8rem;
    color: rgb(200, 200, 200);
}

.take-photo-div button {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin-top: 10px;
    border: none;
}

.take-photo-div button:active {
    background-color: rgb(200, 200, 200);
}

.choose-joker-div {
    align-items: center;
}

.choose-joker-div h1 {
    font-size: 0.8rem;
    color: rgb(200, 200, 200);
}

.choose-joker-div > div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
}

.choose-joker-div > div > div {
    width: 100%;
}

.chooser {
    border: 2px solid white;
    border-radius: 5px;
}

.result-div {
    align-items: center;
    justify-content: flex-end;
}

.result-div button {
    width: 150px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid white;
    background-color: transparent;
    text-transform: uppercase;
    font-family: monospace;
    font-weight: 900;
    letter-spacing: 1px;
    color: white;
}

.result-div button:active {
    background-color: white;
    color: black;
}

.vue-scroll-picker {
    max-height: 75px;
}

.vue-scroll-picker-item {
    color: rgb(200, 200, 200);
    transition: transform 100ms ease;
}

.vue-scroll-picker-item-selected {
    color: white;
    transform: scale(110%);
}

.vue-scroll-picker-layer-top {
    background: inherit;
}

.vue-scroll-picker-layer-bottom {
    background: inherit;
}
</style>
