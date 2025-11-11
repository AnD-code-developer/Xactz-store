function VideoLoad_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function VideoLoad_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function VideoLoad_createClass(Constructor, protoProps, staticProps) { if (protoProps) VideoLoad_defineProperties(Constructor.prototype, protoProps); if (staticProps) VideoLoad_defineProperties(Constructor, staticProps); return Constructor; }
var VideoLoad = function () {
  function VideoLoad(el, t) {
    VideoLoad_classCallCheck(this, VideoLoad);
    this.el = el;
    this.a = el.closest('article');
    if (t == 'background') {      
      this._onPlay();      
    } else {
      this.playButton = this.a.querySelector('.figure [data-video-play-button]');      
      this.onPlayClick = this._onPlayClick.bind(this);
      this.playButton.addEventListener('click', this.onPlayClick);      
    }
  }
  VideoLoad_createClass(VideoLoad, [{
    key: "_onPlay",
    value: function _onPlay() {
      var _this = this,
          v = this.el.querySelector('.video.loading'),
          vV = v.querySelector('video'),
          s = this.el.querySelector('.spinner'),
          i = this.el.closest('div').querySelector('.image');
      vV.play();
      vV.onplaying = function(e) {
        v.classList.add('loaded');
        v.classList.remove('loading');
      }
      vV.onerror = function(e) {
        if (i) {
          i.classList.remove('hidden');
          v.classList.add('hidden');
        } else {
          s.classList.add('hidden');
          vV.classList.add('hidden');
        }
      };      
    }
  }, {
    key: "_onPlayClick",
    value: function _onPlayClick() {
      var _this = this;
      this.a.classList.add('video-loading');
      this.el.querySelector('iframe').src = this.el.querySelector('iframe').getAttribute('data-src');
      this.el.focus();      
      setTimeout(function () {
        _this.a.classList.add('video-transitioning');        
        setTimeout(function () {
          _this.a.classList.remove('video-loading');
          _this.a.classList.remove('video-transitioning');
          _this.a.classList.add('video-playing');
          _this.playButton.classList.add('hidden');          
        }, 500);
      }, 500);
    }
  }, {
    key: "unload",
    value: function unload() {      
      if (this.playButton) {
        this.playButton.removeEventListener('click', this.onPlayClick);
      }
      if (this.video) {
        this.video.unload();
      }      
    }
  }]);
  return VideoLoad;
}();
function Video_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Video_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Video_createClass(Constructor, protoProps, staticProps) { if (protoProps) Video_defineProperties(Constructor.prototype, protoProps); if (staticProps) Video_defineProperties(Constructor, staticProps); return Constructor; }
var Video = function () {
  function Video(section) {
    var sectionId = section.getAttribute('data-section-id'),
        _this = this;
    Video_classCallCheck(this, Video);
    this.type = section.getAttribute('data-video-type');
    if (this.type == 'background') {
      var videoEl = section;      
      this.video = new VideoLoad(videoEl, this.type);
    } else {
      var videoEl = section.querySelectorAll('[data-video]');
      if (videoEl) {
        videoEl.forEach(function (v) {
          this.video = new VideoLoad(v, _this.type);
        });
      }
    }
  }
  Video_createClass(Video, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {      
      if (this.video) {
        this.video.unload();
      }
    }
  }]);
  return Video;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'video-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Video(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'video-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Video(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})