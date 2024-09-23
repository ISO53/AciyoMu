<template>
    <div class="camera-background">
        <video ref="video" autoplay playsinline></video>
    </div>
</template>

<script>
export default {
    name: "CameraBackground",
    mounted() {
        this.startCamera();
    },
    methods: {
        async startCamera() {
            try {
                this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        },
    },
};
</script>

<style scoped>
.camera-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
