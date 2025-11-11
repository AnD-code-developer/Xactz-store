function Slider_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Slider_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Slider_createClass(Constructor, protoProps, staticProps) { if (protoProps) Slider_defineProperties(Constructor.prototype, protoProps); if (staticProps) Slider_defineProperties(Constructor, staticProps); return Constructor; }
var Slider = function () {
  function Slider(sectionContainer, section, force) {    
    Slider_classCallCheck(this, Slider);
    this.el = sectionContainer;
    this.section = section;    
    this.sectionId = this.el.getAttribute('data-section-id');
    this.slider = this.el.querySelector('.slider');
    this.useSlider = this.el.getAttribute('data-slider-use');
    this.useBreakpoint = this.el.getAttribute('data-slider-breakpoint');
    this.autoPlay = this.el.getAttribute('data-should-autoplay');
    if (this.el.classList.contains('slideshow')) {
      this.slideshow = true;
      this.slideshow_section = true;
      this._initSlider();      
    } else {
      this.slideshow = false;
      this.update = this.update.bind(this);
      Layout.onBreakpointChange(this.update);
      this.update();
    }
  }
  Slider_createClass(Slider, [{
    key: "unload",
    value: function unload() {
      Layout.offBreakpointChange(this.update);
    }
  }, {
    key: "update",
    value: function update() {
      var sliderSmall = Layout.isBreakpoint('S') && this.useSlider && this.useBreakpoint == 'small',
          sliderLargeOnly = !Layout.isBreakpoint('S') && this.useSlider && this.useBreakpoint == 'large-only',
          sliderLarge = this.useSlider && this.useBreakpoint == 'large';
      if (sliderSmall || sliderLargeOnly || sliderLarge) {
        this._initSlider();
      } else {        
        this._destroySlider();        
      }
    }
  }, {
    key: "_initSlider",
    value: function _initSlider(force) {
    var _this = this;      
    if (!this.slider) {
      return
    }
    var s = this.slider;
    this.sT = this.el.getAttribute('data-type');
    this.isDown = false;
    this.drag = 0;
    this.startX;
    this.startY;
    this.scrollLeft;
    this.scrollTop;
    this.scrollTotal = 50;
    this.scrollNP;
    this.anchor;
    if(this.sT == 'product') {
      this.anchorClass = this.el.querySelector('[data-product-gallery-selected="true"]').getAttribute('data-slide');
    } else {
      this.anchorClass = 1;
    }
    this.anchor_update = false;
    this.touchID;
    this.sections = s.getElementsByClassName('slide');
    this.timeout;
    this.autoPlay;
    s.classList.add('slider-loaded');
    s.classList.remove('slider-loading');
    this.a = s.querySelectorAll('.keyed-link');
    var btns = this.el.querySelectorAll('.slider-button');
    if (this.sT) {
      ContentSlide(this.el, force);
    }
    if (s.getAttribute('data-slider-axis') == 'vertical' && !Layout.isBreakpoint('S')) {
      this.axis = true;
      s.classList.add('vertical');
    } else {
      this.axis = false;
      s.classList.remove('vertical');
    }
    s.ondragstart = function(e){
      e.preventDefault();
    }      
    if (this.el.classList.contains('slideshow')) {      
      if (this.el.getAttribute('data-should-autoplay') == 'true') {
        this.autoSlide(s);
      }
      btns.forEach(function (b) {
        b.onclick = function(){
          _this.Btn(b, b.getAttribute('data-index'), _this, _this.sectionId, s, force);
        };
      });
      this.heightSlide(s);
      var prevWidth = window.innerWidth;
      window.addEventListener('resize', function () {
        if (window.width !== prevWidth ) {          
          if (this.axis) {
            s.scroll({
              top: (s.querySelector('.active').offsetTop),
              behavior: 'smooth'
            })
          } else {
            s.scroll({
              left: s.offsetWidth,
              behavior: 'smooth'
            })
          }
          setTimeout(function() {
           _this.heightSlide(s);
            var prevWidth = window.innerWidth;
          }, 250);
        };
      });      
    }
    this.slideDown = this.slideDown.bind(this);
    s.addEventListener('mousedown', this.slideDown);
    s.addEventListener('touchstart', this.slideDown);      
    this.slideMove = this.slideMove.bind(this);
    s.addEventListener('mousemove', this.slideMove);
    s.addEventListener('touchmove', this.slideMove);      
    this.slideUp = this.slideUp.bind(this);
    s.addEventListener('mouseup', this.slideUp);
    s.addEventListener('touchend', this.slideUp);
    }
  }, {
    key: "slideDown",
    value: function slideDown(e) {
      var s = this.slider;
      this.Clear(s);
      this.isDown = true;
      this.drag = 0;
      s.classList.add('active','active-permanant');
      if (theme.isMobile) return;      
      if (this.axis) {
        this.startY = e.pageY - s.offsetTop;
        this.scrollTop = s.scrollTop;
      } else {
        this.startX = e.pageX - s.offsetLeft;
        this.scrollLeft = s.scrollLeft;
      }
    }
  }, {
    key: "slideMove",
    value: function slideMove(e) {
      var s = this.slider,
          b = document.body,
          sL = 'scrollLeft',
          sW = 'scrollWidth';
      this.scrollTotal = (Math.round((s[sL] || b[sL]) / ((s[sW] || b[sW]) - s.clientWidth) * 100 * 10) / 10).toFixed(1);
      if (s.classList.contains('no-drag')) return;
      if (!this.isDown) return;
      this.drag++;        
      if (s.querySelector('.walk')){
        s.querySelector('.walk').textContent = this.scrollTotal
      }      
      if (!theme.isMobile) {
        e.preventDefault();
      }
      if (this.drag > 5) {
        s.classList.add('sliding');
      } else {
        return
      }      
      if (this.axis) {
        const y = e.pageY - s.offsetTop;
        const walk = (y - this.startY) * 2;
        s.scrollTop = this.scrollTop - walk;
        if (this.el.classList.contains('slideshow')) {
          var slides = s.querySelectorAll('.slide');
          slides.forEach(function(s, i) {
            var t = s.offsetTop - (this.scrollTop - walk);
            if (t < 0) {
              var t = t * -1;
            }
            var w = s.offsetHeight / 2;        
            if (t <= w) {
              this.anchor = s.offsetTop * i;
              this.anchorClass = i + 1;
            }
          });
        }
      } else {
        const x = e.pageX - s.offsetLeft;
        this.anchor = s.offsetWidth;
        this.anchor_update = 0;
        var a = s.querySelector('.active'),              
            v = s.querySelector('.visible'),            
            n = s.querySelector('.slide.next'),
            p = s.querySelector('.slide.previous'),
            walk = (x - this.startX) * 2;        
        if (!theme.isMobile) {
          s.scrollLeft = this.scrollLeft - walk;
        }        
        if (this.el.classList.contains('slideshow')) {
          if (this.scrollTotal < 40) {
            var i = a.dataset.previous,
                sI = document.getElementById('slide-' + this.sectionId + '-' + i);
            this.scrollNP = i;
            if (n) {            
              if (v) {
                v.classList.remove('visible');
              }            
              p.classList.add('sliding');
              n.classList.add('sliding-hide');
            }
            this.anchor_new = 0;
          } else if (this.scrollTotal > 60) {
            var i = a.dataset.next,
                sI = document.getElementById('slide-' + this.sectionId + '-' + i),
                walk = walk * -1;
            this.scrollNP = i;
            if (n) {            
              if (v) {
                v.classList.remove('visible');
              }            
              n.classList.add('sliding');
              p.classList.add('sliding-hide');
            }
            this.anchor_new = s.offsetWidth * 2;
          } else {            
            if (n) {
              n.classList.remove('sliding', 'sliding-hide');
              p.classList.remove('sliding', 'sliding-hide');
            }
          }
       };
      }      
    }
  }, {
    key: "slideUp",
    value: function slideUp(e, force) {
      var _this = this,
          s = this.slider,
          n = s.querySelector('.slide.next'),
          p = s.querySelector('.slide.previous');            
      if (this.scrollTotal > 75 || this.scrollTotal < 25) {
        this.anchor = this.anchor_new;
        this.anchor_update = s.offsetWidth;
        this.anchorClass = this.scrollNP;        
      }      
      this.scrollTotal = 50;
      this.isDown = false;      
      if (this.el.classList.contains('slideshow')) {
        if (this.drag > 5) {
          s.scroll({
            left: this.anchor,
            behavior: 'smooth'
          });
          window.setTimeout(function() {
            var c = s.querySelector('.active').classList.remove('active'),
                id = document.getElementById('slide-' + _this.sectionId + '-' + _this.anchorClass);            
            id.classList.add('active');
            if (n) {
              n.classList.remove('next', 'sliding', 'sliding-hide');
              p.classList.remove('previous', 'sliding', 'sliding-hide');
              document.getElementById('slide-' + _this.sectionId + '-' + id.getAttribute('data-next')).classList.add('next', 'sliding-hide');
              document.getElementById('slide-' + _this.sectionId + '-' + id.getAttribute('data-previous')).classList.add('previous', 'sliding-hide');
            } else {
              document.getElementById('slide-' + _this.sectionId + '-' + id.getAttribute('data-next')).classList.add('visible', 'sliding-hide');              
            }
            if (_this.anchor_update > 0) {
              s.scroll({
                left: _this.anchor_update,
                behavior: 'instant'
              });
              if(_this.sT == 'product') {
                var index = {
                  d: id.dataset.productGalleryFigure,
                  i: _this.section.id
                };
                _this.section.postMessage('slider:up', index);
              }
            }            
            _this.heightSlide(s);            
            if(_this.sT == 'map') {
              var cS = _this.el.querySelectorAll('.content-slide'),
                  b = _this.el.querySelector('button[value="slide-' + _this.sectionId + '-' + _this.anchorClass + '"'),
                  bCS = b.closest('.content-slide'),
                  dH = bCS.querySelector('[data-height]');
              cS.forEach(function(c) {
                if (c != bCS) {
                  if(c.querySelector('[data-height]')) {
                    c.querySelector('button').classList.remove('active');
                    Revealer('hide', force, c);
                  }
                }
              });
              if (dH) {
                bCS.querySelector('button').classList.toggle('active');
                Revealer('toggle', force, bCS);
              }        
            }
            window.setTimeout(function() {
              document.getElementById('slide-' + _this.sectionId + '-' + id.getAttribute('data-next')).classList.remove('sliding-hide');
              document.getElementById('slide-' + _this.sectionId + '-' + id.getAttribute('data-previous')).classList.remove('sliding-hide');            
            }, 250);
          }, 250);
        }     
      }
      s.classList.remove('active', 'sliding');
    }
  }, {
    key: "_destroySlider",
    value: function _destroySlider() {
      if (this.slider) {
        var s = this.slider;
        s.scrollLeft = 0;
        this.scrollTotal = 50;
        s.removeEventListener('mousedown', this.slideDown);
        s.removeEventListener('touchstart', this.slideDown);          
        s.removeEventListener('mousemove', this.slideMove);
        s.removeEventListener('touchmove', this.slideMove);          
        s.removeEventListener('mouseup', this.slideUp);
        s.removeEventListener('touchend', this.slideUp);        
        s.classList.remove('slider-loaded', 'active', 'sliding');
      }
    }
  }, {
    key: "heightSlide",
    value: function heightSlide(s) {
    var id = s.querySelector('.active');
    let height = id.clientHeight;
    s.style.setProperty('--max-height', height + 'px');
  }
  }, {
    key: "Btn",
    value: function Btn(b, i, tH, id, s, force) {
      if (b.getAttribute('data-ignore') == 'true') {
        return;
      }
      var _this = this,
          aS = s.querySelector('.active').getAttribute('data-slide'),
          n = s.querySelector('.slide.next'),
          p = s.querySelector('.slide.previous'),
          v = s.querySelector('.visible'),
          sI = document.getElementById('slide-' + id + '-' + i);
      tH.Clear(s);
      if(tH.sT == 'map') {
        var cS = tH.el.querySelectorAll('.content-slide'),
            bCS = b.closest('.content-slide'),
            dH = bCS.querySelector('[data-height]');
        cS.forEach(function(c) {
          if (c != bCS) {
            if(c.querySelector('[data-height]')) {
              c.querySelector('button').classList.remove('active');
              Revealer('hide', force, c);
            }
          }
        });
        if (dH) {
          bCS.querySelector('button').classList.toggle('active');
          if (tH.el.hasAttribute('data-add-active')) {
            tH.el.closest('.shopify-section').classList.toggle('active');
          } 
          Revealer('toggle', force, bCS);
        }  
      }      
      if (aS == i) return;
      s.classList.add('active','active-permanant');
      tH.a.forEach(function (a) {
        a.setAttribute('tabindex','-1')
        a.setAttribute('aria-hidden','true')
      });
      var kL = sI.querySelectorAll('.keyed-link');      
      kL.forEach(function (k) {
        k.setAttribute('tabindex','0')
        k.setAttribute('aria-hidden','false')
      });
      if (n) {
        n.classList.remove('next');
        p.classList.remove('previous');
      }
      if (v) {
        v.classList.remove('visible');
      }
      sI.classList.add('visible');
      if (b.getAttribute('data-type') == 'next') {          
        tH.anchor = s.offsetWidth * 2;        
      } else if (b.getAttribute('data-type') == 'previous') {
        tH.anchor = 0;
      } else {
        if (aS > i) {
          tH.anchor = 0;
        } else {
          tH.anchor = s.offsetWidth * 2;
        }
      }
      tH.anchor_update = s.offsetWidth;      
      tH.anchorClass = i;
      s.scroll({
        left: tH.anchor,
        behavior: 'smooth'
      });
      window.setTimeout(function() {
        s.querySelector('.active').classList.remove('active');
        sI.classList.add('active');
        if (n) {
          document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.add('next', 'sliding-hide');
          document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-previous')).classList.add('previous', 'sliding-hide');
        } else {
          document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.add('visible', 'sliding-hide');
        } 
        if (tH.anchor_update > 0) {
          s.scroll({
            left: tH.anchor_update,
            behavior: 'instant'
          });
        }
        tH.heightSlide(s);        
        window.setTimeout(function() {
          document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.remove('sliding-hide');
          document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-previous')).classList.remove('sliding-hide');
        }, 250);
        s.classList.remove('active');
      b.setAttribute('data-ignore', 'false');
      }, 400);
      b.setAttribute('data-ignore', 'true');
    }
  }, {
    key: "autoSlide",
    value: function autoSlide(s) {
      var _this = this;      
      let a = this.el.getAttribute('data-autoplay');
      function Next() {
        var aS = s.querySelector('.active').getAttribute('data-slide'),
            n = s.querySelector('.slide.next'),
            p = s.querySelector('.slide.previous'),
            v = s.querySelector('.visible'),
            i = s.querySelector('.active').getAttribute('data-next'),
            sI = document.getElementById('slide-' + _this.sectionId + '-' + i);
        s.classList.add('active','active-permanant');
        if (n) {
          n.classList.remove('next');
          p.classList.remove('previous');
        }        
        if (v) {
          v.classList.remove('visible');
        }
        sI.classList.add('visible');
        _this.anchor = s.offsetWidth * 2;
        _this.anchor_update = s.offsetWidth;
        _this.anchorClass = i;
        s.scroll({
          left: _this.anchor,
          behavior: 'smooth'
        });
        window.setTimeout(function() {
          s.querySelector('.active').classList.remove('active');
          sI.classList.add('active');
          if (n) {
            document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.add('next', 'sliding-hide');
            document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-previous')).classList.add('previous', 'sliding-hide');
          } else {
            document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.add('visible', 'sliding-hide');          
          }
          if (_this.anchor_update > 0) {
            s.scroll({
              left: _this.anchor_update,
              behavior: 'instant'
            });
          }
          _this.heightSlide(s);        
          window.setTimeout(function() {
            document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-next')).classList.remove('sliding-hide');
            document.getElementById('slide-' + _this.sectionId + '-' + sI.getAttribute('data-previous')).classList.remove('sliding-hide');          
          }, 250);
        }, 400);        
      }
      this.autoPlay = setInterval(Next, a);
      s.onclick = function(){
        _this.Clear(s);
      };
      s.ontouchmove = function(){
        _this.Clear(s);
      };
      if (Shopify.designMode) {
        s.addEventListener('shopify:block:select', function(e) {
          _this.Clear(s);
        });
        document.addEventListener('shopify:section:unload', function(e) {
          _this.Clear(s);
        });
      }
    }
  }, {
    key: "Clear",
    value: function Clear(s) {
      clearInterval(this.autoPlay);    
      s.classList.remove('active');      
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name, data) {
      if (name === 'var:select' && this.sT == 'product' && data.i) {
        this.Btn(data.b, data.i, this, data.id, data.s);
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload(event) {
      this.el.setAttribute('data-should-autoplay', false);
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event) {
      const s = event.el;
      if (s.classList.contains('slide')) {
        if (s.classList.contains('slideshow-slide')) {
          if (s.classList.contains('active')) return;            
          let sC = s.closest('.slider')
              v = sC.querySelector('.visible');
          sC.classList.add('active','active-permanant');          
          if (v) {
            v.classList.remove('visible');
          }
          s.classList.add('visible');
          sC.scroll({
            left: s.offsetWidth * 2,            
            behavior: 'smooth'
          })
          window.setTimeout(function() {
            sC.querySelector('.active').classList.remove('active');
            s.classList.add('active');
            sC.scroll({
              left: sC.offsetWidth,
              behavior: 'instant'
            });
            let height = s.scrollHeight;      
            sC.style.setProperty('--max-height', height + 'px');          
          }, 500);  
        } else {
          let sC = s.closest('.slider');
          sC.scroll({
            left: s.offsetLeft,            
            behavior: 'smooth'
          });          
        }
      }      
    }
  }]);
  return Slider;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'slider-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Slider(sectionContainer, section);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'slider-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Slider(sectionContainer, section);
    });
    sectionContainer.classList.add('ignore');
  }
})