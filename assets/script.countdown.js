function Countdown_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }//
function Countdown_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Countdown_createClass(Constructor, protoProps, staticProps) { if (protoProps) Countdown_defineProperties(Constructor.prototype, protoProps); if (staticProps) Countdown_defineProperties(Constructor, staticProps); return Constructor; }
var Countdown = function () {
  function Countdown(section) {
    var countdown = section.querySelector('[data-countdown]'),
        text = section.querySelectorAll('.countdown-text'),
        d = countdown.querySelector('[data-days]'),
        h = countdown.querySelector('[data-hours]'),
        m = countdown.querySelector('[data-minutes]'),
        s = countdown.querySelector('[data-seconds]'),
        date = Math.floor(countdown.getAttribute('data-date') * 1000),
        x = setInterval(function() {
          var now = new Date().getTime(),
              distance = date - now,
              days = Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if (distance < 0) {
            d.innerHTML = 0;
            h.innerHTML = 0;
            m.innerHTML = 0;
            s.innerHTML = 0;
            clearInterval(x);
            if (text[0].classList.contains('hidden')) return;    
            text.forEach(function(t){
              if (t.hasAttribute('data-before')) {
                t.classList.add('countdown-text-hide');
                window.setTimeout(function() {
                  t.classList.add('hidden'); 
                }, 1000);
              } else {
                t.classList.remove('hidden');
                window.setTimeout(function() {
                  t.classList.remove('countdown-text-hide'); 
                }, 500);            
              }
            });            
          } else {
            d.innerHTML = days;
            h.innerHTML = hours;
            m.innerHTML = minutes;
            s.innerHTML = seconds;
          }
        }, 1000);
  }
  return Countdown;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'countdown-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Countdown(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'countdown-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Countdown(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})