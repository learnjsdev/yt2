class YTAudio {
  constructor() {
    this._init();
    this._onPlayerReady = this._onPlayerReady.bind(this);
    this._addEvents = this._addEvents.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  _onPlayerReady(event) {
    console.log('ready');
    //event.target.playVideo();
    //debugger
  }

  _onPlayerStateChange(event) {
    console.log('state', event);
  }

  _handleClick(e) {
    if (e.target.closest('.yt-player__toggle')) {
      console.log(this._player);
      this._player.playVideo();
    }
  }

  _addEvents() {
    document.addEventListener('click', this._handleClick.bind(this))
  }

  _init() {
    const script = document.createElement('script');
    script.src = '//www.youtube.com/iframe_api';
    document.body.appendChild(script);

    script.onload = () => {
      window.YT.ready(() => {
        this._player = new window.YT.Player("player", {
          height: "390",
          width: "640",
          videoId: "M7lc1UVf-VE",
          playerVars: {
            //controls: 0
          },
          events: {
            onReady: this._onPlayerReady,
            onStateChange: this._onPlayerStateChange
          }
        });
      });
    }

    this._addEvents();
  }
}

new YTAudio();
