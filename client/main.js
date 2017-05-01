import React from 'react';
import { mount } from 'react-mounter';

//======================STARTUP BLOCK=============================================
  const userMediaConstrains = {
    audio: true,
    video: true
  };

  const callerConnection = new RTCPeerConnection();
  const calleeConnection = new RTCPeerConnection();

  navigator.mediaDevices.getUserMedia(userMediaConstrains)
  .then((stream) => {
    console.log(stream);
    document.getElementById('local-video').srcObject = stream;
    callerConnection.addStream(stream);
  });
//==============================================================================
//======================HANDLERS BLOCK==========================================
  callerConnection.onnegotiationneeded = (event) => {
    console.log('onnegotiationneeded');
    callerConnection.createOffer()
    .then((offer) => {
      console.log('offer', offer);
      return callerConnection.setLocalDescription(offer);
    })
    .then(() => {
      handleOffer(callerConnection.localDescription);
    });
  };

  const handleOffer = (remoteDescription) => {
    console.log('handleOffer');
    console.log('remoteDescription', remoteDescription);
    calleeConnection.setRemoteDescription(remoteDescription);
    calleeConnection.createAnswer()
    .then((answer) => {
      console.log('answer', answer);
      calleeConnection.setLocalDescription(answer);
    })
    .then(() => {
      handleAnswer(calleeConnection.localDescription);
    })
  };

  const handleAnswer = (remoteDescription) => {
    console.log('handleAnswer');
    console.log('remoteDescription', remoteDescription);
    callerConnection.setRemoteDescription(remoteDescription);
  };

  callerConnection.onicecandidate = (event) => {
    console.log('onicecandidate caller', event);
    if (event.candidate) {
      handleIceCandidateFromCaller(event.candidate);
    }
  };
  const handleIceCandidateFromCaller = (candidate) => {
    calleeConnection.addIceCandidate(candidate);
  };

  calleeConnection.onicecandidate = (event) => {
    console.log('onicecandidate callee', event);
    if (event.candidate) {
      handleIceCandidateFromCallee(event.candidate);
    }
  };
  const handleIceCandidateFromCallee = (candidate) => {
    callerConnection.addIceCandidate(candidate);
  };

  calleeConnection.onaddstream = (event) => {
    console.log('onaddstream', event);
    document.getElementById('recieved-video').srcObject = event.stream;
  };
//==============================================================================

//======================INTERFACE BLOCK=========================================
class App extends React.Component {
  render() {
    return (
      <div>
        <video id="local-video" autoPlay muted></video>
        <video id="recieved-video" autoPlay></video>
      </div>
    );
  }
}

mount(App);
//==============================================================================
