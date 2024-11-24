let localstream;
let remotestream;
let peerConnection;

const servers = {
  iceServers: [
    {
      url: ["stun:stun.l.google.com:19302"],
    },
  ],
};

let init = async () => {
  localstream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("user-1").srcObject = localstream;

  createOffer();
};
init();

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);

  remotestream = new MediaStream();
  document.getElementById("user-2").srcObject = remotestream;

  localstream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localstream);
  });

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
