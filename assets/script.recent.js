function Recent_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Recent_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Recent_createClass(Constructor, protoProps, staticProps) { if (protoProps) Recent_defineProperties(Constructor.prototype, protoProps); if (staticProps) Recent_defineProperties(Constructor, staticProps); return Constructor; }
var Recent = function () {
  function Recent(section) {
    Recent_classCallCheck(this, Recent);
    this._loadRecent(section);
  }
  Recent_createClass(Recent, [{
    key: "_loadRecent",
    value: function _loadRecent(section) {
      var limit = section.getAttribute('data-limit');
      const pD = JSON.parse(localStorage.getItem('rVP'));
      const rVH = []
      if (pD) {    
        pD.slice(-Math.abs(limit)).forEach(function(item,i){
          rVH.push('id:' + item.pID);
        });
        const rB = rVH.join('%20OR%20');    
        var url = window.theme.routes.search_url + '?section_id=section-product-recent&q=' + rB + '&type=product';
        fetch(url)
        .then(function(response) {
          return response.text();
        })
        .then(function(_ref, force) {
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(_ref, 'text/html');      
          var cP = htmlDocument.documentElement.querySelector('.product-rows'),
              tbd = cP.querySelectorAll('article'),
              tbdF = Array.from(tbd),
              pR = section.querySelector('.product-rows');
          pR.innerHTML = '';
          for (let i = 0; i < tbd.length; i++) {
            var iD = JSON.parse(tbd[i].getAttribute('data-product-item'));
            tbd[i].setAttribute('data-index', pD.findIndex(e => e.pID === iD));
          }
          function comparator(a, b) {
            if (a.dataset.index < b.dataset.index) return 1;
            if (a.dataset.index > b.dataset.index) return -1;
            return 0;
          }
          let s = tbdF.sort(comparator);
          s.forEach(e => pR.appendChild(e));
          if (window.theme.swatches) {
            var $options = section.querySelectorAll('.product-item [data-product-option]');
            Swatches($options, 'loop')
          }
          if (window.theme.quick) {
            new Quick();
          }
          var pC = section;
          var _pC = {
            $el: pC
          };        
          Revealer('show', force, _pC);        
          setTimeout(function () {
            section.classList.add('overflow');
            section.style.setProperty('--max-height', '100%');
          }, 500);        
        }).catch(function (err) {
          section.remove();
          console.log('!: ' + err);
        });      
      }
    }
  }]);
  return Recent;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'recent-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Recent(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'recent-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Recent(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})