# Superclass Video Demo

A demo of [Twilio Video](https://www.twilio.com/video) for [Superclass 2019](https://signal.twilio.com/superclass).

## Running the demo

You will need [Node.js installed](https://nodejs.org/en/) to run this demo.

### Download the code

Start by cloning or downloading the repo:

```bash
https://github.com/philnash/superclass-twilio-video-demo.git
```

### Install the dependencies

Change into the directory and install the dependencies:

```bash
npm install
```

### Set up environment variables

Copy the `.env.example` file into `.env`. and fill in your Twilio Account SID and an API key and secret that you can [generate in your Twilio console here](https://www.twilio.com/console/video/project/api-keys).

### Run the application

To start the application, run:

```bash
npm start
```

Then visit [http://localhost:3000/index.html](http://localhost:3000/index.html).

Enter your name in the box and join the video chat room.
