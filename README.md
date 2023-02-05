# My Intellectual Space 

Intellectual Space is a place for learning, networking, and innovation. Our mission is to give access and guidance to all communities, regardless of fiscal or social capital. We present the tools and resources to allow our users to connect with other members with a variety of skills, knowledge, trades, and interests, so that they may develop a strong network and community, presenting job opportunities, networking opportunities, and much more! 


### Tech Stack
- [Vite](https://vitejs.dev/) + [VueJs 3](https://vuejs.org/)
- [Firebase](https://firebase.google.com/) + [GCP App Engine](https://cloud.google.com/appengine)
- [Tailwind CSS](https://tailwindcss.com/) + [Flowbite](https://flowbite.com/) Components
- [Agora Real Time Video](https://www.agora.io/en/)
- [TinyMCE](https://www.tiny.cloud/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)

### Report a bug or issue
Click [here](https://github.com/col-bc/myintellectualspace/issues/new?assignees=&labels=bug&template=bug_report.md&title=) to submit a bug report. Or visit the issue section on this repository.

### Serve the web app locally with npm
```sh
cd .../myintellectualspace
npm install
npm run dev
```
You must also create a `secrets.js` file in the `src` directory that contains your API keys. The file should look like this:
```js
export const MAPS_API_KEY = 'YOUR GOOGLE MAPS API KEY HERE'
export const VIDEOSDK_API_KEY = 'YOUR AGORA SDK API KEY HERE'
export const VIDEOSDK_SECRET = 'YOUR AGORA SDK SECRET HERE'
export const TINYMCE_API_KEY = 'YOUR TINYMCE API KEY HERE'
```
