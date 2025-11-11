window.theme = window.theme || {};
!(function () {
  "undefined" == typeof window.Shopify && (window.Shopify = {}),
    (Shopify.each = function (t, e) {
    for (var n = 0; n < t.length; n++) e(t[n], n);
  }),
    (Shopify.money_format = "${{amount}}"),
    (Shopify.onCartUpdate = function (t) {
    alert("There are now " + t.item_count + " items in the cart.");
  }),
    (Shopify.formatMoney = function (t, e) {
    function n(t, e) {
      return "undefined" == typeof t ? e : t;
    }
    function i(t, e, i, r) {
      if (((e = n(e, 2)), (i = n(i, ",")), (r = n(r, ".")), isNaN(t) || null == t)) return 0;
      t = (t / 100).toFixed(e);
      var o = t.split("."),
          s = o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
          a = o[1] ? r + o[1] : "";
      return s + a;
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var r = "",
        o = /\{\{\s*(\w+)\s*\}\}/,
        s = e || this.money_format;
    switch (s.match(o)[1]) {
      case "amount":
        r = i(t, 2);
        break;
      case "amount_no_decimals":
        r = i(t, 0);
        break;
      case "amount_with_comma_separator":
        r = i(t, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        r = i(t, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        r = i(t, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        r = i(t, 2, "'");
    }
    return s.replace(o, r);
  })
})();
var sectionEvents = [];
var scriptsLoaded = [];
function sectionObserver(){
  var lazySections = [].slice.call(document.querySelectorAll('.shopify-section section'));
  let lazySectionsObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      let v = entry.target.querySelectorAll('figure.loaded video');
      if (entry.isIntersecting) {
        if (!entry.target.hasAttribute('data-loaded')) {
          let lazySection = entry.target;
          let lazyURL = lazySection.dataset.url;
          lazySection.classList.add('loaded');
          lazySection.setAttribute('data-loaded','true');
          function sendSectionData(data){
            const sectionLoaded = new CustomEvent('Section:Loaded', {
              'detail': data
            });
            document.dispatchEvent(sectionLoaded);
            sectionEvents.push(sectionLoaded);
          }
          function loadScript(url, callback){
            var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.async = false;
            script.onload = callback(lazySection);
            head.appendChild(script);
            scriptsLoaded.push(lazyURL);
          }
          if (lazyURL) {
            if (!scriptsLoaded.includes(lazyURL)) {
              loadScript(lazyURL, sendSectionData);
            } else {
              sendSectionData(lazySection)
            }
          }
        }
        v.forEach(function(v) {
          v.play();
        });
        if (window.theme.animate) {
          entry.target.classList.add('animate');
        }
      } else {
        v.forEach(function(v) {
          v.pause();
        });
      }
    });
  });
  lazySections.forEach(function(lazySection) {
    lazySectionsObserver.observe(lazySection);
  });
};
if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
  sectionObserver();
}
var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
  window.setTimeout(fn, 1000/60);
}
var methods = {
  isVisible: function(el) {  
    return !!el.getAttribute('data-revealer-visible');
  },
  show: function(el, force) {
    var el = el.$el;
    let heightEl = el.scrollHeight;
    let heightWindow = window.innerHeight;    
    if (heightEl > heightWindow) {
      if (el.hasAttribute('data-height')) {
        var height = heightEl;
      } else {
        var height = heightWindow;
      }
    } else {
      var height = heightEl;
    }
    el.classList.add('no-scroll');
    let parent_m = el.closest('.mobilenav-navigation .navmenu-depth-2');
    let parent_d = el.closest('.site-navigation .navmenu-depth-2');
    el.style.setProperty('--max-height', height + 'px');
    el.setAttribute('data-max-height', height);
    if (el.hasAttribute('data-desktop-trigger')) {
      el.style.setProperty('--max-height', window.innerHeight - el.offsetTop - 20 + 'px');
      el.setAttribute('data-max-height', window.innerHeight - el.offsetTop - 20);
    }
    if (parent_m && el != parent_m) {
      let h = parent_m.scrollHeight;
      parent_m.style.setProperty('--max-height', h + height + 'px');
      parent_m.setAttribute('data-max-height', h + height);
    }
    if (methods.isVisible(el)) {
      el.classList.remove('animating','animating-in');
      return;
    }
    el.setAttribute('data-revealer-visible', true);
    if (force) {
      el.classList.add('visible');
      return;
    }
    raf(function(){
      el.classList.add('animating', 'animating-in');
      raf(function(){
        el.classList.add('visible');
        el.classList.remove('animating', 'animating-in');
      });
    });
    setTimeout(function() {
      el.classList.remove('no-scroll');
    }, 250);
  },
  hide: function(el, force) {
    var el = el.$el;
    el.classList.add('no-scroll');
    if (!methods.isVisible(el)) {
      el.classList.remove('animating', 'animating-out', 'visible');
      return;
    }
    el.removeAttribute('data-revealer-visible');
    if (force) {
      el.classList.remove('visible');
      return;
    }
    raf(function(){
      el.classList.add('animating', 'animating-out');
      raf(function(){
        el.classList.remove('visible');
        el.classList.remove('animating', 'animating-in', 'animating-out');
      });
    });
    setTimeout(function() {
      el.classList.remove('no-scroll');
    }, 250);
  },
  toggle: function(el, force) {
    if (el.$el.hasAttribute('data-revealer-visible')) {
      methods.hide(el, force);
    } else {
      methods.show(el, force);
    }
  }
};
function Revealer(method, force, _this) {  
  var action = methods[method || "toggle"];
  if (!action) return _this;
  if (method === 'isVisible') {
    return action(_this);
  }
  action(_this, force);
};
function changeItem(t, r, e) {
  fetch(window.theme.routes.cart_change_url + '.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: t,
      quantity: r
    })
  }).then(function(r) {        
    return r.json();        
  }).then(function(j) {
    "function" == typeof e ? e(t) : Shopify.onCartUpdate(t);
  }).catch(function(err) {
    console.error('!: ' + err)
  });
};
function getScript(scriptUrl, callback) {
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.onload = callback;
  document.body.appendChild(script);
}
function getBreakpoint() {
  return window.getComputedStyle(document.documentElement, ':after').getPropertyValue('content').replace(/"/g, '');
}
var eventHandlers = [];
var previousBreakpoint = getBreakpoint();
function isBreakpoint() {
  for (var i = 0; i < arguments.length; i++) {
    if (getBreakpoint() === (i < 0 || arguments.length <= i ? undefined : arguments[i])) {
      return true;
    }
  }
  return false;
}
function onBreakpointChange(eventHandler) {
  if (eventHandlers.indexOf(eventHandler) === -1) {
    eventHandlers.push(eventHandler);
  }
}
function offBreakpointChange(eventHandler) {
  var index = eventHandlers.indexOf(eventHandler);
  if (index !== -1) {
    eventHandlers.splice(index, 1);
  }
}
window.addEventListener('resize', (function (event) {
  var currentBreakpoint = getBreakpoint();
  if (previousBreakpoint !== currentBreakpoint) {
    eventHandlers.forEach(function (eventHandler) {
      return eventHandler(event, {
        previous: previousBreakpoint,
        current: currentBreakpoint
      });
    });
  }
  previousBreakpoint = currentBreakpoint;
}));
Layout = ({
  getBreakpoint: getBreakpoint,
  isBreakpoint: isBreakpoint,
  onBreakpointChange: onBreakpointChange,
  offBreakpointChange: offBreakpointChange
});
function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
function Menu_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = Menu_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function Menu_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Menu_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Menu_arrayLikeToArray(o, minLen); }
function Menu_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function Menu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Menu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Menu_createClass(Constructor, protoProps, staticProps) { if (protoProps) Menu_defineProperties(Constructor.prototype, protoProps); if (staticProps) Menu_defineProperties(Constructor, staticProps); return Constructor; }
var Menu = function () {
  function Menu($el, states, initialState) {
    var _this = this;
    Menu_classCallCheck(this, Menu);
    this.$html = document.querySelector('html');
    this.$el = $el;
    this.el = $el;
    this.states = states;
    this.currentState = initialState;
    this.$currentStateSlideout = {};
    if (this.$el) {
      _this.changeState(_this.currentState);
    }
  }
  Menu_createClass(Menu, [{
    key: "changeState",
    value: function changeState(newState, force) {
      var _this2 = this;
      Revealer('show', force, _this2);
      var oldState = this.currentState,
          $oldSlideout = this.$el.querySelector(this.currentState.slideoutSelector),
          $oldButtons = this.$el.querySelector(this.currentState.buttonsSelector),
          $newSlideout = this.$el.querySelector(newState.slideoutSelector),
          $newButtons = this.$el.querySelector(newState.buttonsSelector),
          callback = newState.callback;
      if (callback) {
        callback(this.currentState);
      }
      this._unbindEvents();
      this._unbindSlideoutEvents();
      this.currentState = newState;
      this.$currentStateSlideout = $newSlideout;
      this._bindEvents();
      if ($oldButtons) {
        $oldButtons.style.display = 'none';
        $newButtons.style.display = 'grid';
      } else {
        $newButtons.style.display = 'grid';
      }
      if ($oldSlideout) {
        Revealer('hide', force, oldState);
        window.setTimeout(function() { 
          html.classList.remove('scroll-lock','scroll-lock-mobile');
        }, 250);
        _this2._bindSlideoutEvents();
        if ($newSlideout) {
          $newSlideout.focus();
        }
      } else {
        if ($newSlideout) {
          this.$html.classList.add('scroll-lock');
          Revealer('show', force, newState);
          trapFocus(_this2.$el);
          setTimeout(function () {
            $newSlideout.focus();
            _this2._bindSlideoutEvents();
          }, 100);
        }
      }
      return true;
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this3 = this;
      var _iterator = Menu_createForOfIteratorHelper(this.currentState.buttons),
          _step;
      try {
        var _loop = function _loop() {
          var button = _step.value;
          var button_selectors = _this3.$el.querySelectorAll(button.selector);
          button_selectors.forEach(function (event) {
            if (!event) return
            event.onclick = function(event){
              return button.callback();
            }
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _iterator2 = Menu_createForOfIteratorHelper(this.currentState.buttons),
          _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var button = _step2.value;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_focusin",
    value: function _focusin(event) {
      var $target = event.target;
      var _this4 = this;
      if (!_this4.$currentStateSlideout) {
        return;
      }
      if (!_this4.$el.contains($target) && !_this4.$currentStateSlideout.contains($target)) {
        var dismiss = _this4.currentState.dismiss;
        if (dismiss) {
          dismiss(_this4.currentState);
        }
      }
    }
  }, {
    key: "_touchstop",
    value: function _touchstop(event) {
      event.stopPropagation();
    }
  }, {
    key: "_bindSlideoutEvents",
    value: function _bindSlideoutEvents() {
      if (!this.$currentStateSlideout) {
        return;
      }
      window.addEventListener('focusin', this._focusin);
      this.$el.addEventListener('touchstart', this._touchstop);
      this.$el.addEventListener('touchend', this._touchstop);
    }
  }, {
    key: "_unbindSlideoutEvents",
    value: function _unbindSlideoutEvents() {
      if (!this.$currentStateSlideout) {
        return;
      }
      window.removeEventListener('focusin', this._focusin);
      this.$el.removeEventListener('touchstart', this._touchstop); 
      this.$el.removeEventListener('touchend', this._touchstop);
    }
  }, {
    key: "unload",
    value: function unload() {
      this._unbindEvents();
      this._unbindSlideoutEvents();
    }
  }]);
  return Menu;
}();
function CartItem_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function CartItem_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function CartItem_createClass(Constructor, protoProps, staticProps) { if (protoProps) CartItem_defineProperties(Constructor.prototype, protoProps); if (staticProps) CartItem_defineProperties(Constructor, staticProps); return Constructor; }
var CartItem = function () {
  function CartItem(el, onUpdateCallback, force) {
    var _this = this;
    CartItem_classCallCheck(this, CartItem);
    this.el = el;
    this.cart = el.closest('section');    
    this.full = this.cart.querySelector('.cart-mini-full');
    this.empty = this.cart.querySelector('.cart-mini-empty');    
    this.aB = document.getElementById('ajaxBusy');
    this.qty = el.getAttribute('data-item-count');
    this.count = el.getAttribute('data-cart-count');
    this.onUpdateCallback = onUpdateCallback;
    this.id = el.dataset.cartItem;
    this.onQuantityInputChange = function () {
      return _this._onQuantityInputChange();
    };
    this.onRemoveButtonClick = function () {
      var value = 0;
      _this._changeCartQuantity(value, _this.onUpdateCallback);
      return _this._removeFromCart(value);
    };
    this.removeEl = el.querySelector('[data-cart-item-remove]');
    this.removeEl.addEventListener('click', this.onRemoveButtonClick);
    if (el.querySelector('[data-quantity]')) {
      this.quantity = new Quantity(el.querySelector('[data-quantity]'));
      this.quantity.input.addEventListener('change', this.onQuantityInputChange);
      ContentSlide(this.el, force);      
    }
  }
  CartItem_createClass(CartItem, [{
    key: "unload",
    value: function unload() {
      this.removeEl.removeEventListener('click', this.onRemoveButtonClick);
      if (this.quantity) {
        this.quantity.input.removeEventListener('change', this.onQuantityInputChange);
      }
    }
  }, {
    key: "_onQuantityInputChange",
    value: function _onQuantityInputChange() {
      var value = this.quantity.value;
      this._changeCartQuantity(value, this.onUpdateCallback);
      if (value > 0) {
        this.aB.style.display = 'block';
      } else {
        this._removeFromCart(value);
      }
    }
  }, {
    key: "_removeFromCart",
    value: function _removeFromCart(value, force) {
      var _this2 = this;
      if ((this.count - this.qty) == 0) {
        this._emptyCart();
        return;
      } else {      
        this.$el = this.el;
        let height = this.el.scrollHeight;
        this.el.style.setProperty('--max-height', height + 'px');
        Revealer('hide', force, this);
      }
      _this2._changeCartQuantity(0, function () {
        _this2.onUpdateCallback();
      });
    }
  }, {
    key: "_emptyCart",
    value: function _emptyCart(force) {
      var _this = this;
      if (this.full.getAttribute('data-type') === 'main-cart') {
        let height = this.full.scrollHeight;
        this.full.style.setProperty('--max-height', height + 'px');
      }
      setTimeout(function() {      
        if (_this.full.querySelector('.content-details-sticky')) {
          _this.full.querySelector('.content-details-sticky').style.setProperty('top', '0px');
        }
        _this.full.$el = _this.full;  
        Revealer('hide', force, _this.full);
        _this.empty.$el = _this.empty;  
        setTimeout(function() {
          Revealer('show', force, _this.empty);
        }, 250);
      }, 1);
    }
  }, {
    key: "_changeCartQuantity",
    value: function _changeCartQuantity(quantity, callback) {
      changeItem(this.id, quantity, callback);
    }
  }]);
  return CartItem;
}();
function Cart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Cart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Cart_createClass(Constructor, protoProps, staticProps) { if (protoProps) Cart_defineProperties(Constructor.prototype, protoProps); if (staticProps) Cart_defineProperties(Constructor, staticProps); return Constructor; }
var MonoCart = function () {
  function MonoCart() {
    Cart_classCallCheck(this, MonoCart);
    this.carts = [];
  }
  Cart_createClass(MonoCart, [{
    key: "addCart",
    value: function addCart(el, postMessage) {
      var el = el.el,
          _this = this,
          cartItemEls = el.querySelectorAll('[data-cart-item]'),
          cartTerms = document.querySelectorAll('[data-cart-terms]');
      cartTerms.forEach(function (c) {
        _this.terms(el,c);
      });
      var cartItems = [];
      this.postMessage = postMessage;
      cartItemEls.forEach(function (cartItemEl) {
        return cartItems.push(new CartItem(cartItemEl, _this.update.bind(_this), _this.postMessage));
      });
      this.carts.push({
        el: el,
        cartItems: cartItems
      });
    }
  }, {
    key: "update",
    value: function update(force) {
      var _this2 = this;
      return shopify_asyncview_dist_index_es.load(window.theme.routes.cart_url, {
        view: 'ajax'
      }).then(function (_ref) {
        if (_ref) {
          var html = _ref.html,
              data = _ref.data,
              sm = document.querySelectorAll('shipping-message');          
          _this2.postMessage('cart:update', data);
          _this2.carts.forEach(function (cart) {
            this.aB = document.getElementById('ajaxBusy');
            this.aB.style.display = 'none';
            cart.cartItems.forEach(function (cartItem) {
              return cartItem.unload();
            });
            cart.cartItems = [];
            var cartElements = [{
              containers: cart.el.querySelectorAll('[data-cart-items]'),
              html: html.cart_items
            }, {
              containers: cart.el.querySelectorAll('[data-cart-discounts]'),
              html: html.cart_discounts
            }, {
              containers: cart.el.querySelectorAll('[data-cart-subtotal]'),
              html: html.cart_subtotal
            }];
            var section = cart.el.querySelector('[data-cart-section]');
            if (section) {
              section.setAttribute('data-calc',data.cart_shipping);
              if (data.cart_shipping == 'false') {
                var calculator = cart.el.querySelector('#shipping-calculator');
                if (calculator) {
                  calculator.remove();                  
                }
              }
            }            
            cartElements.forEach(function (_ref2) {
              var containers = _ref2.containers[0],
                  html = _ref2.html;
              if (!containers) {
                return;
              }
              containers.innerHTML = html;
              var cartItemEls = containers.querySelectorAll('[data-cart-item]');
              cartItemEls.forEach(function (cartItemEl) {
                if (section.dataset.quantity == 'false') {
                  cartItemEl.querySelector('[data-quantity]').classList.add('hidden')
                }                
                return cart.cartItems.push(new CartItem(cartItemEl, _this2.update.bind(_this2)));
              });
            });
            sm.forEach(function (s) {
              var smv = s.querySelector('.sm-container-value');
              s.innerHTML = html.ship_msg;
              var ns = s,
                  nsv = ns.querySelector('.sm-container-value');
              nsv.style.setProperty('width', smv.getAttribute('data-width') + '%');
              setTimeout(function() {
                nsv.style.setProperty('width', nsv.getAttribute('data-width') + '%');
              }, 1);
            });
            document.dispatchEvent(new CustomEvent('cartItems', {
              bubbles: true
            }));
            return data;
          });
        }
      });
    }
  }, {
    key: "terms",
    value: function terms(el,c) {
      var nC = el.querySelector('[name="checkout"]'),
          aCB = el.querySelector('.additional-checkout-buttons');      
      c.onclick = function(ev){
        if (this.checked == true) {
          if (aCB) {
            aCB.classList.remove('hidden');
          }
          nC.classList.remove('btn-secondary');
          nC.removeAttribute('disabled');
          nC.value = nC.getAttribute('[data-checkout]');
          nC.querySelector('span').textContent = nC.getAttribute('data-checkout');          
        } else {
          if (aCB) {
            aCB.classList.add('hidden');
          }          
          nC.classList.add('btn-secondary');
          nC.setAttribute('disabled', true);
          nC.value = nC.getAttribute('data-terms');
          nC.querySelector('span').textContent = nC.getAttribute('data-terms');          
        }
      };      
    }
  }, {
    key: "unload",
    value: function unload() {
      this.carts.forEach(function (cart) {
        cart.cartItems.forEach(function (cartItem) {
          return cartItem.unload();
        });
      });
      this.carts = [];
    }
  }]);
  return MonoCart;
}();
var Cart = (new MonoCart());
function Quantity_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Quantity_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Quantity_createClass(Constructor, protoProps, staticProps) { if (protoProps) Quantity_defineProperties(Constructor.prototype, protoProps); if (staticProps) Quantity_defineProperties(Constructor, staticProps); return Constructor; }
var Quantity = function () {
  function Quantity(el) {
    var _this = this;    
    Quantity_classCallCheck(this, Quantity);
    this.$el = el;    
    if (!this.$el) return;    
    this.$type = this.$el.getAttribute('data-type');
    this.$input = this.$el.querySelector('[data-quantity-input]');
    this.$step = parseInt(this.$input.getAttribute('data-quantity-step'));
    this.$decrement = this.$el.querySelector('[data-quantity-decrement]');
    this.$increment = this.$el.querySelector('[data-quantity-increment]');    
    this.events = [
      this.$input.onchange = function(event){
        return _this.change(_this.value);
      },
      this.$decrement.onclick = function(event){
        return _this.change(_this.value - _this.$step);
      },
      this.$increment.onclick = function(event){
        return _this.change(_this.value + _this.$step);
      }
    ];
  }
  Quantity_createClass(Quantity, [{
    key: "input",
    get: function get() {
      return this.$input;
    }
  }, {
    key: "value",
    get: function get() {
      return parseInt(this.$input.value, 10) || 0;
    }
  }, {
    key: "range",
    get: function get() {
      var min = parseInt(this.$input.getAttribute('min'), 10) || 0,
          max = parseInt(this.$input.getAttribute('max'), 10) || Infinity;
      return {
        min: min,
        max: max
      };
    }
  }, {
    key: "change",
    value: function change(value) {
      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true,
          range = this.range,
          currentValue = this.value;
      if (value > range.max) {
        value = range.max;
      }      
      if (value < range.min) {
        value = range.min;
      }      
      if (value !== currentValue) {
        this.$input.value = value;
      }      
      if (trigger && value !== currentValue) {
        var event = document.createEvent('Event');
        event.initEvent('change', true, true);
        this.input.dispatchEvent(event);
      }
      this._updateButtonState();      
    }
  }, {
    key: "_updateButtonState",
    value: function _updateButtonState() {
      var range = this.range,
          value = this.value;
      if (value == 0) {
        this.$decrement.disabled = true;
      } else {
        this.$decrement.disabled = false;
      }
      if (value == 0 || value >= range.max) {
        this.$increment.disabled = true;
      } else {
        this.$increment.disabled = false;
      }
    }
  }]);
  return Quantity;
}();
function ScrollLock_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ScrollLock_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function ScrollLock_createClass(Constructor, protoProps, staticProps) { if (protoProps) ScrollLock_defineProperties(Constructor.prototype, protoProps); if (staticProps) ScrollLock_defineProperties(Constructor, staticProps); return Constructor; }
var _document = document,
    body = _document.body,
    html = document.querySelector('html'),
    body_slide = document.querySelector('.body-slide');
function _blockScroll(event) {
  if (event.target.closest('.allow-scroll-while-locked')) return;
  event.preventDefault();
  event.stopPropagation();
}
var ScrollLock = function () { 
  function ScrollLock() {
    ScrollLock_classCallCheck(this, ScrollLock);
  }
  ScrollLock_createClass(ScrollLock, null, [{
    key: "lock",
    value: function lock(modal, link) {
      if (modal) {
        modal.classList.add('allow-scroll-while-locked');        
        if (link == 'menu') {
          modal.classList.add('mobile');
        }
        if (link == 'account') {
          modal.classList.add('account');
        }
        if (link == 'cart') {
          modal.classList.add('cart');
          modal.querySelector('.header-minicart-drawer').classList.remove('hidden');
        }
      }      
      if (link == 'menu') {
        html.classList.add('scroll-lock-mobile');
      } else {
        html.classList.add('scroll-lock');
      }      
      body.addEventListener('scroll', _blockScroll, false);
      body.addEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
  }, {
    key: "unlock",
    value: function unlock() {
      window.setTimeout(function() { 
        document.querySelectorAll('.allow-scroll-while-locked').forEach(function (modal) {
          modal.classList.remove('allow-scroll-while-locked','mobile','account','cart');          
        });
      }, 250);
      html.classList.remove('scroll-lock','scroll-lock-mobile');
      body.removeEventListener('scroll', _blockScroll, false);
      body.removeEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
  }]);
  return ScrollLock;
}();
function index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || index_es_unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
var deferred = {};
var AsyncView = function () {
  function AsyncView() {
    index_es_classCallCheck(this, AsyncView);
  }
  index_es_createClass(AsyncView, null, [{
    key: "load",
    value: function load(url) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!('view' in query)) {
        return Promise.reject(new Error('\'view\' not found in \'query\' parameter'));
      }
      var querylessUrl = url.replace(/\?[^#]+/, '');
      var queryParamsString = new RegExp(/.+\?([^#]+)/).exec(url);
      var queryParams = query;
      if (queryParamsString && queryParamsString.length >= 2) {
        queryParamsString[1].split('&').forEach(function (param) {
          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              key = _param$split2[0],
              value = _param$split2[1];
          queryParams[key] = value;
        });
      } 
      var cachebustingParams = _objectSpread2({}, queryParams, {
        _: new Date().getTime()
      });
      var hashUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(queryParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(queryParams[key]));
        }).join('&')).concat(hash);
      });
      var requestUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(cachebustingParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(cachebustingParams[key]));
        }).join('&')).concat(hash);
      });
      var promise = new Promise(function (resolve, reject) {
        var data;
        if (hashUrl in deferred) {
          resolve(deferred[hashUrl]);
          return;
        }
        deferred[hashUrl] = promise;
        if (options.hash) {
          data = sessionStorage.getItem(hashUrl);
          if (data) {
            var deserialized = JSON.parse(data);
            if (options.hash === deserialized.options.hash) {
              delete deferred[hashUrl];
              resolve(deserialized);
              return;
            }
          }
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl, true);
        xhr.onload = function () {
          var el = xhr.response;
          var newOptions = {};
          var optionsEl = el.querySelector('[data-options]');
          if (optionsEl && optionsEl.innerHTML) {
            newOptions = {
              'cart_shipping': el.querySelector('[data-options]').getAttribute('data-cart-shipping'),
              'item_count': el.querySelector('[data-options]').getAttribute('data-item-count'),
              'total_price': el.querySelector('[data-options]').getAttribute('data-total-price')
            };
          }
          var htmlEls = el.querySelectorAll('[data-html]');
          var newHtml = {};
          if (htmlEls.length === 1 && htmlEls[0].getAttribute('data-html') === '') {
            newHtml = htmlEls[0].innerHTML;
          } else {
            for (var i = 0; i < htmlEls.length; i++) {
              newHtml[htmlEls[i].getAttribute('data-html')] = htmlEls[i].innerHTML;
            }
          }
          var dataEls = el.querySelectorAll('[data-options]');
          var newData = {};
          if (dataEls.length === 1 && dataEls[0].getAttribute('data-options') === '') {
            newData = {
              'cart_shipping': el.querySelector('[data-options]').getAttribute('data-cart-shipping'),
              'item_count': el.querySelector('[data-options]').getAttribute('data-item-count'),
              'total_price': el.querySelector('[data-options]').getAttribute('data-total-price')
            };
          } else {
            for (var _i = 0; _i < dataEls.length; _i++) {
              newData[dataEls[_i].getAttribute('data-options')] = JSON.parse(dataEls[_i].innerHTML);
            }
          }
          if (options.hash) {
            try {
              sessionStorage.setItem(hashUrl, JSON.stringify({
                options: newOptions,
                data: newData,
                html: newHtml
              }));
            } catch (error) {
              console.error(error);
            }
          }
          delete deferred[hashUrl];
          resolve({
            data: newData,
            html: newHtml
          });
        };
        xhr.onerror = function () {
          delete deferred[hashUrl];
          reject();
        };
        xhr.responseType = 'document';
        xhr.send();
      });
      return promise;
    }
  }]);
  return AsyncView;
}();
var shopify_asyncview_dist_index_es = (AsyncView);
var DOCUMENT_FRAGMENT_NODE = 11;
function Sections_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Sections_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Sections_createClass(Constructor, protoProps, staticProps) { if (protoProps) Sections_defineProperties(Constructor.prototype, protoProps); if (staticProps) Sections_defineProperties(Constructor, staticProps); return Constructor; }
var Sections = function () {
  function Sections() {
    Sections_classCallCheck(this, Sections);
    this.handlers = {};
    this.instances = {};
    this._onSectionEvent = this._onSectionEvent.bind(this);
    document.addEventListener('shopify:section:load', this._onSectionEvent);
    document.addEventListener('shopify:section:unload', this._onSectionEvent);
    document.addEventListener('shopify:section:select', this._onSectionEvent);
    document.addEventListener('shopify:section:deselect', this._onSectionEvent);
    document.addEventListener('shopify:block:select', this._onSectionEvent);
    document.addEventListener('shopify:block:deselect', this._onSectionEvent);
  }
  Sections_createClass(Sections, [{
    key: "register",
    value: function register(type, handler) {
      if (this.handlers[type]) {
        console.warn("Sections: section handler already exists of type '".concat(type, "'."));
      }
      this.handlers[type] = handler;
      this._initSections(type);
    }
  }, {
    key: "_initSections",
    value: function _initSections(type) {
      var dataEls = document.querySelectorAll("[data-section-type=\"".concat(type, "\"]"));
      if (!dataEls) return;
      for (var i = 0; i < dataEls.length; i++) {
        var dataEl = dataEls[i],
            el = dataEl.parentNode,
            idEl = el.querySelector('[data-section-id]');        
        if (!idEl) {
          console.warn("Sections: unable to find section id for '".concat(type, "'."), el);
          continue;
        }
        var sectionId = idEl.getAttribute('data-section-id'),
            sectionType = dataEl.dataset.sectionType;
        if (!sectionId) {
          console.warn("Sections: unable to find section id for '".concat(type, "'."), el);
          continue;
        }
        this._createInstance(sectionId, sectionType, el);
      }
      
    }
  }, {
    key: "_onSectionEvent",
    value: function _onSectionEvent(event) {
      var el = event.target,
          sectionId = event.detail.sectionId,
          sectionType = event.detail.sectionType,
          blockId = event.detail.blockId,
          instance = this.instances[sectionId];
      switch (event.type) {
        case 'shopify:section:load':
          this._createInstance(sectionId, sectionType, el);
          sectionObserver();
          break;
        case 'shopify:section:unload':
          this._triggerInstanceEvent(instance, 'onSectionUnload', {
            el: el,
            id: sectionId
          });
          delete this.instances[sectionId];
          break;
        case 'shopify:section:select':
          this._triggerInstanceEvent(instance, 'onSectionSelect', {
            el: el,
            id: sectionId
          });
          break;
        case 'shopify:section:deselect':
          this._triggerInstanceEvent(instance, 'onSectionDeselect', {
            el: el,
            id: sectionId
          });
          break;
        case 'shopify:block:select':
          this._triggerInstanceEvent(instance, 'onSectionBlockSelect', {
            el: el,
            id: blockId,
            sid: sectionId
          });          
          break;
        case 'shopify:block:deselect':
          this._triggerInstanceEvent(instance, 'onSectionBlockDeselect', {
            el: el,
            id: sectionId,
            sid: sectionId
          });
          break;
      }
    }
  }, {
    key: "_triggerInstanceEvent",
    value: function _triggerInstanceEvent(instance, eventName) {      
      if (instance && instance[eventName]) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        instance[eventName].apply(instance, args);
      }
    }
  }, {
    key: "_postMessage",
    value: function _postMessage(name, data) {
      for (var id in this.instances) {
        this._triggerInstanceEvent(this.instances[id], 'onSectionMessage', name, data);
      }
    }
  }, {
    key: "_createInstance",
    value: function _createInstance(id, type, el) {
      if (!type) {
        var typeEl = el.querySelector('[data-section-type]');      
        if (!typeEl) return console.warn("Sections: unable to find section type for id '".concat(id, "'."));        
        var type = typeEl.getAttribute('data-section-type');
      }
      if (!type) return console.warn("Sections: unable to find section type for id '".concat(id, "'."));
      var handler = this.handlers[type];
      if (!handler) return console.warn("Sections: unable to find section handler for type '".concat(type, "'."));
      var data = this._loadData(el);
      var postMessage = this._postMessage.bind(this);
      this.instances[id] = handler({
        id: id,
        type: type,
        el: el,
        data: data,
        postMessage: postMessage
      });
    }
  }, {
    key: "_loadData",
    value: function _loadData(el) {
      var dataEl = el.querySelector('[data-section-data]');
      if (!dataEl) return {};
      var data = dataEl.getAttribute('data-section-data') || dataEl.innerHTML;
      try {
        return JSON.parse(data);
      } catch (error) {
        console.warn("Sections: invalid section data found. ".concat(error.message));
        return {};
      }
    }
  }]);
  return Sections;
}();
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
function forceFocus(element, options) {
  options = options || {};
  var savedTabIndex = element.tabIndex;
  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);
  function callback(event) {
    event.target.removeEventListener(event.type, callback);
    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}
