function normalize(string) {
  return `${string
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`;
}

exports.handler = async function(context, event, callback) {
  // Change these values for your use case
  // REMINDER: This identity is only for prototyping purposes
  const identity = normalize(event.identity);
  const ROOM = 'Superclass';

  const client = context.getTwilioClient();
  let room;
  try {
    room = await client.video.rooms(ROOM).fetch();
  } catch (e) {
    try {
      room = await client.video.rooms.create({
        uniqueName: ROOM,
        type: 'group'
      });
    } catch (err) {
      console.error(err);
    }
  }

  const ACCOUNT_SID = context.ACCOUNT_SID;
  const API_KEY = context.API_KEY;
  const API_SECRET = context.API_SECRET;

  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const grant = new VideoGrant({ room: ROOM });
  grant.room = ROOM;

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

  accessToken.addGrant(grant);
  accessToken.identity = identity;

  callback(null, { token: accessToken.toJwt(), room: ROOM, identity });
};
