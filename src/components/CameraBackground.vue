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
                const constraints = {
                    video: {
                        facingMode: {exact: "environment"},
                    },
                };
                this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
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
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
