function BeforeAfter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function BeforeAfter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function BeforeAfter_createClass(Constructor, protoProps, staticProps) { if (protoProps) BeforeAfter_defineProperties(Constructor.prototype, protoProps); if (staticProps) BeforeAfter_defineProperties(Constructor, staticProps); return Constructor; }
var BeforeAfter = function () {
  function BeforeAfter(sectionContainer, section) {    
    BeforeAfter_classCallCheck(this, BeforeAfter);
    this._initBeforeAfter(section);
  }
  BeforeAfter_createClass(BeforeAfter, [{
    key: "_initBeforeAfter",
    value: function _initBeforeAfter(section) {
      var _this = this;
      var slides = section.el.querySelectorAll('input');
      slides.forEach(function(s) {
        s.addEventListener('input', _this.updateBeforeAfter);
      });
      this.reSize(slides);
      var prevWidth = window.innerWidth;
      window.addEventListener('resize', function () {
        if (window.width !== prevWidth ) {
          _this.reSize(slides);
        };
      });
    }
  }, {
    key: "reSize",
    value: function _initBeforeAfter(slides) {
      slides.forEach(function(s) {
        if (Layout.isBreakpoint('S')) {
          s.value = s.getAttribute('data-mobile');
        } else {
          s.value = s.getAttribute('data-desktop');          
        }
      });
    }
  }, {
    key: "updateBeforeAfter",
    value: function updateBeforeAfter(e) {      
      const sliderPos = e.target.value;
      var d = this.getAttribute('data-direction'),
          i = document.getElementById(this.getAttribute('data-img'));
      if (d == 'rtl') {
        i.style.clipPath = 'inset(0 0 0 0' + sliderPos + '%)';
      } else {
        var p = 100 - sliderPos;
        i.style.clipPath = 'inset(0 ' + p + '% 0 0)';
      };      
      document.getElementById(this.getAttribute('data-hotspot')).style.left = sliderPos + '%';
      e.target.setAttribute('data-mobile', sliderPos);
      e.target.setAttribute('data-desktop', sliderPos);
    }
  } ]);
  return BeforeAfter;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'before-after-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new BeforeAfter(sectionContainer, section);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'before-after-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new BeforeAfter(sectionContainer, section);
    });
    sectionContainer.classList.add('ignore');
  }
})