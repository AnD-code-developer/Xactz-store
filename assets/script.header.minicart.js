HeaderMiniCart = (function() {
  function HeaderMiniCart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function HeaderMiniCart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function HeaderMiniCart_createClass(Constructor, protoProps, staticProps) { if (protoProps) HeaderMiniCart_defineProperties(Constructor.prototype, protoProps); if (staticProps) HeaderMiniCart_defineProperties(Constructor, staticProps); return Constructor; }
  function HeaderMiniCart(section) {
    var _this = this;
    HeaderMiniCart_classCallCheck(this, HeaderMiniCart);    
    this.section = section;
    this.$el = section.el;
    this.el = section.el;
    window.setTimeout(function() {
      _this.$el.querySelector('.header-minicart-drawer').classList.add('hidden');    
    }, 250);
    this.$cartButton = document.querySelectorAll('[data-site-actions-cart]');
    if (!this.$cartButton) {
      return;
    }    
    this.$cartSection = document.querySelector('.site-main.header-minicart');
    this.$cartFull = this.$cartSection.querySelector('.cart-mini-full');
    this.$cartItems = this.$cartSection.querySelector('.header-minicart-content');
    this.$cartFooter = this.$cartSection.querySelector('.header-minicart-footer');
    this.$cartBlocks = this.$cartSection.querySelector('.header-minicart-footer-blocks');
    if (this.$cartBlocks) {
      this.$cartOpen = this.$cartBlocks.querySelector('.blocks-button');
    }    
    this.$cartButtons = this.$cartSection.querySelector('.header-minicart-footer-buttons');
    this.$cart = document.getElementById('header-minicart-drawer');
    this.cartTitle = _this.$cart.getAttribute('data-title');
    this.events = [
      this.$cart.ontouchmove = function(event){
        event.stopPropagation();
      },
      window.addEventListener('resize', (function () {
        return _this._setMaxDrawerHeight();
      })),
      this.$cartButton.forEach(function (c) {
        c.onclick = function(event){
          theme.header_cart = c;
          event.preventDefault();
          event.stopPropagation();
          _this._toggleDrawer('button');
        }
      })
    ];
    document.querySelector('.modal-container .modal').appendChild(this.$cartSection);
    Layout.onBreakpointChange(function () {
      return _this._toggleDrawer('closed');
    });
    if (Shopify.designMode) {
      this.el.addEventListener('shopify:section:select', (event) => {
        this._toggleDrawer('button');
      });
      this.el.addEventListener('shopify:block:select', (event) => {
        return this._setMaxDrawerHeight('block');
      });
      this.el.addEventListener('shopify:section:deselect', (event) => {
          this._toggleDrawer('closed');          
          var components_Modal = (new Modal('cart'));
          components_Modal.close();
      });
    }
  };
  HeaderMiniCart_createClass(HeaderMiniCart, [{
      key: "_setMaxDrawerHeight",
      value: function _setMaxDrawerHeight(x) {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!this.open && !force) {
          return;
        }
        if (this.$cartFooter) {
          var f = this.$cartFooter.offsetHeight;
        } else {
          var f = 0;
        }
        var _this = this,
            h = document.querySelector('.modal__header-container').offsetHeight,
            itemOffset = Math.max(h + f, 0);
        this.$cartItems.style.maxHeight = 'calc(100dvh - ' + itemOffset + 'px';
        this.$cartFull.style.setProperty('--max-height', 'calc(100dvh - ' + h + 'px)');
        if (this.$cartOpen) {
          var c = this.$cartOpen.offsetHeight;
          this.active = false;          
          function openOptions(e) {
            if (this.active == true) {
              _this.$cartOpen.classList.remove('active');              
              window.setTimeout(function() {              
                _this.$cartBlocks.querySelector('.blocks-button-content').style.height = '0px'              
              }, 250);              
              _this.$cartBlocks.querySelector('.blocks-button-content').style.maxHeight = '0px'
              _this.$cartBlocks.querySelector('.blocks-button-content').classList.remove('visible,scroll-bar');
              this.active = false;
            } else {
              _this.$cartOpen.classList.add('active');              
              _this.$cartBlocks.querySelector('.blocks-button-content').style.height = 'calc(100dvh - ' + (itemOffset + c) + 'px';
              _this.$cartBlocks.querySelector('.blocks-button-content').style.maxHeight = 'calc(100dvh - ' + (itemOffset + c) + 'px';
              _this.$cartBlocks.querySelector('.blocks-button-content').classList.add('visible');
              window.setTimeout(function() {  
                _this.$cartBlocks.querySelector('.blocks-button-content').classList.add('scroll-bar');            
              }, 350);
              this.active = true;
            }
          }
          if (x == 'block') {
            openOptions();
          }
          this.$cartOpen.onclick = function(event){
            openOptions();
          }
        }
      }
    }, {
      key: "_refreshCart",
      value: function _refreshCart() {
        var _this3 = this;
        this.$cart.classList.add('loading');
        Cart.update().then(function () {
          _this3._onMiniCartUpdate();
          _this3.section.postMessage('header-minicart:set-open');
        });
      }
    }, {
      key: "_openDrawer",
      value: function _openDrawer() {
        var _this4 = this,
            components_Modal = (new Modal('cart')),
            header = '<h4 id="modal__heading">' + _this4.$cart.getAttribute('data-text') + '</h4>',
            content = '';        
        components_Modal.open({
          header: header,
          content: content
        });
        if (theme.minicart) {
          return
        }
        this._setMaxDrawerHeight(true);        
      }
    }, {
      key: "_toggleDrawer",
      value: function _toggleDrawer(requestedState) {
        var _this5 = this;
        this.open = false;
        if (requestedState === 'open' && this.open) {
          this._refreshCart();
        }
        if (requestedState === 'closed' && !this.open) {
          return;
        }
        if (this.open) {
          this.open = false;
          theme.minicart = false;
        } else {
          this._openDrawer();
          this.open = true;
          theme.minicart = true;
        }
      }
    }, {
      key: "_onMiniCartUpdate",
      value: function _onMiniCartUpdate() {
        this.$cart.classList.remove('loading');
      }
    }, {
      key: "_updateMiniCartTotals",
      value: function _updateMiniCartTotals(cartData) {
        var _this = this;
        this.$cart.setAttribute('data-text',"".concat(this.cartTitle, " (").concat(cartData.item_count, ")"));        
        document.querySelector('[data-modal-header]').innerHTML = "<h4 id='modal__heading'>".concat(this.cartTitle, " (").concat(cartData.item_count, ")</h4>");        
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        var _this = this;
        if (name === 'cart:update') {
          this._updateMiniCartTotals(data);
        }        
        if (name === 'header-minicart:refresh') {
          this._refreshCart();
        }
        if (name === 'header-minicart:toggle') {
          this._toggleDrawer(data);
        }
        if (name === 'header-minicart:set-open') {
          var cartDrawer = document.querySelector('[data-header-minicart]');
          if (cartDrawer) {
            var cartFull = cartDrawer.querySelector('.cart-mini-full'),
                cartEmpty = cartDrawer.querySelector('.cart-mini-empty');            
            cartFull.classList.add('visible');
            cartEmpty.setAttribute('data-revealer-visible', true);
            cartEmpty.classList.remove('visible');
            cartEmpty.removeAttribute('data-revealer-visible');
          };          
          if (theme.modal) {
            var components_Modal = (new Modal('cart'));
            components_Modal.close();
            window.setTimeout(function() {
              _this._toggleDrawer('open');
            }, 250);            
          } else {
            this._toggleDrawer('open');
          }
        }
      }
    }]);
  return HeaderMiniCart;
})();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'header_minicart' && !sectionContainer.classList.contains('ignore')){
    sections.register('header_minicart', function (section) {
      return new HeaderMiniCart(section);
    });
    sectionContainer.classList.add('ignore');
  }
})