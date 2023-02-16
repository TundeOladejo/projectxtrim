<template>
    <section>
        <div class="container">
            <div class="row py-3 mt-md-4 justify-content-center">
                    <div v-if="this.videoSrc != ''" class="videoPanel mb-3 col-12 col-md-7">
                        <video ref="videoPlayer" class="h-100 w-100 border border-primary-subtle rounded shadow" :src="videoSrc" id="video-preview" controls
                            @loadedmetadata="getDuration" />
                    </div>
                    <div v-else class="videoPanel border border-primary-subtle rounded empty shadow col-12 col-md-7 mb-3">
                        <span class="fs-1"><i class="bi bi-person-video2"></i></span>
                    </div>
                    <div class="video-thumbnails" ref="thumbnails"></div>
            </div>

            <!-- <div class="d-flex pt-3 pb-1 border rounded" v-if="this.videoSrc !=''"> -->
                <v-app v-if="this.videoSrc !=''">
                    <v-range-slider v-model="rangeValue" :min="0" :max="this.duration" strict thumb-label="always">
                        <template v-slot:thumb-label="{ modelValue }">
                            {{ this.fancyTimeFormat(modelValue.toFixed(0)) }}
                          </template>
                    </v-range-slider>
                </v-app>
            <!-- </div> -->
            
            <div class="row pt-4 align-items-center">
                <div class="col pb-3">
                    <span>
                        <label for="fileUpload">
                            <span class="border border-primary rounded py-3 px-4 shadow h-100 fs-5" role="button" aria-hidden="true">
                                <i class="bi bi-plus-lg"></i>
                            </span>
                            <input type="file" class="form-control form-control-lg d-none" id="fileUpload" accept="video/*"
                            @change="handleFileUpload" required/>
                        </label>
                    </span>
                </div>
                <div class="col pb-3">
                    <span>
                        <label for="revert">
                            <span class="border border-warning rounded py-1 px-2 shadow h-100 fs-5" role="button" @click="revertChanges" aria-hidden="true">
                                <i class="bi bi-arrow-clockwise"></i>
                            </span>
                        </label>
                    </span>
                </div>

                <div class="col pb-3">
                    <span class="fs-5">Duration <span class="badge text-bg-dark">
                        {{ fancyTimeFormat(this.duration) }}
                    </span></span>
                </div>
                    
                <div class="col pb-3">
                    <span>
                        <button class="btn btn-outline-danger btn-sm shadow" type="button"
                            @click="trimvideo" :disabled="this.videoSrc == ''">
                            <div class="spinner-border spinner-border-sm" role="status"
                                v-show="trimBtnText != 'Trim'">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            {{ trimBtnText }}<i class="bi bi-scissors"></i>
                        </button>
                    </span>
                </div>

                <div class="col pb-3" v-show="showDownload">
                    <span>
                        <a class="btn btn-outline-success btn-sm shadow" type="button" :href="videoSrc"
                            download>Download <i class="bi bi-download"></i></a>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { VRangeSlider, VApp } from 'vuetify/components'
import misc from "../utils/misc";

export default {
    name: "EditPage",
    components: { VRangeSlider, VApp },
    data() {
        return {
            videoSrc: '',
            duration: 0,
            trimBtnText: "Trim",
            showDownload: false,
            videoFile: null,
            fileName: null,
            rangeValue: [],
            oldVal: null
        };
    },
    watch: {
        rangeValue: function(value) {
            console.log(value)
        },
        videoSrc: function(newVal, oldVal) {
            this.oldVal = oldVal
        }
    },
    methods: {
        handleFileUpload(e) {
            this.clearForm()
            let file = e.target.files[0];
            this.fileName = file.name;
            let blobURL = URL.createObjectURL(file);
            this.videoFile = file
            this.videoSrc = blobURL;
        },
        getDuration: function() {
            this.duration = parseInt(this.$refs.videoPlayer.duration)
            this.rangeValue = [0, this.duration]
        },
        revertChanges() {
            this.videoSrc = this.oldVal;
            this.showDownload = false
        },
        fancyTimeFormat(totalSeconds) {
            return misc.fancyTimeFormat(totalSeconds)
        },
        trimvideo: async function () {
            this.trimBtnText = "Trimming";
            const ffmpeg = createFFmpeg({
                log: true,
            });
            await ffmpeg.load();
            ffmpeg.FS("writeFile", this.fileName, await fetchFile(this.videoFile));
            ffmpeg.setProgress(({ ratio }) => {
                this.trimBtnText = parseInt(ratio * 100).toFixed(2)
            });
            await ffmpeg.run("-i", this.fileName, '-ss', Math.floor(this.rangeValue[0]).toString(), '-to', Math.floor(this.rangeValue[1]).toString(), '-c', 'copy', "output.mp4");
            const data = ffmpeg.FS("readFile", "output.mp4");
            this.videoSrc = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );
            this.showDownload = true
            this.trimBtnText = "Trim";
        },
        clearForm() {
            this.rangeValue = [0, this.duration]
            this.showDownload = false
        },
    }
};
</script>

<style lang="scss">
.videoPanel {
    height: 350px;
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

.v-application__wrap {
    border: 1px solid black;
    border-radius: 8px;
    padding-top: 12px;
    min-height: unset !important;
}
</style>
