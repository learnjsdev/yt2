class YTAudio {
  constructor({
    toggleBtnSelector = '.yt-player__toggle',
    progressSelector = '.yt-player__progress',
    progressBarSelector = '.yt-player__bar',
    positionSelector = '.yt-player__position',
    muteSelector = '.yt-player__mute',
  }) {
    this._onPlayerReady = this._onPlayerReady.bind(this);
    this._addEvents = this._addEvents.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._init();

    this._states = {
      IS_NOT_STARTED: -1,
      IS_PLAYING: 1,
      IS_ENDED: 0,
      IS_INLINE: 5,
      IS_PAUSED: 2,
    };

    this.toggleBtnSelector = toggleBtnSelector;
    this.progressSelector = progressSelector;
    this.progressBarSelector = progressBarSelector;
    this.positionSelector = positionSelector;
    this.muteSelector = muteSelector;

    this._intervalId;
    this._duration = 0;
  }

  _updateTime() {
    const currentTime = this._player.getCurrentTime();
    const duration = this._player.getDuration();
    const percents = this._getPercents(currentTime, duration);
    const barElem = document.querySelector(this.progressBarSelector);
    const positionElem = document.querySelector(this.positionSelector);

    barElem.style.cssText = `width: ${ percents }%`;
    positionElem.textContent = this._convertToTime(currentTime * 1000);
  }

  _getPercents(currentTime = 0, duration = 0) {
    return (currentTime * 100) / duration
  }

  _convertToTime(ms) {
    const delim = ':';
    //let ms = parseInt((ms % 1000) / 100);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    let min = Math.floor((ms / (1000 * 60)) % 60);
    let sec = Math.floor((ms / 1000) % 60);

    hours = (hours < 10) ? "0" + hours : hours;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;

    return `${ hours }${ delim }${ min }${ delim }${ sec }`;
  }

  _onPlayerReady(event) {
    if (event.data === null) {
      this._player.seekTo(0);
      this._player.stopVideo();
      this._duration = this._player.getDuration();
    }
  }

  _onPlayerStateChange(event) {
    console.log('state', event.data);
  }

  _handleClick(e) {
    const togglePlayBtn = e.target.closest(this.toggleBtnSelector);
    const progressElem = e.target.closest(this.progressSelector);
    const muteBtn = e.target.closest(this.muteSelector);

    if (togglePlayBtn) {
      const state = this._player.getPlayerState();

      if (state === this._states.IS_INLINE || state === this._states.IS_PAUSED) {
        this._player.playVideo();
        this._intervalId = setInterval(this._updateTime.bind(this), 1000);
        togglePlayBtn.classList.add('is-running');
      }

      if (state === this._states.IS_PLAYING) {
        this._player.pauseVideo();
        clearInterval(this._intervalId);
        togglePlayBtn.classList.remove('is-running');
        console.log('cleared');
      }

      console.log('==>', state)
    }

    if (progressElem) {
      const barElem = document.querySelector(this.progressBarSelector);
      const positionElem = document.querySelector(this.positionSelector);

      const rect = progressElem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percents = 100 * (x / rect.width);
      const ms = this._duration * 1000;
      const position = ms * (percents / 100);
      positionElem.textContent = this._convertToTime(position);

      console.log(percents/100);

      barElem.style.cssText = `width: ${ percents }%`;

      this._player.seekTo(position/1000);
      
    }

    if (muteBtn) {
      if (!this._player.isMuted()) {
        muteBtn.classList.add('is-muted');
        this._player.mute();
      } else {
        muteBtn.classList.remove('is-muted');
        this._player.unMute();
      }
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
            //controls: 2
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


document.addEventListener('DOMContentLoaded', () => {
  new YTAudio({
    // toggleBtnSelector: '.yt-player__toggle',
    // progressSelector: '.yt-player__progress',
    // progressBarSelector: '.yt-player__bar',
    // positionSelector: '.yt-player__position',
    // muteSelector: '.yt-player__mute',
  });
})
