function Filter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Filter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Filter_createClass(Constructor, protoProps, staticProps) { if (protoProps) Filter_defineProperties(Constructor.prototype, protoProps); if (staticProps) Filter_defineProperties(Constructor, staticProps); return Constructor; }
var Filter = function () {
  function Filter(section) {
    var _this = this;
    Filter_classCallCheck(this, Filter);    
    this.el = section;
    this.sectionId = this.el.getAttribute('data-section-id');    
    this.fF = this.el.querySelector('.filter-form-' + this.sectionId);
    this.dl0 = this.fF.querySelector('#directory_label_0_' + this.sectionId);
    this.s0 = document.getElementById('select_0_' + this.sectionId);    
    this.dl1 = this.fF.querySelector('#directory_label_1_' + this.sectionId);
    this.s1 = document.getElementById('select_1_' + this.sectionId);    
    this.dl2 = this.fF.querySelector('#directory_label_2_' + this.sectionId);
    this.s2 = document.getElementById('select_2_' + this.sectionId);    
    this.dl3 = this.fF.querySelector('#directory_label_3_' + this.sectionId);
    this.s3 = document.getElementById('select_3_' + this.sectionId);      
    this.col = this.s0.getAttribute('data-columns');
    this.nS = this.fF.querySelectorAll('.no-select');
    if (this.dl0) {
      this.dl0.onchange = function(){
        if (_this.s1) {
          _this.s1.querySelector('.no-select').value = '';
        }
        if (_this.s2) {
          _this.s2.querySelector('.no-select').value = '';
        }
        if (_this.s3) {
          _this.s3.querySelector('.no-select').value = '';
        }
        var number = 1;
        _this.ajaxLoadPage(number);
        _this.dl0.classList.add('last');        
      };
    }
    if (this.dl1) {
      this.dl1.onchange = function(){
        if (_this.s2) {
          _this.s2.querySelector('.no-select').value = '';
        }
        if (_this.s3) {
          _this.s3.querySelector('.no-select').value = '';
        }
        var number = 2
        _this.ajaxLoadPage(number);
        _this.dl1.classList.add('last');        
      };
    }
    if (this.dl2) {
      this.dl2.onchange = function(){
        if (_this.s3) {
          _this.s3.querySelector('.no-select').value = '';
        }
        var number = 3
        _this.ajaxLoadPage(number);
        _this.dl2.classList.add('last');
      };
    }
    if (this.dl3) {
      this.dl3.onchange = function(){
        _this.ajaxLoadPage();
        _this.dl3.classList.add('last');
      };
    }
    this.fF.querySelector('.btn').onclick = function(ev) {
      window.location = theme.url;
    }
  }
  Filter_createClass(Filter, [{
    key: "forLoop",
    value: function forLoop(number, d) {
      var _this = this;
      for (var i = number; i < _this.col; i++) {
        var sL = document.querySelector('#select_' + i + '_' + this.sectionId),
            oP = d.querySelectorAll('option'),
            sLO = sL.querySelector('select'),
            sLOo = sLO.querySelectorAll('option:not(.first)'),
            sLOf = sLO.querySelector('option.first'),
            tag = _this.dl0.options[_this.dl0.selectedIndex].getAttribute('data-tag-' + i),
            sA = 'data-group';
        sL.setAttribute('data-tag',tag)
        sLO.value = '';
        sLO.setAttribute('disabled','disabled');
        sLO.classList.add('disabled');
        sLO.classList.remove('enabled');
        sLOo.forEach(function(o) {
          o.remove();
        });
        if (sL.getAttribute('data-tag')) {          
          oP.forEach(function(o) {
            if (o.getAttribute(sA) == tag) {
              sLO.appendChild(o);
            }
          });
          sLOf.textContent = tag;
          if (sLO.options.length > 1) {
            sLO.removeAttribute('disabled');
            sLO.classList.remove('disabled');
            sLO.classList.add('enabled');
          }
        } else {
          sLOf.textContent = sLOf.getAttribute('data-select');
        }
      };      
    }
  },{
    key: "ajaxLoadPage",
    value: function ajaxLoadPage(number) {
      var _this = this,
          filters = [];    
      _this.nS.forEach(function(n) {
        filters.push(n.options[n.selectedIndex].value);
        n.classList.remove('last');
      });
      theme.url = (filters.join(''));
      fetch(theme.url)
      .then(response => response.text())
      .then(data => {
        const final_HTML = data.split('<!-- FIRST -->').pop().split('<!-- LAST -->')[0];
        const d = document.createElement('div');
        d.innerHTML = JSON.parse(final_HTML);
        this.forLoop(number, d);
      });
    }
  }]);
  return Filter;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'filter-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Filter(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'filter-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Filter(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})