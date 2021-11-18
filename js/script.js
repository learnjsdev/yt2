class YTAudio {
  constructor() {
    this._init();
  }



  _init() {
    const script = document.createElement('script');
    script.src = '//www.youtube.com/iframe_api';
    document.body.appendChild(script);

    function onPlayerReady(event) {
      console.log('ready')
    }

    function onPlayerStateChange(event) {
      console.log('state', event);
    }


    script.onload = () => {
      console.dir(YT)


      const player =  new YT.Player('#player', {
          height: '200',
          width: '800',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });



    }
  }
}

new YTAudio();



