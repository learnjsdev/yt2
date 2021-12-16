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
    this._init = this._init.bind(this);

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

    this._barElem = document.querySelector(this.progressBarSelector);
    this._positionElem = document.querySelector(this.positionSelector);
    this._togglePlayBtn = document.querySelector(this.toggleBtnSelector);

    this._intervalId;
    this._duration = 0;

    this._init();
  }

  _updateTime() {
    const currentTime = this._player.getCurrentTime();
    const percents = this._getPercents(currentTime, this._duration);

    this._barElem.style.cssText = `width: ${ percents }%`;
    this._positionElem.textContent = `${ this._convertToTime(currentTime * 1000) } / ${ this._convertToTime(this._duration) }`;
  }

  _getPercents(currentTime = 0, duration = 0) {
    return ((currentTime / duration) * 1000 * 100);
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

    if(!hours) {
      return `${ hours }${ delim }${ min }${ delim }${ sec }`;
    } else {
      return `${ min }${ delim }${ sec }`;
    }
  }

  _onPlayerReady(event) {
    if (event.data === null) {
      this._duration = this._player.getDuration() * 1000;
      this._positionElem.textContent = this._convertToTime(0);
      //this._player.playVideoAt(0);
      //console.log(this._duration);
    }
  }

  _onPlayerStateChange(event) {}

  _handleClick(e) {
    const togglePlayBtn = e.target.closest(this.toggleBtnSelector);
    const progressElem = e.target.closest(this.progressSelector);
    const muteBtn = e.target.closest(this.muteSelector);
    const state = this._player.getPlayerState();

    if (togglePlayBtn) {
      if (state === this._states.IS_INLINE || state === this._states.IS_PAUSED) {
        togglePlayBtn.classList.add('is-running');
        this._player.playVideo();
        this._intervalId = setInterval(this._updateTime.bind(this), 1000);
      }

      if (state === this._states.IS_PLAYING) {
        togglePlayBtn.classList.remove('is-running');
        clearInterval(this._intervalId);
        this._player.pauseVideo();
      }
    }

    if (progressElem) {
      const rect = progressElem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percents = 100 * (x / rect.width);
      const ms = this._duration;
      const position = ms * (percents / 100);

      clearTimeout(this._intervalId);
      this._player.seekTo(position / 1000);
      this._intervalId = setInterval(this._updateTime.bind(this), 1000);

      this._positionElem.textContent = `${ this._convertToTime(position) } / ${ this._convertToTime(this._duration) }`;
      this._barElem.style.cssText = `width: ${ percents }%`;

      if (state === this._states.IS_INLINE) {
        this._togglePlayBtn.classList.add('is-running');
      }
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
    document.addEventListener('click', this._handleClick.bind(this));
  }

  _init() {
    const script = document.createElement('script');
    script.src = '//www.youtube.com/iframe_api';
    document.body.appendChild(script);

    script.onload = () => {
      window.YT.ready(() => {
        this._player = new window.YT.Player("player", {
          height: "240",
          width: "480",
          videoId: document.getElementById('player').dataset.id,
          playerVars: {
            //controls: 2,
            //disablekb: 1
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
