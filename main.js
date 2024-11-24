let localstream;
let remotestream;
let peerConnection;

let APP_ID = "eecf7a5c03294e259f87070945889bcd";
let token = null;

let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

// these are stun servers used for getting your own public ip address
// that can be shared to other peer for connection
const servers = {
  iceServers: [
    {
      url: ["stun:stun.l.google.com:19302"],
    },
  ],
};

let init = async () => {
  // setting local stream to our own camera
  localstream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("user-1").srcObject = localstream;

  createOffer();
};
init();

let createOffer = async () => {
  // creating a peerconnection object with stun servers...
  peerConnection = new RTCPeerConnection(servers);

  // creating a remote stream and setting to other video element
  remotestream = new MediaStream();
  document.getElementById("user-2").srcObject = remotestream;

  // getting all the media tracks usually the camera and adding it to
  // peer connection object...
  localstream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localstream);
  });

  // then adding those tracks from peerconnection to remote stream object...
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remotestream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log("New ice candidate : ", event.candidate);
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log("offer : ", offer);
};
