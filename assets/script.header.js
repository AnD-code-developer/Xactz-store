var sectionEvents = [];
Header = (function() {
  function NavTrigger_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavTrigger_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavTrigger_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavTrigger_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavTrigger_defineProperties(Constructor, staticProps); return Constructor; }
  var NavTrigger = function () {
    function NavTrigger() {
      var _this = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      NavTrigger_classCallCheck(this, NavTrigger);
      this.$el = options.el;
      this.namespace = options.namespace;
      this.trigger = options.trigger;
      this.postMessage = options.postMessage;      
      this.onShow = options.onShow;
      this.onHide = options.onHide;
      this.$overlay = document.querySelector('.site-navigation-overlay');
      this.isHovering = false;
      this.isTouching = false;
      this.isLocked = false;
      if(theme.mobileMenu != 'mobile') {
        this.selectorPath = document.querySelector('.site-navigation .navmenu-depth-1 .navmenu-item-parent.navmenu-id-'.concat(this.trigger));
        this.selectorPathA = this.selectorPath.querySelector('.navmenu-link-parent');
        this.selectorDiv = document.querySelector('.site-navigation #menu-item-'.concat(this.trigger));
        this.selector = document.querySelector('.site-navigation .navmenu-depth-1 .navmenu-item-parent.navmenu-id-'.concat(this.trigger));
        function selectorShow(){
          _this.show();
        }      
        function selectorHide(){
          _this.hide();
        }
        this.selectorPathA.addEventListener('keydown', function(ev) {
          _this.selectorPath.classList.add('tab-focused');
        });
        this.selectorPathA.onblur = function(ev){
          _this.selectorPath.classList.remove('tab-focused');
        }
        this.selectorPathA.onclick = function(ev){
          if (_this.selectorPath.classList.contains('tab-focused')) {
            ev.preventDefault();
          }
          _this.toggle();
          _this.selectorPath.classList.add('tab-focused');
        };
        this.selectorPath.onmouseenter = function(event){
          selectorShow();
        };
        this.selectorPath.onmouseleave = function(event){
          selectorHide();
        };
        this.selectorDiv.onmouseenter = function(event){
          _this.isHovering = !_this.isTouching;
          _this.isTouching = false;
        };
        this.selectorDiv.onmouseleave = function(event){
          _this.isHovering = false;
        };
        this.selectorDiv.ontouchstart = function(event){
          _this.isTouching = true;
        };
        this.selectorPath.ontouchend = function(event){
          event.preventDefault();
          _this.toggle();
        };
        this.addTrigger();
      }      
    }
    NavTrigger_createClass(NavTrigger, [{
      key: "unload",
      value: function unload() {
        var _this2 = this;
        this.isHovering = false;
        this.isLocked = false;
        this.hide();
        this.removeTriggers();
      }
    }, {
      key: "lock",
      value: function lock() {
        this.isLocked = true;
        this.show(true);        
      }
    }, {
      key: "unlock",
      value: function unlock() {
        this.isLocked = false;
        this.hide();
      }
    }, {
      key: "toggle",
      value: function toggle(force) {
        var _this = this;
        if (_this.$el.hasAttribute('data-revealer-visible')) {
          _this.selectorPathA.setAttribute('aria-expanded', false);
          _this.hide();
          removeTrapFocus(_this.selectorPath);
        } else {
          _this.selectorPathA.setAttribute('aria-expanded', true);
          _this.show();
          trapFocus(_this.selectorPath);
        }
      }
    }, {
      key: "show",
      value: function show(force) {
        var _this = this;
        this.postMessage('header-minicart:toggle', 'closed');
        this.selector.setAttribute('aria-expanded', true);
        Revealer('show', force, _this);
        if (_this.onShow) _this.onShow();
      }
    }, {
      key: "hide",
      value: function hide(force) {        
        var _this = this;
        if (this.isLocked) {
          return;
        }
        this.hideOverlay();
        if (_this.isHovering) return;
        _this.$el.closest('li').setAttribute('aria-expanded', false);
        Revealer('hide', force, _this);
        if (_this.onHide) _this.onHide();
        removeTrapFocus(_this.selectorPath);
      }
    }, {
      key: "showOverlay",
      value: function showOverlay() {
        this.$overlay.style.display = 'block';
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay() {  
        this.$overlay.style.display = 'none';
      }
    }, {
      key: "addTrigger",
      value: function addTrigger() {
        var $trigger = this.selector;
        if (!$trigger) return;
        $trigger.setAttribute('data-navmenu-trigger', this.namespace);
        $trigger.setAttribute('data-navmenu-ignore', true);
      }
    }, {
      key: "removeTriggers",
      value: function removeTriggers() {
        this.$menuNavTriggers = document.querySelectorAll("[data-navmenu-trigger=\"".concat(this.namespace, "\"]"));
        this.$menuNavTriggers.forEach(function (el) {
          var $trigger = el;
          $trigger.setAttribute('data-navmenu-trigger', this.namespace);
          $trigger.setAttribute('data-navmenu-ignore', true);
        });
      }
    }]);
    return NavTrigger;
  }();
  function ContactbarStaticSection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ContactbarStaticSection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ContactbarStaticSection_createClass(Constructor, protoProps, staticProps) { if (protoProps) ContactbarStaticSection_defineProperties(Constructor.prototype, protoProps); if (staticProps) ContactbarStaticSection_defineProperties(Constructor, staticProps); return Constructor; }
  var ContactbarStaticSection = function () {
    function ContactbarStaticSection(section, postMessage) {
      var _this = this;
      ContactbarStaticSection_classCallCheck(this, ContactbarStaticSection);
      this.$section = section;
      this.$map = section.querySelector('[data-map]');
      this.hasMap = !!this.$map;
      this.$contact = document.querySelector('section[data-section-type="contact_page"]');
      this.$mobile = document.querySelector('.mobilenav-contactbar');
      this.$el = this.$mobile.querySelector('.contactbar-info');
      this.$infoTrigger = this.$mobile.querySelector('[data-contactbar-info-trigger]');
      this.$infoClose = this.$mobile.querySelector('[data-contactbar-info-close]');
      this.postMessage = postMessage;
      if (this.hasMap) {
        this.trigger = this.$map.getAttribute('data-map-trigger');
        this.maps = [];
        if (this.trigger) {
          this.navTrigger = new NavTrigger({
            el: section.el,
            namespace: 'contactbar',
            trigger: this.trigger,
            postMessage: this.postMessage,
            onShow: function onShow() {
              _this.maps.forEach(function (map) {
                return map.resize();
              });
              _this.postMessage('nav:close-all', {});
              _this.postMessage('nav:close-triggers', {
                source: _this.$section
              });
              _this.postMessage('nav:show-overlay', {
                source: _this.$section
              });
            }
          });
        }
      }
      if (this.$infoTrigger) {
        this.$el.classList.remove('loading');        
        this.events = [
          this.$infoTrigger.onclick = function(event, force){
            event.preventDefault;
            Revealer('toggle', force, _this);
          },
          this.$infoClose.onclick = function(event, force){
            event.preventDefault;
            Revealer('hide', force, _this);
          }
        ]; 
      }
      this.layoutHandler = this.onBreakpointChange.bind(this);
      Layout.onBreakpointChange(this.layoutHandler);
    }
    ContactbarStaticSection_createClass(ContactbarStaticSection, [
      {
      key: "onBreakpointChange",
      value: function onBreakpointChange(t) {
        if (!this.isEditing) return;
        if (!Layout.isBreakpoint('S')) {
          this.navTrigger.lock();
          this.postMessage('mobilenav:close');
        } else {
          this.navTrigger.unlock();
        }
      }
    }]);
    return ContactbarStaticSection;
  }();
  function NavMobile_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavMobile_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavMobile_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobile_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobile_defineProperties(Constructor, staticProps); return Constructor; }
  var MobileNav = function () {
    function MobileNav(el) {
      var _this = this;
      NavMobile_classCallCheck(this, MobileNav);
      this.$html = document.querySelector('html');
      this.$el = el;
      this.$panel = this.$el.querySelector('.mobilenav-panel');
      this.$content = this.$el.querySelector('.mobilenav-panel-content');
      this.$searchInput = this.$el.querySelector('.mobilenav-search-input');
      this.$contact = this.$el.querySelector('.mobilenav-contactbar');
      this.$menuNavParents = this.$el.querySelectorAll('.navmenu-link-parent');
      this.$menuNavParents.forEach(function (m) {
        m.onclick = function(event){
          _this.toggleItem(event.currentTarget);
        };
        var a = m.querySelector('.navmenu-arrow-toggle');
        if (a) {
          a.onclick = function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.arrowToggle(event.currentTarget);
          }
        }
      });
      this.$megaNavTriggers = this.$el.querySelectorAll('[data-meganav-trigger]');
      this.$megaNavs = this.$el.querySelectorAll('[data-meganav]');
      this.megaNavs = [];
      this.$megaNavTriggers.forEach(function (key, megaNavTrigger) {
        var $megaNav = key;
        _this.megaNavs.push(new MeganavMenu($megaNav));
      });
    var currencyDisclosureEl = this.$el.querySelector('[data-disclosure-currency]'),
        localeDisclosureEl = this.$el.querySelector('[data-disclosure-locale]');
    if (currencyDisclosureEl) {
      this.currencyDisclosure = new Localization(currencyDisclosureEl);
    }
    if (localeDisclosureEl) {
      this.localeDisclosure = new Localization(localeDisclosureEl);
    }
    }
    NavMobile_createClass(MobileNav, [{
      key: "unload",
      value: function unload() {
        this.close();
      }
    }, {
      key: "close",
      value: function close(force) {
        var components_Modal = (new Modal('menu'));
        components_Modal.close();
      }
    }, {
      key: "toggleItem",
      value: function toggleItem(el, force) {
        var $el = el;
        if ($el.classList.contains('navmenu-selected') || $el.classList.contains('navmenu-contact')) {
          return true;
        } else {
          event.preventDefault();
          $el.classList.toggle('navmenu-selected');
          if ($el.getAttribute('aria-expanded') === 'false') {
            $el.setAttribute('aria-expanded', 'true')
          } else {
            $el.setAttribute('aria-expanded', 'false')
          }
          $el.parentNode.classList.toggle('navmenu-active');
          var _this = {
            $el: $el.parentNode.querySelector('[data-mobile-trigger ]')
          };
          Revealer('show', force, _this);
        }
      }
    }, {
      key: "arrowToggle",
      value: function arrowToggle(el, force) {
        var $el = el.parentNode;
        $el.classList.toggle('navmenu-selected');
        if ($el.getAttribute('aria-expanded') === 'false') {
          $el.setAttribute('aria-expanded', 'true')
        } else {
          $el.setAttribute('aria-expanded', 'false')
        }
        $el.parentNode.classList.toggle('navmenu-active');
        var $list = $el.parentNode.querySelector('[data-mobile-trigger]');
        var _this = {
          $el: $list
        };
        if ($list.hasAttribute('data-revealer-visible')) {
          Revealer('hide', force, _this);
        } else {
          Revealer('show', force, _this);
        }
      }
    }]);
    return MobileNav;
  }();
  function NavDesktop_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return NavDesktop_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return NavDesktop_arrayLikeToArray(o, minLen); }
  function NavDesktop_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function NavDesktop_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavDesktop_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavDesktop_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktop_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktop_defineProperties(Constructor, staticProps); return Constructor; }
  var NavDesktop = function () {
    function NavDesktop(el, postMessage) {
      var _this = this;
      NavDesktop_classCallCheck(this, NavDesktop);
      this.$el = el;
      this.el = this.$el[0];
      this.$overlay = document.querySelector('.site-navigation-overlay');
      this.$menuNavParents = this.$el.querySelectorAll('.navmenu-drop');
      this.$menuNavParentsLinks = this.$el.querySelectorAll('.navmenu-drop > .navmenu-link-parent-1');
      this.postMessage = postMessage;
      this.events = [
        this.$menuNavParents.forEach(function (m) {
          m.onmouseenter = function(event){
            _this.openItem(event.currentTarget);
            var menuNav3 = el.querySelectorAll('.tabbing');
            menuNav3.forEach(function (m) {
              m.classList.remove('visible','tabbing');
            });
          }
          m.onmouseleave = function(event){
            _this.closeItem(event.currentTarget);
          }
        }),
        this.$menuNavParentsLinks.forEach(function (m) {        
          m.addEventListener('keydown', function(ev) {
            m.closest('li').classList.add('tab-focused');
          });
          m.onblur = function(ev){
            m.closest('li').classList.remove('tab-focused');
          }
          m.onclick = function(ev){
            if (m.closest('li').classList.contains('tab-focused')) {
              ev.preventDefault();
            }
            _this.toggleItem(ev.currentTarget.closest('li'));
            m.closest('li').classList.add('tab-focused');
            m.closest('li').classList.toggle('navmenu-adjust-right-keyed', m.closest('li').getBoundingClientRect().right + m.closest('li').querySelector('.navmenu').clientWidth > window.innerWidth);
          };
          m.ontouchend = function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.toggleItem(event.currentTarget.parentNode);
          }
        }),
        this.$el.querySelector('.navmenu-depth-1 > .navmenu-item:not([data-navmenu-ignore]) .navmenu-link').onfocus = function(event){
          _this.closeAll(event.currentTarget);
        },
        document.body.onfocusin = function(event){
          if (event.currentTarget instanceof Node && _this.el.contains(event.target)) return;
          _this.closeAll(_this.el);
        },
        this.$overlay.onclick = function(event){
          _this.postMessage('nav:close-triggers', {
            source: el
          });
          _this.closeAll();
          _this.hideOverlay();
        }
      ];
    }
    NavDesktop_createClass(NavDesktop, [{
      key: "showOverlay",
      value: function showOverlay() {
        this.$overlay.style.display = 'block';
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay() {
        this.$overlay.style.display = 'none';
      }
    }, {
      key: "openItem",
      value: function openItem(el,force) {
        this.postMessage('header-minicart:toggle', 'closed');
        var $el = el;
        var _this = {
          $el: $el.querySelector('ul')
        };
        this.closeAll(el);
        $el.querySelector('a').setAttribute('aria-expanded', true);
        this.postMessage('nav:close-triggers', {
          source: el
        });
        Revealer('show', force, _this);
        $el.classList.toggle('navmenu-adjust-right', _this.$el.getBoundingClientRect().right + el.querySelector('.navmenu').clientWidth > window.innerWidth);
        this.showOverlay();
      }
    }, {
      key: "closeAll",
      value: function closeAll(target) {
        var _this2 = this;
        this.$el.querySelectorAll('.navmenu-depth-1 > .navmenu-item-parent').forEach(function (el) {
          el.querySelectorAll('.navmenu-item-parent').forEach(function (submenu) {
            if (submenu !== target && submenu.contains(target)) return true;
            _this2.closeItem(submenu);
          });
          if (el !== target && el.contains(target)) return true;
          _this2.closeItem(el);
        });
        this.hideOverlay();
      }
    }, {
      key: "closeItem",
      value: function closeItem(el,force) {
        var _this = {
          $el: el.querySelector('.navmenu-submenu')
        };
        if (_this.$el != null) {        
          el.querySelector('a').setAttribute('aria-expanded', false);
          Revealer('hide', force, _this);
          this.hideOverlay();
        };
        if (this.isFirstLevel(el)) {
          this.hideOverlay();
        }
      }
    }, {
      key: "toggleItem",
      value: function toggleItem(el, force) {
        var $el = el;
        var _this = {
          $el: $el.querySelector('ul')
        };
        var menuNav3 = el.querySelectorAll('.navmenu-depth-3');        
        if (_this.$el.hasAttribute('data-revealer-visible')) {
          $el.querySelector('a').setAttribute('aria-expanded', false);
          Revealer('hide', force, _this);          
          removeTrapFocus($el);          
          setTimeout(function() {
            _this.$el.classList.remove('tabbing');
            menuNav3.forEach(function (m) {
              m.classList.remove('visible','tabbing');
            });
          }, 250);
        } else {
          _this.$el.classList.add('tabbing');
          menuNav3.forEach(function (m) {
            m.classList.add('visible','tabbing');
          });
          $el.querySelector('a').setAttribute('aria-expanded', true);
          Revealer('show', force, _this);
          trapFocus(el);
        }
      }
    }, {
      key: "isFirstLevel",
      value: function isFirstLevel(el) {
        var $el = el;
        return $el === '.navmenu-item' && $el.parentNode === '.navmenu-depth-1' || $el === '.navmenu-link' && $el.parentNode.parentNode === '.navmenu-depth-1';
      }
    }]);
    return NavDesktop;
  }();
  function Meganav_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Meganav_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Meganav_createClass(Constructor, protoProps, staticProps) { if (protoProps) Meganav_defineProperties(Constructor.prototype, protoProps); if (staticProps) Meganav_defineProperties(Constructor, staticProps); return Constructor; }
  var Meganav = function () {
    function Meganav(el, postMessage, trigger) {
      var _this = this;
      Meganav_classCallCheck(this, Meganav);
      this.$el = el;
      this.$window = window;
      this.namespace = 'mega-nav-'.concat(trigger);
      this.trigger = trigger;
      this.postMessage = postMessage;
      this.navTrigger = new NavTrigger({
        el: el,
        namespace: this.namespace,
        trigger: this.trigger,
        postMessage: postMessage,
        onShow: function onShow() {
          _this.postMessage('nav:close-all', {});
          _this.postMessage('nav:close-triggers', {
            source: _this.$el
          });
          _this.postMessage('nav:show-overlay', {
            source: _this.$el
          });
        }
      });
    }
    Meganav_createClass(Meganav, [{
      key: "onSectionUnload",
      value: function onSectionUnload() {
        this.navTrigger.unload();
        Layout.offBreakpointChange(this.layoutHandler);
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        if (name === 'nav:close-triggers' && data.source !== this.$el) {
          this.navTrigger.hide();
        }
        if (name === 'nav:show-overlay') {
          this.navTrigger.showOverlay();
        }
      }
    }]);
    return Meganav;
  }();
  function Header_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Header_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Header_createClass(Constructor, protoProps, staticProps) { if (protoProps) Header_defineProperties(Constructor.prototype, protoProps); if (staticProps) Header_defineProperties(Constructor, staticProps); return Constructor; }
  function Header(section) {
    var _this = this;
    Header_classCallCheck(this, Header);
    this.section = section;
    this.$el = section.el;
    if (document.selectors.sht > 0) {
      const observer = new IntersectionObserver( 
        ([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
        {
          threshold: [1]
        }
      );
      observer.observe(this.$el);
    }    
    this.$mobileNavToggle = this.$el.querySelector('[data-mobilenav-toggle]');
    if (this.$mobileNavToggle) {
      this.$nav = document.getElementById('site-mobilenav');
      this.$navText = this.$nav.getAttribute('data-text');
      document.querySelector('.modal-container .modal').appendChild(this.$nav);
      this.mobileNav = new MobileNav(document.querySelector('.mobilenav-panel'));        
      this.$mobileNavToggle.addEventListener('click', function(event) {
        var components_Modal = (new Modal('menu', section.postMessage)),
            header = '<h4 id="modal__heading">' + _this.$navText + '</h4>',
            content = '';              
        components_Modal.open({
          header: header,
          content: content
        });
      })
      if (theme.mobileMenu != 'mobile' && !theme.edit) {
        this.nav = new NavDesktop(this.$el.querySelector('.site-navigation'), section.postMessage);
      }
    }
    if (this.$el.querySelector('.site-navigation .contact[data-meganav]')) {
      this.$contactbar = this.$el.querySelector('.site-navigation .contact[data-meganav]');
    } else {
      this.$contactbar = document.querySelector('.mobilenav-contactbar[data-contactbar-mobile-target]');
    }
    if (!!this.$contactbar) {
      this.$contact = new ContactbarStaticSection(this.$contactbar, section.postMessage);
    }
    this.$search = this.$el.querySelectorAll('[header-search-form-link]');
    this.$search.forEach(function (s) {
      var p = s.parentElement,
          _this = this;
      this.$searchFormContainer = p.querySelector('.site-actions-search-form');
      this.$searchForm = p.querySelector('[header-search-form]');
      this.$searchFormText = this.$searchForm.getAttribute('data-text');
      s.onclick = function(event){
        event.preventDefault();        
        var components_Modal = (new Modal('search')),
            header = '<h4 id="modal__heading">' + _this.$searchFormText + '</h4>',
            content = _this.$searchFormContainer.innerHTML;
        components_Modal.open({
          header: header,
          content: content
        });        
      }
    });
    if(this.$el.querySelector('header').getAttribute('data-search') == 'true'){
      this.$predictive_search = new Predictive_Search(this.$searchForm, section.postMessage);
    }
    this.$accountToggle = this.$el.querySelector('[data-site-actions-account]');
    if (this.$accountToggle) {
      this.$account = document.getElementById('customer');
      this.$accountText = _this.$account.getAttribute('data-text');      
      document.querySelector('.modal-container .modal').appendChild(this.$account);      
      this.$accountToggle.onclick = function(event){
        event.preventDefault();
        var components_Modal = (new Modal('account')),
            header = '<h4 id="modal__heading">' + _this.$accountText + '</h4>',
            content = '';
        components_Modal.open({
          header: header,
          content: content
        });
      }
    }
    this.$megaNavTriggers = this.$el.querySelectorAll('.site-navigation [data-meganav-trigger]');
    this.$megaNavs = this.$el.querySelectorAll('.site-navigation [data-meganav]');
    this.megaNavs = [];
    this.$megaNavTriggers.forEach(function (key, megaNavTrigger) {
      var trigger = key.dataset.meganavTrigger;
      const mN = Array.from(_this.$megaNavs);
      const $megaNav = mN.find(obj => obj.dataset.meganav === trigger);
      _this.megaNavs.push(new Meganav($megaNav, _this.section.postMessage, trigger));
    });
    this.layoutHandler = this.onBreakpointChange.bind(this);
    Layout.onBreakpointChange(this.layoutHandler);
    var currencyDisclosureEl = this.$el.querySelector('[data-disclosure-currency]');
    var localeDisclosureEl = this.$el.querySelector('[data-disclosure-locale]');
    if (currencyDisclosureEl) {
      this.currencyDisclosure = new Localization(currencyDisclosureEl);
    }
    if (localeDisclosureEl) {
      this.localeDisclosure = new Localization(localeDisclosureEl);
    }
  };
  Header_createClass(Header, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.mobileNav) {
        this.mobileNav.unload();
      }
      Layout.offBreakpointChange(this.layoutHandler);
      this.megaNavs.forEach(function (megaNav) {
        return megaNav.onSectionUnload();
      });
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name, data) {
      if (name === 'mobilenav:close') this.mobileNav.close();
      if (name === 'cart:update') {
        var c = this.$el.querySelector('[data-site-actions-cart-cart]');
        if (c) {
          if (data.item_count > 0) {
            c.querySelector('.full').classList.remove('hidden');
            c.querySelector('.empty').classList.add('hidden');
          } else {
            c.querySelector('.full').classList.add('hidden');
            c.querySelector('.empty').classList.remove('hidden');              
          }
        }
        document.querySelectorAll('[data-cart-item-count]').forEach(function (c) {
          c.textContent = "".concat(data.item_count);
        });        
      }
      if (name === 'nav:close-all') this.nav.closeAll();
      this.megaNavs.forEach(function (megaNav) {
        return megaNav.onSectionMessage(name, data);
      });
    }
  }, {
    key: "onBreakpointChange",
    value: function onBreakpointChange() {
      if (!Layout.isBreakpoint('S')) {
        if (this.mobileNav && theme.modal == true) {
          this.mobileNav.close();          
        }        
        body.classList.add('isDesktop');
        body.classList.remove('isMobile');      
        if(theme.mobileMenu != 'mobile') {
          body.classList.remove('isMobileMenu');
        }
      } else {
        body.classList.add('isMobile');
        if(theme.mobileMenu != 'mobile') {
          body.classList.add('isMobileMenu');
        }
        body.classList.remove('isDesktop');
      }
    }
  }, {
    key: "onSectionSelect",
    value: function onSectionSelect(name, data) {
      var d = name.el.querySelector('header').getAttribute('data-mobile');
      theme.edit = true;
      Check_Header(d);
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      event.$el = event.el;
      Revealer('show', force, event);
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      event.$el = event.el;
      Revealer('hide', force, event);
    }
  }]);
  return Header;
})();
function MeganavMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function MeganavMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function MeganavMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) MeganavMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) MeganavMenu_defineProperties(Constructor, staticProps); return Constructor; }
var MeganavMenu = function () {
  function MeganavMenu(el) {
    var _this = this;
    MeganavMenu_classCallCheck(this, MeganavMenu);
    this.$el = el;
    this.$megaNavHeaders = this.$el.querySelectorAll('.meganav-menu-header');
    this.$megaNavHeaders.forEach(function (m) {
      m.onclick = function(event){
        var $header = event.currentTarget;
        if (!$header.classList.contains('meganav-menu-empty') && !$header.classList.contains('navmenu-link-meganav')) {
          _this.toggleList($header, event);
        }
      }
      var a = m.querySelector('.navmenu-arrow-toggle');
      if (a) {
        a.onclick = function(event){
          event.preventDefault();
          event.stopPropagation();
          var $header = event.currentTarget;
          _this.arrowToggle($header);
        }
      }
    });
  }
  MeganavMenu_createClass(MeganavMenu, [{
    key: "toggleList",
    value: function toggleList($header, state, force) {
      var $group = $header.closest('.meganav-menu-group');
      if ($group.classList.contains('meganav-menu-active')) {
        return true;
      } else {
        state.preventDefault();
        var $list = $group.querySelector('.meganav-menu-items');
        $group.classList.toggle('meganav-menu-active', state);
        var _this = {
          $el: $list
        };
        Revealer('show', force, _this);
      }
    }
  }, {
    key: "arrowToggle",
    value: function arrowToggle($header, force) {
      var $group = $header.closest('.meganav-menu-group'),
          $list = $group.querySelector('.meganav-menu-items');
      $group.classList.toggle('meganav-menu-active');
      var _this = {
        $el: $list
      };
      if ($list.hasAttribute('data-revealer-visible')) {
        Revealer('hide', force, _this);
      } else {
        Revealer('show', force, _this);
      }
    }
  }]);
  return MeganavMenu;
}();
function PredSear_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function PredSear_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function PredSear_createClass(Constructor, protoProps, staticProps) { if (protoProps) PredSear_defineProperties(Constructor.prototype, protoProps); if (staticProps) PredSear_defineProperties(Constructor, staticProps); return Constructor; }
var Predictive_Search = function (el,m) {
  function Predictive_Search() {
    var _this = this;
    PredSear_classCallCheck(this, Predictive_Search);
    var pS = JSON.parse(document.getElementById('shopify-features').textContent);
    function debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
    class PredictiveSearch extends HTMLElement {
      constructor() {
        super();
        this.cachedResults = {};
        this.input = this.querySelector('input[type="text"]');
        this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
        this.predictiveSearchResultsTop = this.getBoundingClientRect().top;
        this.formSearch = this.querySelector('form.search');
        this.closeBtn = this.formSearch.querySelector('[data-predictive-search-dismiss]');
        this.shopifySection = this.closest('.shopify-section');
        this.isOpen = false;
        this.setupEventListeners();
      }
      setupEventListeners() {
        var _this = this;
        this.formSearch.addEventListener('submit', this.onFormSubmit.bind(this));
        this.input.addEventListener('input', debounce((event) => {
          this.onChange(event);
        }, 0).bind(this));
        if (!theme.modal) {
          this.input.addEventListener('focus', this.onFocus.bind(this));
          this.addEventListener('focusout', this.onFocusOut.bind(this));
        }        
        this.closeBtn.addEventListener('click', function(ev) {
          _this.close();
          _this.input.value = '';
          if (theme.modal) {
            removeTrapFocus(_this);
          }          
          ev.preventDefault();
        }, false);
      }
      getQuery() {
        return this.input.value.trim();
      }
      onChange() {
        const searchTerm = this.getQuery();
        if (!searchTerm.length) {
          this.close(true);
          return;
        }
        this.getSearchResults(searchTerm);
      }
      onFormSubmit(event) {
        if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
      }      
      onFocus() {
        const searchTerm = this.getQuery();        
        if (!searchTerm.length || this.input.hasAttribute('data-mobile')) return;
        if (this.getAttribute('results') === 'true') {
          this.open();
        } else {
          this.getSearchResults(searchTerm);
        }        
      }      
      onFocusOut() {
        if (this.getAttribute('results') === 'true') {   
          setTimeout(() => {if (!this.contains(document.activeElement)) this.close();})
        };        
      }
      selectOption() {
        const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');
        if (selectedProduct) selectedProduct.click();
      }
      getSearchResults(searchTerm) {
        const queryKey = searchTerm.replace(" ", "-").toLowerCase();
        if (this.cachedResults[queryKey]) {
          this.renderSearchResults(this.cachedResults[queryKey]);
          return;
        }
        const search_limit = this.predictiveSearchResults.getAttribute('data-search-limit'),
              search_fields = this.predictiveSearchResults.getAttribute('data-search-fields');
        if (pS.predictiveSearch == true) {
          var URL = window.theme.routes.predictive_search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=modal-predictive-search&' + encodeURIComponent('resources[fields]') + '=' + search_fields + '&' + encodeURIComponent('resources[limit]') + '=' + search_limit;
          } else {
          var URL = window.theme.routes.search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=modal-predictive-search&options[prefix]=last';
        }
        fetch(URL)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-modal-predictive-search').innerHTML;
          this.cachedResults[queryKey] = resultsMarkup;
          this.renderSearchResults(resultsMarkup);
        })
        .catch((error) => {
          this.close();
          throw error;
        });
      }
      renderSearchResults(resultsMarkup) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.setAttribute('results', true);
        this.setLiveRegionResults();
        this.open();        
      }
      setLiveRegionResults() {
        this.removeAttribute('loading');
      }
      getResultsMaxHeight() {
        this.resultsMaxHeight = window.innerHeight - this.getBoundingClientRect().top - 80;          
        return this.resultsMaxHeight;
      }
      open() {
        this.predictiveSearchResults.style.display = 'block';        
        if (theme.modal && theme.modalHeight) {
          this.predictiveSearchResults.style.maxHeight = "calc(100dvh - ".concat(theme.modalHeight, "px)");
          this.querySelector('[data-predictive-search-list]').style.maxHeight = "calc(100dvh - ".concat(theme.modalHeight, "px)");
        } else {
          this.predictiveSearchResults.style.maxHeight = this.getResultsMaxHeight() + 'px';
          this.querySelector('[data-predictive-search-list]').style.maxHeight = this.getResultsMaxHeight() + 'px';
        }
        this.setAttribute('open', true);
        this.input.setAttribute('aria-expanded', true);
        this.isOpen = true;
        this.formSearch.classList.add('active');
        if (this.shopifySection) {
          this.shopifySection.classList.add('active');
        }
        if (theme.modal) {
          this.closeBtn.classList.remove('hidden');
          var _this = this;
          function modal_timeout(e) {
            if (e.keyCode == 9) {
              trapFocus(_this); 
              _this.input.removeEventListener('keydown', modal_timeout);
            }
          }
          this.input.addEventListener('keydown', modal_timeout);
        }
        if (window.theme.swatches) {
          var $options = document.querySelectorAll('.product-item [data-product-option]');
          Swatches($options, 'loop')
        }
        if (window.theme.quick) {
          new Quick();
        }        
      }
      close(clearSearchTerm = false) {        
        if (clearSearchTerm) {
          this.input.value = '';
          this.removeAttribute('results');      
        }
        this.predictiveSearchResults.style.maxHeight = '0px';
        this.querySelector('form.search').classList.remove('open');
        const selected = this.querySelector('[aria-selected="true"]');
        if (selected) selected.setAttribute('aria-selected', false);
        this.input.setAttribute('aria-activedescendant', '');
        this.removeAttribute('open');
        this.input.setAttribute('aria-expanded', false);
        var _this = this;
        setTimeout(function () {
          _this.formSearch.classList.remove('active');
          if (_this.shopifySection) {
            _this.shopifySection.classList.remove('active');
          }
        }, 250);
        this.isOpen = false;        
        this.setAttribute('results', false);
        if (theme.modal) {
          var _this = this;
          removeTrapFocus(this);          
          setTimeout(function () {
            _this.predictiveSearchResults.style.display = 'none';
            _this.closeBtn.classList.add('hidden');            
            trapFocus(_this.closest('[data-modal-container]'));
            _this.formSearch.querySelector('input').focus();            
          }, 250);
        } else {
          this.formSearch.focus();          
        }        
      }
    }
    if (!customElements.get('predictive-search')) { 
      customElements.define('predictive-search', PredictiveSearch); 
    }
  };
  return Predictive_Search;
}();
function Localization_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function Localization_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function Localization_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) Localization_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) Localization_defineProperties(Constructor, staticProps);
  return Constructor;
}
function unwrapExports (x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var EventHandler_1 = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;
  var EventHandler =
      function () {
        function EventHandler() {
          this.events = [];
        }
        EventHandler.prototype.register = function (el, event, listener) {
          if (!el || !event || !listener) return null;
          this.events.push({
            el: el,
            event: event,
            listener: listener
          });
          el.addEventListener(event, listener);
          return {
            el: el,
            event: event,
            listener: listener
          };
        };
        EventHandler.prototype.unregister = function (_a) {
          var el = _a.el,
              event = _a.event,
              listener = _a.listener;
          if (!el || !event || !listener) return null;
          this.events = this.events.filter(function (e) {
            return el !== e.el || event !== e.event || listener !== e.listener;
          });
          el.removeEventListener(event, listener);
          return {
            el: el,
            event: event,
            listener: listener
          };
        };
        EventHandler.prototype.unregisterAll = function () {
          this.events.forEach(function (_a) {
            var el = _a.el,
                event = _a.event,
                listener = _a.listener;
            return el.removeEventListener(event, listener);
          });
          this.events = [];
        };
        return EventHandler;
      }();
  exports["default"] = EventHandler;
});
var Events = unwrapExports(EventHandler_1);
var selectors = {
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]'
};
var classes = {
  listVisible: 'disclosure-list--visible'  
};
var Disclosure = function () {
  function Disclosure(el) {
    Localization_classCallCheck(this, Disclosure);
    this.el = el;
    this.aB = document.getElementById('ajaxBusy');
    this.events = new Events();
    this.cache = {};
    this._cacheSelectors();
    this._connectToggle();
    this._onFocusOut();    
  }
  Localization_createClass(Disclosure, [{
    key: "_cacheSelectors",
    value: function _cacheSelectors() {
      this.cache = {
        disclosureList: this.el.querySelector(selectors.disclosureList),
        disclosureToggle: this.el.querySelector(selectors.disclosureToggle),
        disclosureInput: this.el.querySelector(selectors.disclosureInput)      
      };
    }
  }, {
    key: "_loadList",
    value: function _loadList() {
      var _this = this,
          dL = _this.cache.disclosureList;
      if (dL.classList.contains('loading')) {
        var id = _this.cache.disclosureList.getAttribute('data-id');        
        if (_this.cache.disclosureToggle.getAttribute('aria-controls') == 'lang-list-' + id) {
          var l = JSON.parse(document.getElementById('LanguageJson-' + id).innerHTML);
        } else {
          var l = JSON.parse(document.getElementById('CurrencyJson-' + id).innerHTML);
        }
        dL.innerHTML = l;
        dL.classList.remove('loading');
        _this._connectOptions();
      }
    }
  }, {
    key: "_connectToggle",
    value: function _connectToggle() {
      var _this = this,
          dT = this.cache.disclosureToggle;
      dT.onmouseenter = function(){
        _this._loadList();
      };
      dT.ontouchstart = function(){
        _this._loadList();
      };
      this.events.register(dT, 'click', function (e) {
        var ariaExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
        e.currentTarget.setAttribute('aria-expanded', !ariaExpanded);
        _this.cache.disclosureList.classList.toggle(classes.listVisible);
      });
    }
  }, {
    key: "_connectOptions",
    value: function _connectOptions() {      
      var _this2 = this;
      var options = this.el.querySelectorAll('[data-disclosure-option]')
      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        this.events.register(option, 'click', function (e) {
          return _this2._submitForm(e.currentTarget.dataset.value);
        });
      }
    }
  }, {
    key: "_onFocusOut",
    value: function _onFocusOut() {
      var _this3 = this;
      this.events.register(this.cache.disclosureToggle, 'focusout', function (e) {
        var disclosureLostFocus = !_this3.el.contains(e.relatedTarget);
        if (disclosureLostFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.cache.disclosureList, 'focusout', function (e) {
        var childInFocus = e.currentTarget.contains(e.relatedTarget);
        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);
        if (isVisible && !childInFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.el, 'keyup', function (e) {
        if (e.defaultPrevented) {
          return;
        }
        if (e.key !== 'Escape' || e.key !== 'Esc') return;
        _this3._hideList();
        _this3.cache.disclosureToggle.focus();
      });
      this.events.register(document.body, 'click', function (e) {
        var isOption = _this3.el.contains(e.target);
        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);
        if (isVisible && !isOption) {
          _this3._hideList();
        }
      });
    }
  }, {
    key: "_submitForm",
    value: function _submitForm(value) {
      this.cache.disclosureInput.value = value;
      this.el.closest('form').submit();
      this.aB.style.display = 'block';
    }
  }, {
    key: "_hideList",
    value: function _hideList() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);
  return Disclosure;
}();
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
var Localization = (Disclosure);
function accountTemplates(force) {
  var $formWrapper = document.querySelectorAll('[data-login-forms]');
  $formWrapper.forEach(function(fW){
    var $formWrapperLinks = fW.querySelectorAll('.account-recovery-toggle');
    if ($formWrapperLinks.length) {      
      fW.$options = fW.querySelector('.account-options-slide');
      fW.$options.$el = fW.$options;      
      fW.$recovery = fW.querySelector('.account-recovery-slide');
      fW.$recovery.$el = fW.$recovery;
      $formWrapperLinks.forEach(function(f){
        function slideLoad() {
          fW.querySelectorAll('.slider-h').forEach(function(f){
            if (f.getAttribute('data-loaded') === 'true') {
              return;
            }
            let height = f.scrollHeight;
            f.setAttribute('data-max-height', height);
            f.setAttribute('data-loaded', true);
            fW.classList.remove('first-visible');
            if (f.classList.contains('visible')) {
              fW.style.setProperty('--max-height', height + 'px');
            }
          });
        }        
        f.onmouseenter = function(){
          slideLoad();
        };
        f.ontouchstart = function(){
          slideLoad();
        };        
        f.onfocus = (event) => {
          slideLoad();
        }
        f.onclick = function(event) {
          let height = fW.querySelector('.' + f.getAttribute('data-index')).getAttribute('data-max-height');
          fW.style.setProperty('--max-height', height + 'px');
          fW.$options.classList.toggle('visible');
          fW.$recovery.classList.toggle('visible');
          setTimeout(function() {
            if (theme.modal) {
              trapFocus(fW.closest('.modal')); 
            }            
            fW.querySelector('.visible input[type=email]:first-of-type').focus();
          }, 250);
        };
      });
    }
  });
}
accountTemplates();