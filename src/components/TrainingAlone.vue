<template>

  <div id="main-container" class="container">

    <div id="join" v-if="!session">
      <div id="join-dialog" class="jumbotron vertical-center">

        <div class="form-group">
          <h3>Dein heutiges Workout:</h3>
          <p class="info">Intervall: 40/20, Dauer: 20 min, Übungen: 4</p>
          <p @click="gotoSquats()"><i class="fa fa-youtube-play" aria-hidden="true"></i> Squats (Level 1)</p>
          <p @click="gotoLunges()"><i class="fa fa-youtube-play" aria-hidden="true"></i> Lunges (Level 1)</p>
          <p @click="gotoSquatJump()"><i class="fa fa-youtube-play" aria-hidden="true"></i> Squat Jump (Level 1)</p>
          <p @click="gotoShuffle()"><i class="fa fa-youtube-play" aria-hidden="true"></i> Shuffle Run (Level 1)</p>

          <br><br><br>

          <p class="text-center">
            <button class="btn btn-lg btn-success" @click="joinSession()">Starten!</button>
          </p>
        </div>
      </div>
    </div>

    <div id="session" v-if="session">

      <div id="session-header">
        <h1 id="session-title">{{ mySessionId }}</h1>
      </div>

      <div id="video-container" class="bigvideo" style="width: 100%;">
        <user-video :stream-manager="mainStreamManager"/>
      </div>

      <div id="session-footer">
        <p style="font-weight: bold">{{ (isPause) ? 'Pause' : "Aktuelle Übung: " + currentExercise[currentIndex] }} </p>
        <p id="feedback">Bitte Knie weniger beugen</p>
      </div>
    </div>

    <input class="btn btn-large btn-danger endcall" type="button" id="buttonLeaveSession" @click="leaveSession"
           value="Training verlassen">

    <p id="timer"></p>

    <div id="nextExercise" v-if="!isPause && isTraining && showReadyPopup">
      <h3>Nächste Übung:</h3>
      <p>{{currentExercise[currentIndex]}}</p>
      <button class="btn btn-lg btn-success" @click="imReady()">Ich bin bereit</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import {OpenVidu} from 'openvidu-browser';
import UserVideo from './UserVideo';
import router from "../router";
import Vue from "vue";

axios.defaults.headers.post['Content-Type'] = 'application/json';

const OPENVIDU_SERVER_URL = "https://192.168.1.102:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

export default {
  name: 'Training',

  components: {
    UserVideo,
  },

  data() {
    return {
      OV: undefined,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],

      mySessionId: 'Training',
      myUserName: ' ',

      currentExercise: ["Squats", "Lunges", "Squat Jump", "Shuffle Run"],
      currentIndex: 0,

      countdownTime: 40,
      isPause: false,
      repCount: 0,

      isTraining: false,
      isReady: false,
      showReadyPopup: true,

    }
  },

  created: function() {
    console.log("Starting connection to WebSocket Server")
    this.connection = new WebSocket("wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self")

    this.connection.onmessage = function(event) {
      console.log(event);
      let data = JSON.parse(event.data);
      console.log(data.matchletix)
      let message = data.matchletix;
      console.log(typeof message)
      if (message !== undefined){
        document.getElementById("feedback").innerHTML = message;
      }
    }

    this.connection.onopen = function(event) {
      console.log(event)
      console.log("Successfully connected to the echo websocket server...")
    }

  },

  methods: {
    showPopup(message){
      console.log(message)
      Vue.$toast.open('You did it!');
    },
    imReady(){
      this.playTimer();
      this.showReadyPopup = false;
    },
    nextStep() {
      this.isPause = !this.isPause;
      console.log("isPause = " + this.isPause)
      if (this.isPause === true) {
        this.countdownTime = 20;
        this.repCount++;
        console.log("repCount " + this.repCount)
        this.playTimer();
        this.showReadyPopup = true;
      } else {
        this.countdownTime = 40;
      }
      if (this.repCount === 5) {
        this.repCount = 0;
        this.currentIndex++;
        if(this.currentIndex === 4) {
          this.leaveSession()
          this.isTraining = false;
        }
      }
    },
    playTimer() {
      const self = this;
      clearInterval(downloadTimer);
      let timeleft = this.countdownTime;
      let downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          self.nextStep();
        }
        document.getElementById("timer").innerHTML = "00:" + timeleft;
        timeleft -= 1;
      }, 1000);
    },
    gotoSquats() {
      router.push('/squats')
    },
    gotoLunges() {
      router.push('/lunges')
    },
    gotoSquatJump() {
      router.push('/squatjump')
    },
    gotoShuffle() {
      router.push('/shuffle')
    },
    joinSession() {
      this.isTraining = true;
      this.OV = new OpenVidu();

      // --- Init a session ---
      this.session = this.OV.initSession();


      this.session.on('streamCreated', ({stream}) => {
        const subscriber = this.session.subscribe(stream);
        this.subscribers.push(subscriber);
      });

      this.session.on('streamDestroyed', ({stream}) => {
        const index = this.subscribers.indexOf(stream.streamManager, 0);
        if (index >= 0) {
          this.subscribers.splice(index, 1);
        }
      });

      this.session.on('exception', ({exception}) => {
        console.warn(exception);
      });

      this.getToken(this.mySessionId).then(token => {
        this.session.connect(token, {clientData: this.myUserName})
            .then(() => {

              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
                publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
                resolution: '640x480',  // The resolution of your video
                frameRate: 30,			// The frame rate of your video
                insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
                mirror: false       	// Whether to mirror your local video or not
              });

              this.mainStreamManager = publisher;
              this.publisher = publisher;

              this.session.publish(this.publisher);
            })
            .catch(error => {
              console.log('There was an error connecting to the session:', error.code, error.message);
            });
      });

      window.addEventListener('beforeunload', this.leaveSession)
    },

    leaveSession() {
      if (this.session) this.session.disconnect();

      this.session = undefined;
      this.mainStreamManager = undefined;
      this.publisher = undefined;
      this.subscribers = [];
      this.OV = undefined;

      window.removeEventListener('beforeunload', this.leaveSession);
    },

    updateMainVideoStreamManager(stream) {
      if (this.mainStreamManager === stream) return;
      this.mainStreamManager = stream;
    },

    getToken(mySessionId) {
      return this.createSession(mySessionId).then(sessionId => this.createToken(sessionId));
    },

    createSession(sessionId) {
      return new Promise((resolve, reject) => {
        axios
            .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions`, JSON.stringify({
              customSessionId: sessionId,
            }), {
              auth: {
                username: 'OPENVIDUAPP',
                password: OPENVIDU_SERVER_SECRET,
              },
            })
            .then(response => response.data)
            .then(data => resolve(data.id))
            .catch(error => {
              if (error.response.status === 409) {
                resolve(sessionId);
              } else {
                console.warn(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`);
                if (window.confirm(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`)) {
                  location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
                }
                reject(error.response);
              }
            });
      });
    },

    // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-openviduapisessionsltsession_idgtconnection
    createToken(sessionId) {
      return new Promise((resolve, reject) => {
        axios
            .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`, {}, {
              auth: {
                username: 'OPENVIDUAPP',
                password: OPENVIDU_SERVER_SECRET,
              },
            })
            .then(response => response.data)
            .then(data => resolve(data.token))
            .catch(error => reject(error.response));
      });
    },
  }
}
</script>
