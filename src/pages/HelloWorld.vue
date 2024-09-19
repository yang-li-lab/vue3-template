 <template>
  <button @click="initCamera">拍照</button>
  <div class="camera">
    <video ref="video" autoplay playsinline class="video-preview"></video>
    <canvas ref="canvas" class="canvas-preview"></canvas>
    <div class="controls">
      <button @click="takePhoto" class="button capture">📸</button>
      <button  @click="recordVideo" class="button record">🎥</button>
    
    </div>
  </div>
  <button @click="captureFrame" :disabled="!videoFile">Capture Frame</button>
  <div v-if="imageUrl">
    <h2>截取的视频帧:</h2>
    <img :src="imageUrl" alt="Extracted Frame"/>
  </div>
      <button @click="reset" :disabled="!videoFile">reset</button>
</template>

<script>
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util'
import { FFmpeg } from '@ffmpeg/ffmpeg'
export default {
  data() {
    return {
      mediaStream: null,
      mediaRecorder: null,
      videoChunks: [],
      recording: false,
      ffmpeg: null,
      videoFile: null,
      imageUrl: null,
    };
  },

  async created() {
    this.ffmpeg=  new FFmpeg()
   
    await this.ffmpeg.load();
  },
  mounted() {
    this.initCamera();
  },
  methods: {
    reset() {
      this.videoFile = null
      this.videoChunks = []
    },
    async initCamera() {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video:{facingMode: "environment",}, audio:false});
        this.$refs.video.srcObject = this.mediaStream;
      } catch (error) {
        console.error('Error accessing camera: ', error);
      }
    },
    takePhoto() {
      const videoElement = this.$refs.video;
      const canvasElement = this.$refs.canvas;
      
      const context = canvasElement.getContext('2d');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      canvasElement.toBlob(blob => {
        const file = new File([blob], 'photo.png', { type: 'image/png' });
        console.log('Photo file: ', file);
        // You can now upload this file or do whatever you want with it
      }, 'image/png');
    },
    recordVideo() {
      if (this.recording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    startRecording() {
      this.videoChunks = [];
      this.videoFile = []
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'video/webm; codecs=vp8',
      });
      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.videoChunks.push(event.data);
      
          this.videoFile.push(event.data)
        }
      };
      this.mediaRecorder.onstop = this.handleVideoStop;
      this.mediaRecorder.start();
      this.recording = true;
      setTimeout(() => {
        this.stopRecording();
        setTimeout(() => {
          this.captureFrame()
        })
      }, 2000); // Record for 1 second
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.recording = false;
    },
    handleVideoStop() {
      const videoBlob = new Blob(this.videoChunks, { type: 'video/mp4' });
      const file = new File([videoBlob], 'video.webm', { type: 'video/mp4' });
      console.log('Video file: ', file);
      // You can now upload this file or do whatever you want with it
      this.videoFile = file
    
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.videoFile = file;
      }
    },
    async captureFrame() {
      if (!this.videoFile) return;

      try{
      const { ffmpeg } = this;
      const time = '00:00:01'; // 抓取指定时间的帧，可以根据需要调整
      const outputImage = 'screenshot.png';
      // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(this.videoFile));
      await ffmpeg.writeFile('input.mp4', await fetchFile(this.videoFile))
      // await ffmpeg.run('-i', 'input.mp4', '-ss', time, '-frames:v', '1', outputImage);
      await ffmpeg.exec(['-i', 'input.mp4', '-ss', time, '-frames:v', '1', outputImage])

      // const data = ffmpeg.FS('readFile', outputImage);
      const data=  await ffmpeg.readFile(outputImage)
      this.imageUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));

      }catch(err) {
        console.log('err',err.message)
      }
      
    },

  },
};
</script>

<style scoped>
.camera {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.video-preview, .canvas-preview {
  width: 100%;
  height: auto;
  max-width: 100%;
  display: block;
}

.controls {
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.button {
  background: none;
  border: none;
  color: white;
  font-size: 2.5em;
  cursor: pointer;
  margin: 0 20px;
}

.button.capture {
  color: #4caf50; /* Green */
}

.button.record {
  color: #f44336; /* Red */
}
</style> 
