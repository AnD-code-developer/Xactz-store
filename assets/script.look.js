function Look_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Look_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Look_createClass(Constructor, protoProps, staticProps) { if (protoProps) Look_defineProperties(Constructor.prototype, protoProps); if (staticProps) Look_defineProperties(Constructor, staticProps); return Constructor; }
var Look = function () {
  function Look(section) {
    var _this = this;
    Look_classCallCheck(this, Look);    
    this.el = section;
    this.sectionId = this.el.getAttribute('data-section-id');
    this.sL = this.el.querySelector('.shop-look');
    this.sLC = this.el.querySelector('.shop-look-content');
    this.btns = this.el.querySelectorAll('button.active');
    this.items = this.el.querySelectorAll('[data-shop-look]');
    this.background_body = document.querySelectorAll('[data-body-slide-background]');
    this.closeButton = this.el.querySelector('[data-look-close]');    
    this.trigger = null;
    this.events = new Events();
    this.btns.forEach(function (b) {
      b.onclick = function(){
        return _this.open(b.getAttribute('data-id'), section);
      };
    });
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    for (let i = 0; i < this.background_body.length; i++) {
      this.events.register(this.background_body[i], 'click', function () {
        return _this.close();
      });
    };
  }
  Look_createClass(Look, [{
    key: "open",
    value: function open(id) {
      var _this = this;
      this.content = document.getElementById(id);
      this.trigger = this.el.querySelector('button[data-id="' + id + '"]');
      html.classList.add('body-slide-open', 'look-slide-open');
      document.getElementById('shopify-section-' + this.sectionId).classList.add('section-open');
      this.sLC.hidden = false;
      this.sLC.setAttribute('aria-hidden','false');
      this.content.hidden = false;
      this.content.setAttribute('aria-hidden','false');
      trapFocus(this.sLC);
    }
  }, {
    key: "close",
    value: function close() {
      var _this = this;
      html.classList.remove('body-slide-open', 'look-slide-open');
      if (this.sL.closest('.shopify-section').classList.contains('section-open')) {      
        this.sL.closest('.shopify-section').classList.remove('section-open');
        removeTrapFocus(this.sLC);
        setTimeout(function() {
          _this.sLC.hidden = true;
          _this.sLC.setAttribute('aria-hidden','true');
          _this.items.forEach(function (i) {
            i.hidden = true;
            i.setAttribute('aria-hidden','true');
          });
          if (_this.trigger) {
            _this.trigger.focus();
          }
        }, 250);
      };
    }
  },{
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      if (event.el.getAttribute('id')) {
        this.open(event.el.getAttribute('id'));
      } else {
        this.open(event.el.getAttribute('data-id'));
      }
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      return this.close();
    }
  }]);
  return Look;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'shop-look-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Look(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'shop-look-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Look(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})