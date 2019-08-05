window.addEventListener('load', () => {
  const login = document.getElementById('login');
  const loginForm = document.getElementById('login-form');
  const identityField = document.getElementById('identity');
  const chat = document.getElementById('chat');
  const participants = document.getElementById('participants');
  const usernameSpan = document.getElementById('username');
  const roomSpan = document.getElementById('room');

  let token;
  let room;
  let identity;

  function participantConnected(participant) {
    const el = document.createElement('div');
    el.setAttribute('id', participant.identity);
    participants.append(el);
    participant.tracks.forEach(trackPublication => {
      trackPublished(trackPublication, participant);
    });
    participant.on('trackPublished', trackPublished);
    participant.on('trackUnpublished', trackUnpublished);
  }

  function participantDisconnected(participant) {
    participant.removeAllListeners();
    const el = document.getElementById(participant.identity);
    el.remove();
  }

  function trackPublished(trackPublication, participant) {
    const el = document.getElementById(participant.identity);
    const trackSubscribed = track => {
      el.appendChild(track.attach());
    };
    if (trackPublication.track) {
      trackSubscribed(trackPublication.track);
    }
    trackPublication.on('subscribed', trackSubscribed);
  }

  function trackUnpublished(trackPublication) {
    trackPublication.track.detach().forEach(function(mediaElement) {
      mediaElement.remove();
    });
  }

  function startVideoChat() {
    Twilio.Video.connect(token, { name: room, audio: false, video: true }).then(
      room => {
        participantConnected(room.localParticipant);
        room.on('participantConnected', participantConnected);
        room.participants.forEach(participant => {
          participantConnected(participant);
        });
        room.on('participantDisconnected', participantDisconnected);
        const tidyUp = event => {
          if (event.persisted) {
            return;
          }
          if (room) {
            room.disconnect();
            delete room;
          }
        };
        window.addEventListener('beforeunload', tidyUp);
        window.addEventListener('pagehide', tidyUp);
      }
    );
  }

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    identity = identityField.value;
    fetch('/token', {
      method: 'POST',
      body: JSON.stringify({ identity: identity }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        token = data.token;
        room = data.room;
        usernameSpan.textContent = identity;
        roomSpan.textContent = room;
        login.setAttribute('hidden', true);
        chat.removeAttribute('hidden');
        startVideoChat();
      });
  });
});
