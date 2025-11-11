function Map_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Map_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Map_createClass(Constructor, protoProps, staticProps) { if (protoProps) Map_defineProperties(Constructor.prototype, protoProps); if (staticProps) Map_defineProperties(Constructor, staticProps); return Constructor; }
var gMap = function (section) {
  function Map(section, force) {
    Map_classCallCheck(this, Map);
    var sP = section.querySelector('.slideshow'),
        d = section.getAttribute('data-load'),
        s = section.getAttribute('data-slides');
    if (d && s && s == 'false') {
      ContentSlide(sP, force);
    }
    if (d == 'false') return;
      var section = section.querySelectorAll('[data-map]'),
          _this = this;
    section.forEach(function(s) {
      window.googleMapsLoaded = null;
      this.map = null;
      this.colors = {
        a: s.getAttribute('data-map-color-a'),
        b: s.getAttribute('data-map-color-b'),
        c: s.getAttribute('data-map-color-c'),
        d: s.getAttribute('data-map-color-d'),
        e: s.getAttribute('data-map-color-e'),
        f: s.getAttribute('data-map-color-f'),
      };
      var container = s.querySelector('[data-map-container]'),
          dS = s.getAttribute('data-slides'),
          address = s.getAttribute('data-address'),
          colors = this.colors,
          zoom = s.getAttribute('data-zoom'); 
      var zoom = Number.isNaN(zoom) ? 13 : 11 + parseInt(zoom, 10);      
      if (dS == 'true') {
        var options = {
            clickableIcons: false,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            gestureHandling: 'none',
            keyboardShortcuts: false,
            maxZoom: zoom,
            minZoom: zoom,
            scrollWheel: false,
            styles: _this.getMapStyles(colors),
            zoom: zoom,
            zoomControl: false
        };
      } else {
        var options = {
            disableDefaultUI: true,
            styles: _this.getMapStyles(colors),
            zoom: zoom
        };
      }
      if (typeof google === 'undefined') {
        var time = 350;
      } else {
        var time = 0;
      }      
      setTimeout(function () {      
        var map = new google.maps.Map(container, options);
        _this.geoCode(address, map, s)
      }, time);
    });
  };  
  Map_createClass(Map, [{
    key: "getMapStyles",
    value: function getMapStyles(colors) {
      if (!colors) {
        return [];
      }
      return [{
        elementType: 'geometry',
        stylers: [{
          color: colors.e
        }]
      }, {
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          color: colors.a
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: colors.e
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.country',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.land_parcel',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.neighborhood',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.locality',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'poi',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{
          color: colors.d
        }]
      }, {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: colors.c
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: colors.b
        }]
      }, {
        featureType: 'road.highway.controlled_access',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{
          color: colors.b
        }]
      }, {
        featureType: 'road.local',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: colors.e
        }]
      }, {
        featureType: 'transit',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: colors.f
        }]
      }];
    }
  },{
    key: "geoCode",
    value: function geoCode(address, map, section) {      
      var _this = this,
          geocoder = new google.maps.Geocoder(),
          m = section.querySelector('.map'),
          mC = section.querySelector('.map-container'),
          s = section.querySelector('.spinner'),
          i = section.querySelectorAll('.image');
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          window.googleMapsLoaded = true;        
          m.classList.add('loaded');   
          m.classList.remove('loading');
          s.classList.add('hidden');
          var position = results[0].geometry.location;
          map.setCenter(position);
          new google.maps.Marker({
            map: map,
            position: position
          });          
        } else {
          _this.getError(i,m,mC,s)          
        }
      });
      setTimeout(function () {
        if (window.googleMapsLoaded == true) {
          return;
        }
        if (m.classList.contains('loading')) {
          _this.getError(i,m,mC,s)
        }
      }, 2500);      
    }
  },{
    key: "getError",
    value: function getError(i,m,mC,s) {
      if (i.length > 0) {
        i.forEach(function(i) {
          i.classList.remove('hidden');
        });
        m.classList.add('hidden');        
        if (theme.mobileMenu == 'mobile' || Layout.isBreakpoint('S')) {
          m.closest('.contactbar-info').classList.remove('loading');
        };
        var id = mC.closest('.slider');
        let height = id.querySelector('.slide-container').clientHeight;
        id.style.setProperty('--max-height', height + 'px');
      } else {
        s.classList.add('hidden');
        mC.classList.add('hidden');            
      }
    }
  },{
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      const s = event.el,
            i = s.getAttribute('data-slide'),
            f = s.closest('.slideshow').querySelector('.content-slide-content[data-index="' + i + '"]'),
            d = {
              $el: f
            };
      if (f) {
        Revealer('show', force, d);
        f.classList.add('active');
      };
      if (s.classList.contains('active')) return;
      if (s.classList.contains('slide')) {        
        let height = s.scrollHeight,
            sC = s.closest('.slider')
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
          sC.style.setProperty('--max-height', height + 'px');
        }, 500);
      }
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      const s = event.el,
            i = s.getAttribute('data-slide'),
            f = s.closest('.slideshow').querySelector('.content-slide-content[data-index="' + i + '"]'),
            d = {
              $el: f
            };      
      if (f) {
        Revealer('hide', force, d);
        f.classList.remove('active');
      };
    }
  }]);
  return Map;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'navigation-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new gMap(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'navigation-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new gMap(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})