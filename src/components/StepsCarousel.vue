<template>
    <div class="back-shadow"></div>
    <Carousel paginationColor="blue" paginationActiveColor="red" class="main">
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
    height: 450px;
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
    width: 100%;
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
</style>
