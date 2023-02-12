<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-7 py-3 py-md-5">
                    <p class="fs-1 fw-bold">A Simple Video Trimming App Made Just For You</p>
                    <p class="fs-4 fw-light py-3">Trim your videos in 3 easy steps</p>
                    <div class="row pb-5 text-center">
                        <div class="col">
                            <div class="steps-card border border-info p-2 shadow">
                                <span class="fs-3"><i class="bi bi-upload"></i></span>
                                <span>Upload your video file</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="steps-card border border-info p-2 shadow">
                                <span class="fs-3"><i class="bi bi-scissors"></i></span>
                                <span>Trim your video on our app</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="steps-card border border-info p-2 shadow">
                                <span class="fs-3"><i class="bi bi-download"></i></span>
                                <span>Download your video</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <router-link :to="{ name: 'EditPage' }" type="button" class="btn btn-primary py-3 text-white">
                            Let's start!
                        </router-link>
                    </div>
                </div>
                <div class="col-12 col-md-5 d-none d-md-block pt-5 p-lg-5">
                    <div class="d-flex justify-content-center align-items-center">
                        <img src="@/assets/video_upload.svg" class="img-fluid" alt="Video upload illustration">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "LandingPage",
};
</script>

<style lang="scss">
.steps-card {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}
</style>
