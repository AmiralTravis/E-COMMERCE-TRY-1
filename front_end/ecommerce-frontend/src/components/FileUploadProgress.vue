<!-- /components/FileUploadProgress.vue -->

<template>
    <div v-if="isUploading" class="upload-overlay">
        <div class="upload-progress-container">
            <div class="upload-status">
                <!-- <div class="spinner-container">
                    <svg class="spinner" viewbox="0 0 50 50">
                        <circle class="spinner-path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
                    </svg>
                </div> -->
                <div class="spinner-container">
  <svg class="spinner" viewBox="0 0 50 50">
    <circle 
      class="spinner-path" 
      cx="25" 
      cy="25" 
      r="20" 
      fill="none" 
      stroke-width="4"
    ></circle>
  </svg>
</div>
                <div class="progress=bar-conntainer">
                    <div class="progress-bar-label">Uploading {{ currentFile }}</div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" :style="`width: ${progress}%`"></div>
                    </div>
                    <div class="progress-text">{{progress}}% Complete</div>
                </div>
                <div v-if="fileCount > 1" class="file-counter">
                    {{ completedFiles }} of {{ fileCount }} files uploaded
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {defineProps} from 'vue';

const propers = defineProps({
    isUploading: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    currentFile: {
        type: String,
        default: 'file'
    },
    fileCount: {
        type: Number,
        default: 1
    },
    completedFiles: {
        type: Number,
        default: 0
    }
});
</script>

<style scooped>
.upload-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.upload-progress-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    padding: 24px;
    width: 90%;
    max-width: 400px;
}

.upload-status{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.spinner-content {
    width: 60px;
    height: 60px;
    margin-bottom: 5px;
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
}
/* 
.spinner{
    stroke: #3b83f6;
    stroke-linecap: round;
    stroke-dasharray: 125.6;
    stroke-dashoffset: 125.6;
    transform-origin: center;
    animation: dash 1.5 ease-in-out infinite
} */

.spinner {
  animation: rotate 2s linear infinite;
  width: 60px;
  height: 60px;
  /* align-items: center; */

}

.spinner-path {
  stroke: #3b82f6;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
  stroke-dasharray: 126;
  stroke-dashoffset: 126;
}

.progress-bar-container {
    width: 100%;
}

.progress-bar-label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background-color: #3b82f6;
    border-radius: 4px;
    transition: width 0.3 ease;
}

.progress-text {
    font-size: 12px;
    color: #6b7280;
    margin-top: 8px;
    text-align: right;
}

.file-counter {
    font-size: 14px;
    color: #4b5563;
    font-weight: 500;
    background-color: #f3f4f6;
    padding: 4px 12px;
    border-radius: 16px;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

/* @keyframes dash {
    0% {
        stroke-dashoffset: 125.6;
    }

    50% {
        stroke-dashoffset: 31.4;
    }

    100% {
        stroke-dashoffset: 125.6;
    }
} */

@keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 31;
  }
  100% {
    stroke-dashoffset: 126;
  }
}

@media (max-width: 640px) {
    .upload-progress-container {
        padding: 16px;
    }
}
</style>