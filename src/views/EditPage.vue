<template>
    <section>
        <div class="container">
            <div class="row pt-3 pt-md-5">
                <div class="col-12 col-md-7">
                    <div v-if="this.videoSrc != ''" class="videoPanel mb-3">
                        <video ref="videoPlayer" class="h-100 w-100 border border-primary-subtle rounded" :src="videoSrc"
                            id="video-preview" controls @loadedmetadata="getDuration" />
                    </div>
                    <div v-else class="videoPanel mb-3 border border-primary-subtle rounded empty shadow">
                        <span class="fs-1"><i class="bi bi-person-video2"></i></span>
                    </div>

                    <div class="d-grid gap-3">
                        <label class="form-label" for="customFile">
                            Upload video to trim
                        </label>
                        <input type="file" class="form-control form-control-lg" id="customFile" accept="video/*"
                            @change="handleFileUpload" required />

                        <!-- <div class="mx-auto">
                            <button @click="transcode" class="btn btn-outline-primary py-3" v-show="isBtn"
                                :disabled="this.vidName == null">
                                {{ message }}
                            </button>
                        </div>

                        <div v-show="isProgress" class="progress" role="progressbar"
                            aria-label="Animated striped example" :aria-valuenow="percentageProgress" aria-valuemin="0"
                            aria-valuemax="100">
                            <div class="progress-bar progress-bar-striped progress-bar-animated"
                                :style="{ width: percentageProgress + '%' }"></div>
                        </div> -->
                    </div>
                </div>

                <div class="col-12 col-md-5">
                    <div class="row gap-4">
                        <div class="col">
                            <label for="customRange1" class="form-label">Start</label>
                            <input type="range" class="form-range" id="start" min="0" :max="this.duration"
                                v-model="start" />
                            <span class="badge text-bg-secondary">{{ fancyTimeFormat(this.start) }}</span>
                        </div>
                        <div class="col">
                            <label for="customRange1" class="form-label">End</label>
                            <input type="range" class="form-range" id="end" min="0" :max="this.duration"
                                v-model="end" />
                            <span class="badge text-bg-secondary">{{ fancyTimeFormat(this.end) }}</span>
                        </div>
                    </div>
                    <div class="row pt-3">
                        <span class="col-12 mb-3">Video Duration: <span class="badge text-bg-dark">{{
                            fancyTimeFormat(this.duration)
                        }}</span></span>
                        <span class="col-6">
                            <button class="btn btn-outline-danger py-3 py-lg-2 px-1 btn-sm" type="button"
                                @click="trimvideo" :disabled="this.videoSrc == ''">
                                <div class="spinner-border spinner-border-sm" role="status"
                                    v-show="trimBtnText != 'Trim'">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                {{ trimBtnText }}<i class="bi bi-scissors"></i>
                            </button>
                        </span>
                        <span class="col-6" v-show="showDownload">
                            <a class="btn btn-outline-success py-3 py-lg-2 px-1 btn-sm" type="button" :href="videoSrc"
                                download>Download<i class="bi bi-scissors"></i></a>
                        </span>
                        <span class="col-12">{{ trimError }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import misc from "../utils/misc";

export default {
    name: "EditPage",
    data() {
        return {
            videoSrc: '',
            start: 0,
            end: 0,
            message: "Upload",
            duration: null,
            isBtn: true,
            isProgress: false,
            percentageProgress: 0,
            trimBtnText: "Trim",
            showDownload: false,
            trimError: "",
            trimStart: 0,
            trimEnd: 0,
            trimming: false,
            trimHandle: null,
            videoFile: null,
            fileName: null
        };
    },
    methods: {
        handleFileUpload(e) {
            let file = e.target.files[0];
            this.fileName = file.name;
            let blobURL = URL.createObjectURL(file);
            this.videoFile = file
            this.videoSrc = blobURL;
        },
        getDuration() {
            this.duration = Math.floor(this.$refs.videoPlayer.duration)
        },
        fancyTimeFormat(totalSeconds) {
            return misc.fancyTimeFormat(totalSeconds)
        },
        trimvideo: async function () {
            this.trimBtnText = "Triming";
            const ffmpeg = createFFmpeg({
                log: true,
            });
            await ffmpeg.load();
            ffmpeg.FS("writeFile", this.fileName, await fetchFile(this.videoFile));
            ffmpeg.setProgress(({ ratio }) => {
                this.trimBtnText = parseInt(ratio * 100).toFixed(2)
            });
            await ffmpeg.run("-i", this.fileName, '-ss', this.start, '-to', this.end, '-c', 'copy', "output.mp4");
            const data = ffmpeg.FS("readFile", "output.mp4");
            this.videoSrc = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );
            this.showDownload = true
            this.clearForm()
            this.trimBtnText = "Trim";
        },
        clearForm() {
            this.start = 0
            this.end = 0
        },
    },
//     mounted() {
//     const canvas = this.$refs.canvas;
//     const video = this.$refs.video;
//     const ctx = canvas.getContext("2d");

//     video.addEventListener("play", () => {
//       const draw = () => {
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         requestAnimationFrame(draw);
//       };
//       draw();
//     });
//   }
};
</script>

<style lang="scss">
.videoPanel {
    height: 300px
}

video {
    object-fit: cover;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn:disabled {
    border: 1px solid grey;
    color: grey;
}

.trim-controls {
    position: relative;
    height: 30px;
    margin-top: 10px;
  }
  
  .trim-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 5px;
    background-color: blue;
    cursor: col-resize;
  }
  
  .start-handle {
    left: 0;
}

.end-handle {
  right: 0;
}
</style>
