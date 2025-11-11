function Collapsible_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Collapsible_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Collapsible_createClass(Constructor, protoProps, staticProps) { if (protoProps) Collapsible_defineProperties(Constructor.prototype, protoProps); if (staticProps) Collapsible_defineProperties(Constructor, staticProps); return Constructor; }
var Collapsible = function () {
  function Collapsible(section, force) {    
    var _this = this;
    ContentSlide(section, force);
  }
  Collapsible_createClass(Collapsible, [{
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      const f = event.el.querySelector('.content-slide-content'),
            d = {
              $el: f
            };      
      Revealer('show', force, d);
      f.classList.add('active');
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      const f = event.el.querySelector('.content-slide-content'),
            d = {
              $el: f
            };      
      Revealer('hide', force, d);
      f.classList.remove('active');
    }
  }]);
  return Collapsible;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'collapsible-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Collapsible(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'collapsible-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Collapsible(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})