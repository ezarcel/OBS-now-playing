# OBS Now Playing

Widget for OBS that shows the song you are now listening to.

## Set up

### Prerequisites

- [Node.js](https://nodejs.org/) (tested on 16.14.2)
- A previously-configured [OBS](https://obsproject.com/)

### Steps

1. [Clone this repo](https://github.com/ezarcel/OBS-now-playing/archive/refs/heads/main.zip) or [download the latest release](https://github.com/ezarcel/OBS-now-playing/releases/latest).
1. Run `npm run install-dependencies` to install the dependencies.
1. Run `npm run compile:all` to compile the source code (only do once and if the repo was cloned).
1. Run `npm run start`. It'll create the default `config.json` file and exit.
1. Go to your [Spotify for Developers dashboard](https://developer.spotify.com/dashboard/).
1. Click _Create an app_, give it the name & description you want & agree to everything.
1. Click _Edit settings_ & under _Redirect URIs_ add `http://localhost:3000/api/login-callback`.  
   Note: if you plan on modifying the code, add `http://localhost:3001/api/login-callback` too.
1. Click _Show client secret_ & replace `<client_id>` with your Client ID, and `<client_secret>` with your Client Secret in `config.json`.
1. Run `npm run start` again and open http://localhost:3000. Follow the on-screen instructions.

## To-do

- [x] Get the now playing song
- [x] Config file
- [x] Frontend
- [x] Fix ads giving "UnhandledPromiseRejectionWarning"
- [x] Mini variant
- [x] A more user-friendly UI (some sort of dashboard maybe)
- [x] _Set up_ section in `README.md`
- [ ] Skin settings
