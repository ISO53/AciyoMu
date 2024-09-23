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
            <div class="carousel__item">
                <h1>Elinin Fotoğrafını Çek</h1>
                <button @click="takePhoto">Fotoğraf Çek</button>
            </div>
        </Slide>
        <Slide key="3">
            <div class="carousel__item">
                <h1>Jokeri Seç</h1>
                <label for="number">Numara:</label>
                <select id="number" v-model="jokerNumber">
                    <option v-for="n in 13" :key="n" :value="n">{{ n }}</option>
                </select>
                <label for="color">Renk:</label>
                <select id="color" v-model="jokerColor">
                    <option value="red">Kırmızı</option>
                    <option value="black">Siyah</option>
                    <option value="black">Mavi</option>
                    <option value="black">Sarı</option>
                </select>
            </div>
        </Slide>
        <Slide key="4">
            <div class="carousel__item">
                <h1>Sonuç</h1>
                <button @click="sendData">Sonucu Gönder</button>
            </div>
        </Slide>

        <template #addons>
            <Pagination />
        </template>
    </Carousel>
</template>

<script>
import {defineComponent, ref} from "vue";
import {Carousel, Pagination, Slide} from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
    name: "StepsCarousel",
    components: {
        Carousel,
        Slide,
        Pagination,
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
            photo.value = canvas.toDataURL("image/png");
        };

        const sendData = async () => {
            const data = {
                image: photo.value,
                number: jokerNumber.value,
                color: jokerColor.value,
            };

            try {
                const response = await fetch("https://aciyomu-iso53s-projects.vercel.app/api/process-image", {
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
        };
    },
});
</script>

<style>
.main {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
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
    padding: 20px;
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
