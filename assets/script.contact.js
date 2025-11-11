function Contact_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Contact_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Contact_createClass(Constructor, protoProps, staticProps) { if (protoProps) Contact_defineProperties(Constructor.prototype, protoProps); if (staticProps) Contact_defineProperties(Constructor, staticProps); return Constructor; }
var Contact = function (force) {
  function Contact(section) {
    Contact_classCallCheck(this, Contact);
    var hny = section.querySelector('[data-honeypot]');
    hny.disabled = false;
    hny.onclick = function(ev){
      if (section.querySelector('[data-form-number]').value.length > 0) {
        ev.preventDefault();
        hny.disabled = true;
      }
    }    
  }
  return Contact;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'contact-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Contact(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'contact-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Contact(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})