function focusable(container) {
  var elements = Array.prototype.slice.call(
    container.querySelectorAll(
      '[tabindex]:not([tabindex^='-']),' +
      '[draggable],' +
      'summary,'  +
      'a[href],' +
      'area,' +
      'button:enabled,' +
      'input:not([type=hidden]):enabled,' +
      'object,' +
      'select:enabled,' +
      'textarea:enabled,' +
      'object,' + 
      'iframe'
    )
  );
  return elements.filter(function(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  });
}
const trapFocusHandlers = {};
function trapFocus(container, options) {
  removeTrapFocus();
  options = options || {};
  var elements = focusable(container),
      elementToFocus = options.elementToFocus || container,
      first = elements[0],
      last = elements[elements.length - 1];
  trapFocusHandlers.focusin = function(event) {
    if (container !== event.target && !container.contains(event.target) || event.target.classList.contains('navmenu-item-parent')) {
      first.focus();
    }
    if (event.target !== container && event.target !== last && event.target !== first) return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };
  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);
  forceFocus(elementToFocus, options);
}
function removeTrapFocus() {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);
}
var mP = document.getElementById('shopify-pc__banner__btn-manage-prefs');
if (mP) {
  mP.onclick = function(){ 
    trapFocus(document.getElementById('shopify-pc__prefs__dialog'));
  }  
}
const mutationCallback = (mutationsList, observer) => {
  const targetEl = document.querySelectorAll('form-embed:not(.ignore)');
  const j = document.getElementById('FormJson');    
  targetEl.forEach(function(t) {
    t.classList.add('ignore');
    const addStyles = document.createElement('style');
    addStyles.textContent = j.textContent;    
    const shadow = t.shadowRoot || t.attachShadow({mode: 'open'});    
    shadow.append(addStyles);
  });  
};
const observer = new MutationObserver(mutationCallback);
observer.observe(document.body, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
function tableWrap() {
  var el = document.querySelectorAll('table:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-container scroll-bar-h';
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
    wrapper.parentNode.classList.add('table-scroll');
  }); 
};                                                                       
function Wrap() {
  var el = document.querySelectorAll('#content iframe[src*="youtube.com"]:not(.no-container),#content iframe[src*="vimeo.com"]:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'youtube-container';
    e.classList.add('no-container');
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
  });
  tableWrap();
};
function ContentSlide(section, force) {
  var _this = this,
      productCollapse = section.querySelectorAll('[data-content-slide]');  
  productCollapse.forEach(function(p) {
    var _this = p,
        a = p.querySelector('[content-slide-btn]')
        r = p.querySelector('.content-slide-content'),
        p.$el = r;
    if (a && r) {
      a.onclick = function(){
        var cS = this.closest('[data-content-slide]');
        productCollapse.forEach(function(p) {
          if (p != cS) {
            p.querySelector('[content-slide-btn]').classList.remove('active');
            Revealer('hide', force, p);
          }
        });
        a.classList.toggle('active');
        if (section.hasAttribute('data-add-active')) {
          section.closest('.shopify-section').classList.toggle('active');
        }
        Revealer('toggle', force, _this);
      }
    }
  });
};
function Quick_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Quick_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Quick_createClass(Constructor, protoProps, staticProps) { if (protoProps) Quick_defineProperties(Constructor.prototype, protoProps); if (staticProps) Quick_defineProperties(Constructor, staticProps); return Constructor; }
var Quick = function () {
  function Quick() {
    var _this = this;
    Quick_classCallCheck(this, Quick);
    this.qs = document.querySelectorAll('[data-product-item-quick]');
    this.background_body = document.querySelectorAll('[data-body-slide-background]');     
    this.qs.forEach(function (q) {
      var b = q.querySelector('[data-quick]');
      if (theme.isMobile) {
        b.ontouchstart = function(e){
          e.preventDefault();          
          if (q.getAttribute('data-loaded') === 'true') {
            _this.open(b);
          } else {
            _this.load(b,q, _this);
          }
        };
      } else {
        b.onfocus = (event) => {
          return _this.load(b,q, _this);
        };
        q.onmouseenter = function(){
          return _this.load(b,q, _this);
        };
        b.onclick = function(){
          return _this.open(b);
        };
      }
    });
    this.quick_trigger = null;
    this.events = new Events();
    function _qsForEach() {
      _this.qs.forEach(function (q) {
        if (q.classList.contains('open')) {
          var a = q,
              q = a.querySelector('.product-item-quick');
          return _this.close(a, q);
        }        
      });
      if(_this.quick_trigger) {
        _this.quick_trigger.focus();
      }
    };
    for (let i = 0; i < this.background_body.length; i++) {
      this.events.register(this.background_body[i], 'click', function () {
        _qsForEach();
      });
    };
  }
  Quick_createClass(Quick, [{
    key: "load",
    value: function load(b,q,t) {
      if (q.getAttribute('data-loaded') === 'true') {
        return;
      }
      var a = b.closest('article'),
          q = a.querySelector('.product-item-quick'),
          id = b.getAttribute('data-quick-id'),
          url = b.getAttribute('data-quick-url');
      a.setAttribute('data-loaded', true);      
      fetch(url + '?view=quick')
      .then(response => response.text())
      .then(text => {
        if (a.hasAttribute('data-product-quick-drawer')) {
          q.textContent = text;          
        } else {
          q.innerHTML = JSON.parse(text);
          sectionObserver();
          if (Shopify.PaymentButton) {
            Shopify.PaymentButton.init(); 
          }
          var btn = q.querySelector('[data-quick-close]');
          btn.onclick = function(){
            return t.close(a, q);
          };
        }
        if (theme.isMobile) {
          t.open(b);
        }
      }).catch(function(err) {
        console.error('!: ' + err)
      });
    }
  },{
    key: "open",
    value: function open(b) {
      var a = b.closest('article'),
          q = a.querySelector('.product-item-quick');
      this.quick_trigger = b;
      if (a.hasAttribute('data-product-quick-drawer')) {
        var components_Modal = (new Modal()),
            header = '<h4 id="modal__heading">' + a.getAttribute('data-title') + '</h4>',
            content = '<div class="toppad">' + JSON.parse(q.innerText) + '</div>';
        components_Modal.open({
          header: header,
          content: content
        });
        sectionObserver();
        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init(); 
        }        
      } else {
        a.classList.add('open');
        if (a.closest('main')) {
          html.classList.add('body-section-open', 'quick-slide-open');
          a.closest('.shopify-section').classList.add('section-open');
          a.classList.add('product-open');
        }        
        q.hidden = false;
        q.setAttribute('aria-hidden','false');
        trapFocus(q);        
      }
    }
  }, {
    key: "close",
    value: function close(a, q) {
      a.classList.remove('open');
      if (a.closest('main')) {
        a.classList.remove('product-open');
        if (!a.hasAttribute('data-shop-look')) {
          html.classList.remove('body-section-open', 'quick-slide-open');
          a.closest('.shopify-section').classList.remove('section-open');
        };
      }
      removeTrapFocus(q);
      setTimeout(function() {
        q.setAttribute('aria-hidden','true');
        q.hidden = true;
      }, 250);      
    }
  }]);
  return Quick;
}();
function Swatches(options, load) {
  options.forEach(function (o) {
    if (load === 'loop') {
      function x(o) {
        var a = o.closest('article'),
            f = a.querySelector('figure'),
            sI = f.querySelector('.swatch-image'),
              oS = a.querySelector('.option-selected'),
            id = o.getAttribute('id'),
            aID = a.querySelector('.' + id);        
        f.classList.remove('hover');
        if (sI) {
          sI.classList.remove('swatch-image');
        };
        if (oS) {
          oS.classList.remove('option-selected');
        }
        if (aID) {
          f.classList.add('hover');
          aID.classList.add('swatch-image');
        }
        o.parentNode.classList.add('option-selected');
        o.checked = true;
      };
      o.onfocus = function() {
        x(o);
      };
      o.onmouseenter = function() {
        x(o);
      };
      o.ontouchstart = function() {
        x(o);
      };    
    }
    if (load === 'switch') {
      o.checked = false;
      o.parentNode.classList.remove('option-selected');      
      o.parentNode.classList.add('option-soldout', 'option-disabled', 'hidden');
    };    
  });  
};
function ModalEscCloser_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ModalEscCloser_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function ModalEscCloser_createClass(Constructor, protoProps, staticProps) { if (protoProps) ModalEscCloser_defineProperties(Constructor.prototype, protoProps); if (staticProps) ModalEscCloser_defineProperties(Constructor, staticProps); return Constructor; }
var ModalEscCloser = function () {
  function ModalEscCloser() {
    var _this = this;
    ModalEscCloser_classCallCheck(this, ModalEscCloser);
    this.stack = [];
    this.closeEsc = function (e) {
      if (e.key === 'Escape' && _this.stack.length) {
        _this.stack.pop().close();
      }
    };
    window.addEventListener('keydown', this.closeEsc);
  }
  ModalEscCloser_createClass(ModalEscCloser, [{
    key: "add",
    value: function add(modal) {
      this.stack.push(modal);
    }
  }, {
    key: "remove",
    value: function remove(modal) {
      this.stack = this.stack.filter(function (m) {
        return m !== modal;
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      window.removeEventListener('keydown', this.closeEsc);
    }
  }]);
  return ModalEscCloser;
}();
var utils_ModalEscCloser = (new ModalEscCloser());
function Modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) Modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) Modal_defineProperties(Constructor, staticProps); return Constructor; }
var Modal = function () {
  function Modal(m) {
    var _this = this;
    window.hasModal = true;
    Modal_classCallCheck(this, Modal);
    this.container = document.querySelector('[data-modal-container]');
    this.background = document.querySelector('[data-modal-background]');
    this.drawer = this.container.querySelector('[data-modal]');
    this.header = this.container.querySelector('[data-modal-header]');
    this.closeButton = this.container.querySelector('[data-modal-close]');
    this.content = this.container.querySelector('[data-modal-content]');
    this.menu = m;
    this.trigger = null;
    this.events = new Events();
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.background, 'click', function (e) {
      if (e.target !== _this.background) return;
      _this.close();
    });
  }
  Modal_createClass(Modal, [{
    key: "open",
    value: function open(_ref) {
      var _this2 = this,
          header = _ref.header,
          content = _ref.content;
      ScrollLock.lock(this.drawer, _this2.menu);
      theme.modal = true;      
      this.trigger = document.activeElement;
      this.pos = window.pageYOffset;
      utils_ModalEscCloser.add(this);      
      this.header.innerHTML = header;
      this.content.innerHTML = content;
      var height = "calc(100dvh - ".concat(this.header.offsetHeight, "px)");
      this.content.style.setProperty('max-height', height);      
      if (_this2.menu == 'menu') {
        _this2._calculateMaxDrawerHeight();
      }
      trapFocus(_this2.container);      
      if (_this2.menu == 'search') {      
        _this2.content.querySelector('input').focus();
      }
      if (_this2.menu == 'account') {
        document.getElementById('customer').style.setProperty('max-height', height);
        if (this.drawer.querySelector('.first-email')) {
          this.drawer.querySelector('.first-email').focus();
        };
      }
      if (_this2.menu == 'cart') {
        document.querySelector('.header-minicart.modal__content').style.setProperty('max-height', height);
      }
      tableWrap();
      this.container.setAttribute('data-modal-animation-state', 'open');
      return _this2.container;
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;
      theme.modal = false;
      utils_ModalEscCloser.remove(this);
      setTimeout(function() {
        _this3.container.setAttribute('data-modal-animation-state', 'closed');
        if (_this3.trigger) {
          _this3.trigger.focus();
        }
        if (_this3.pos) {
          window.scrollTo( 0, _this3.pos - 1);
          _this3.pos = null;
        }
      }, 250);
      removeTrapFocus(_this3.container);
      ScrollLock.unlock();
    }
  }, {
    key: "_calculateMaxDrawerHeight",
    value: function _calculateMaxDrawerHeight() {      
      var mN = document.getElementById('site-mobilenav'),        
          cB = mN.querySelector('.mobilenav-contactbar'),
          cBH = 0,
          pS = mN.querySelector('predictive-search'),
          pSH = 0,
          h = this.header.offsetHeight;
      if (cB) {
        cBH = cB.offsetHeight
      };
      if (pS) {
        pSH = pS.offsetHeight
      };
      theme.modalHeight = Math.max(cBH + pSH + h, 0);
      document.getElementById('site-mobilenav').style.height = 'calc(100dvh - ' + Math.max(h, 0) + 'px)';
      document.getElementById('site-mobilenav').querySelector('.mobilenav-navigation').style.maxHeight = 'calc(100dvh - ' + Math.max(h, 0) + 'px)';
    }
  }]);
  return Modal;
}();
Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};
Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};
Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
  ? target.addEventListener(eventName, callback, false)
  : target.attachEvent('on' + eventName, callback);
};
Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};
  var form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);
  for (var key in params) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
Shopify.CountryProvinceSelector = function (country_domid, province_domid, options) {  
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);  
  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));  
  this.initCountry();
  this.initProvince();  
};
Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },
  initProvince: function () {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },
  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);
    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }
      this.provinceContainer.style.display = '';
    }
  },
  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },
  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};
var sections = new Sections();
sections.register('check', function (section) {
  return new Check(section);
});  
sections.register('header', function (section) {
  return new Header(section);
});
sections.register('collection', function (section) {
  return new Collection(section);
});
sections.register('cart', function (section) {
  return new CartCart(section);
});
sections.register('search', function (section) {
  return new Collection(section);
});
document.addEventListener('DOMContentLoaded', function() {
  if (window.theme.quick) {
    new Quick();
  }
  if (window.theme.swatches) {
    var $options = document.querySelectorAll('.product-item [data-product-option]');
    Swatches($options, 'loop')
  }
  Wrap();
  this.$sticky = document.querySelectorAll('.content-details-sticky');
  if (this.$sticky && theme.sht > 0) {
    this.$sticky.forEach(function(s) {
      s.style.top = theme.sht + 20 + 'px';
    });
  }
});