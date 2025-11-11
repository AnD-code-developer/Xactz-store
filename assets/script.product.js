Product = (function() {
  function ProductOptions_toConsumableArray(arr) { return ProductOptions_arrayWithoutHoles(arr) || ProductOptions_iterableToArray(arr) || ProductOptions_unsupportedIterableToArray(arr) || ProductOptions_nonIterableSpread(); }
  function ProductOptions_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function ProductOptions_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProductOptions_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProductOptions_arrayLikeToArray(o, minLen); }
  function ProductOptions_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }
  function ProductOptions_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return ProductOptions_arrayLikeToArray(arr); }
  function ProductOptions_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function ProductOptions_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductOptions_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductOptions_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductOptions_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductOptions_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductOptions = function () {
    function ProductOptions(product) {
      ProductOptions_classCallCheck(this, ProductOptions);
      this.productHandle = product.handle;
      this.optionsCount = product.options.length;
      this.variants = product.variants;
    }
    ProductOptions_createClass(ProductOptions, [{
      key: "getVariantFromOptions",
      value: function getVariantFromOptions(options) {
        var variant = null;
        this.variants.forEach(function (potentialVariant) {
          var found = true;
          for (var i = 0; i < potentialVariant.options.length; i++) {
            if (options[i] !== potentialVariant.options[i]) {
              found = false;
            }
          }
          if (found) {
            variant = potentialVariant;
          }
        });
        return variant || false;
      }
    }, {
      key: "getClosestVariantFromOptions",
      value: function getClosestVariantFromOptions(options) {
        var closestVariant = null;
        var matchingValues = 0;
        this.variants.forEach(function (variant) {
          var tempMatchingValues = 0;
          for (var i = 0; i < variant.options.length; i++) {
            if (options[i] === variant.options[i]) {
              tempMatchingValues++;
            } else {
              break;
            }
          }
          if (tempMatchingValues >= matchingValues) {
            closestVariant = variant;
            matchingValues = tempMatchingValues;
          }
        });
        return closestVariant ? closestVariant : false;
      }
    }, {
      key: "getVariantOrClosestFromOptions",
      value: function getVariantOrClosestFromOptions(options) {
        return this.getVariantFromOptions(options) || this.getClosestVariantFromOptions(options);
      }
    }]);
    return ProductOptions;
  }();
  function VariantHelper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function VariantHelper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function VariantHelper_createClass(Constructor, protoProps, staticProps) { if (protoProps) VariantHelper_defineProperties(Constructor.prototype, protoProps); if (staticProps) VariantHelper_defineProperties(Constructor, staticProps); return Constructor; }
  var VariantHelper = function () {
    function VariantHelper(product, $variants, $options, $form) {
      VariantHelper_classCallCheck(this, VariantHelper);
      var _this = this;
      this.product = product;
      this.optionsCount = this.product.options.length;
      this.$variants = $variants;
      this.$options = $options;
      this.$form = $form;
      this.productOptions = new ProductOptions(this.product);
      this.optionsTypes = {
        select: 'select-one',
        radio: 'radio'
      };
      this._bindEvents();
      if (this.$options.length) {
        if (this.$options[0].type === this.optionsTypes.select) {
          this.optionsType = this.optionsTypes.select;
        } else if (this.$options[0].type === this.optionsTypes.radio) {
          this.optionsType = this.optionsTypes.radio;
        } else {
          this._unbindEvents();
        }
      } else {
        this.optionsType = null;
      }      
      this._switchVariant(true);      
      if (this.optionsType === this.optionsTypes.radio) {        
        Swatches(this.$options, 'load');        
      };
    }
    VariantHelper_createClass(VariantHelper, [{
      key: "_bindEvents",
      value: function _bindEvents() {
        var _this = this;
        this.$options.forEach(function (o) {
          o.onchange = function(){
            var f = o;
            return _this._switchVariant(f);
          };
        });
      }
    }, {
      key: "_switchVariant",
      value: function _switchVariant(f, force) {
        var _this = this,
            firstLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false,
            options = [],
            product = this.product,
            variant = null;
        if (this.optionsType === this.optionsTypes.select) {
          this.$options.forEach(function (i, option) {
            options.push(i.value);
          });
        } else if (this.optionsType === this.optionsTypes.radio) {
          this.$options.forEach(function (option) {            
            if (option.checked) {
              options.push(option.value);
            }
          });
        } else {
          return;
        }
        variant = this.productOptions.getVariantOrClosestFromOptions(options);
        if (this.optionsType === this.optionsTypes.select) {
          this._switchVariantSelect(variant);
        } else if (this.optionsType === this.optionsTypes.radio) {
          this._switchVariantRadio(variant, f);
        } else {
          return;
        }
        this.$variants.value = variant.id;
        var isProduct = function isProduct(compareProduct) {
          return compareProduct === product;
        };
        let event = new CustomEvent('product-variant-switch', {
          detail: {
            product: product,
            variant: variant,
            firstLoad: firstLoad,
            isProduct: isProduct
          }
        });
        window.dispatchEvent(event);
      }
    }, {
      key: "_switchVariantSelect",
      value: function _switchVariantSelect(variant) {
        var _this2 = this;
        let availableOptions = this.productOptions.variants;
        var $optionEls = this.$form.querySelectorAll('.product-options[data-product-options] .option option');
        $optionEls.forEach(function (o) {          
          o.disabled = true;          
          o.classList.add('disabled');          
        });
        for (var i = 0; i < this.product.options.length; i++) {
          for (const v of _this2.product.options[i].values) {
            let s = _this2.$form.querySelector('.product-options .option-' + [i+1] + ' option[value="' + v.replace(/["\\]/g, '\\$&') + '"]'),
                label = _this2.$form.querySelector('.option-' + [i+1] + ' label span'),
                opt_1 = variant.options[0],
                opt_2 = variant.options[1],
                opt_3 = variant.options[2];
            if (label) {
              label.textContent = variant.options[i];
            };
            if (v === variant.options[i]) {
              s.disabled = false;
              s.classList.remove('disabled');              
              s.selected = true;
            }
            for (const o of availableOptions) {
              // if (o.options[0] == v) {
              if (o.options[0] && o.options[0] == v && o.options[1] == opt_2 && o.options[2] == opt_3) {
                let sO = _this2.$form.querySelector('.product-options .option-1 option[value="' + o.options[0].replace(/["\\]/g, '\\$&') + '"]');
                sO.disabled = false;
                if (o.available) {
                  sO.classList.remove('disabled');
                };
              }
              if (o.options[1] && v === variant.options[0] && v === o.options[0]) {
                let sO = _this2.$form.querySelector('.product-options .option-2 option[value="' + o.options[1].replace(/["\\]/g, '\\$&') + '"]');
                sO.disabled = false;
                if (o.available) {
                  sO.classList.remove('disabled');
                };
              }
              if (o.options[2] && variant.options[0] === o.options[0] && v === variant.options[1] && v === o.options[1]) {
                let sO = _this2.$form.querySelector('.product-options .option-3 option[value="' + o.options[2].replace(/["\\]/g, '\\$&') + '"]');
                sO.disabled = false;
                if (o.available) {
                  sO.classList.remove('disabled');
                };
              }
            }            
          }
        }
      }
    }, {
      key: "_switchVariantRadio",
      value: function _switchVariantRadio(variant, f) {
        var _this3 = this;
        let availableOptions = this.productOptions.variants;
        Swatches(this.$options, 'switch');
        for (var i = 0; i < this.product.options.length; i++) {
          for (const v of _this3.product.options[i].values) {            
            let s = _this3.$form.querySelector('.product-options .option-' + [i+1] + ' input[value="' + v.replace(/["\\]/g, '\\$&') + '"]'),
                legend = _this3.$form.querySelector('.option-' + [i+1] + ' legend span'),
                opt_1 = variant.options[0],
                opt_2 = variant.options[1],
                opt_3 = variant.options[2];
            if (legend) {
              legend.textContent = variant.options[i];
            };            
            if (v === variant.options[i]) {
              s.checked = true;
              s.parentNode.classList.add('option-selected');
            }
            for (const o of availableOptions) {
              // if (o.options[0] == v) {
              if (o.options[0]  &&  o.options[0] == v && o.options[1] == opt_2  &&  o.options[2] == opt_3) {
                let sO = _this3.$form.querySelector('.product-options .option-1 input[value="' + o.options[0].replace(/["\\]/g, '\\$&') + '"]');                  
                sO.parentNode.classList.remove('hidden');
                if (o.available ) {
                  sO.parentNode.classList.remove('option-soldout');
                  sO.parentNode.classList.remove('option-disabled');
                }                
              }
              if (o.options[1]   &&   v === variant.options[0]   &&   v === o.options[0]) {
                let sO = _this3.$form.querySelector('.product-options .option-2 input[value="' + o.options[1].replace(/["\\]/g, '\\$&') + '"]');                  
                sO.parentNode.classList.remove('hidden');                
                if (o.available) {
                  sO.parentNode.classList.remove('option-soldout');
                  sO.parentNode.classList.remove('option-disabled');
                }
              }              
              if (o.options[2]   &&   variant.options[0] === o.options[0]   &&   v === variant.options[1]   &&   v === o.options[1]) {    
                let sO = _this3.$form.querySelector('.product-options .option-3 input[value="' + o.options[2].replace(/["\\]/g, '\\$&') + '"]');            
                sO.parentNode.classList.remove('hidden');
                if (o.available) {                  
                  sO.parentNode.classList.remove('option-soldout');
                  sO.parentNode.classList.remove('option-disabled');
                }
              }                
            }
          }          
        }
      }
    }, {
      key: "isDefault",
      value: function isDefault() {
        if (this.product.variants[0].title === 'Default Title' && this.product.variants[0].option1 === 'Default Title') {
          return true;
        }
        return false;
      }
    }, {
      key: "getSelectedVariant",
      value: function getSelectedVariant() {
        if (this.isDefault()) {
          return this.product.variants[0];
        }
        var options = [];
        if (this.optionsType === this.optionsTypes.select) {
          this.$options.forEach(function (i, option) {
            options.push(i.value);          
          });
        } else if (this.optionsType === this.optionsTypes.radio) {
          this.$options.forEach(function (option) {
            if (option.checked) {
              options.push(option.value);
            }
          });
        } else {
          return null;
        }        
        return this.productOptions.getVariantFromOptions(options);        
      }
    }]);
    return VariantHelper;
  }();
  function ProductForm_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductForm_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductForm_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductForm_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductForm_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductForm = function () {
    function ProductForm(el) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ProductForm_classCallCheck(this, ProductForm);
      this.$el = options.container || el;
      this.$form = options.form || el;
      this.options = options;
      this.product = options.product;
      this.product.options = options.productVariants;
      this.postMessage = this.options.postMessage;
      this.isThemeEditor = window.Shopify && window.Shopify.designMode;
      this.useHistory = options.useHistory && !this.isThemeEditor && window.history && history.replaceState;
      this.events = [];
      this.$atc = this.$el.querySelector('[data-product-atc]');
      if (this.$atc) {
        this.events.push(
          this.$atc.onclick = function(event){
            if (_this.options.enableCartRedirection || !document.querySelector('header')) {
              _this.$form.submit();
              return;
            }
            event.preventDefault();
            _this._addToCart();
          },
          window.addEventListener('product-variant-switch', function(event, data) {
            var data = event.detail;
            _this._changeVariant(data);            
          })
        )
      }
      this.$options = this.$el.querySelectorAll('.product-options [data-product-option]');
      this.$variants = this.$el.querySelector('[data-variants]');      
      this.variantHelper = new VariantHelper(this.options.product, this.$variants, this.$options, this.$form);      
      if (this.$el.querySelector('[data-quantity]')) {
        this.quantity = new Quantity(this.$el.querySelector('[data-quantity]'));
        this.events.push(
          this.quantity.input.onchange = function(event){            
            if (_this.options.onQuantityChange) {
              _this.options.onQuantityChange(_this.variantHelper.getSelectedVariant(), _this.quantity.value);
            }
          }
        );
      } else {
        this.quantity = this.$el.querySelector('[data-quantity-hidden]'); 
      }
    }
    ProductForm_createClass(ProductForm, [{
      key: "unload",
      value: function unload() {      
      }
    }, {
      key: "_changeVariant",
      value: function _changeVariant(data) {
        document.dispatchEvent(new CustomEvent('_changeVariant', {
          bubbles: true
        }));    
        var variant = data.variant;
        this._changeUrl(variant);
        if (this.options.onVariantChange) {
          this.options.onVariantChange(variant);
        }
      }
    }, {
      key: "_changeUrl",
      value: function _changeUrl(variant) {
        if (!this.useHistory) {
          return;
        }
        p = {
          variant: variant.id
        }
        params = Object.keys(p).map(function(k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(p[k])
        }).join('&');
        var url = "".concat(this.options.product.handle, "?").concat(params);
        history.replaceState({}, 'variant', url);
      }
    }, {
      key: "_addToCart",
      value: function _addToCart() {
        var _this3 = this;
        if (this.options.onAddToCart) {
          this.options.onAddToCart();
        }
        const formData = new FormData(this.$form);
        fetch(window.theme.routes.cart_add_url + '.js', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: formData
        }).then(function(r) {        
          return r.json();        
        }).then(function(j) {        
          if (j.status) {
            if (_this3.options.onError) {
              var responseText = {};
              try {
                responseText = j;
              } catch (error) {
                responseText.description = window.theme.cartAddError;
              }
              var error = responseText.description;
              _this3.options.onError(j, error);
            }
            return;
          }
          _this3._updateCart();
          if (_this3.options.onSuccess) {
            _this3.options.onSuccess(j, _this3.quantity.value);
          }
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      }
    }, {
      key: "_updateCart",
      value: function _updateCart() {
        var _this4 = this;
        fetch(window.theme.routes.cart_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(function(r) {        
          return r.json();        
        }).then(function(j) {
          _this4.postMessage('product:add-to-cart', {
            response: j
          });          
          if (!document.querySelector('[data-header-minicart]')) {
            var c = document.querySelector('[data-site-actions-cart-cart]');
            if (c) {
              if (j.item_count > 0) {
                c.querySelector('.full').classList.remove('hidden');
                c.querySelector('.empty').classList.add('hidden');
              } else {
                c.querySelector('.full').classList.add('hidden');
                c.querySelector('.empty').classList.remove('hidden'); 
              }
            }
            document.querySelectorAll('[data-cart-item-count]').forEach(function (c) {
              c.textContent = "".concat(j.item_count);
            });            
          }          
        }).catch(function(err) {
          console.error('!: ' + err)
        });
        if (!document.querySelector('[data-header-minicart]')) {
          var sm = _this4.$form.querySelector('shipping-message');
          if (sm) {  
            return shopify_asyncview_dist_index_es.load(window.theme.routes.cart_url, {
              view: 'ajax'
            }).then(function (_ref) {
              if (_ref) {
                var html = _ref.html,
                    smv = sm.querySelector('.sm-container-value');
                sm.innerHTML = html.ship_msg;  
                var nsm = _this4.$form.querySelector('shipping-message'),
                    nsmv = nsm.querySelector('.sm-container-value');
                    nsmv.style.setProperty('width', smv.getAttribute('data-width') + '%');
                setTimeout(function() {
                  nsmv.style.setProperty('width', nsmv.getAttribute('data-width') + '%');
                }, 1);
              }
            });
          }
        }
      }
    }]);
    return ProductForm;
  }();
  function ProductZoom_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductZoom_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductZoom_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductZoom_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductZoom_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductZoom = function () {
    function ProductZoom(el) {
      var _this = this;
      ProductZoom_classCallCheck(this, ProductZoom);
      this.el = el;
      this.$el = el;
      this.$img = this.$el.querySelector('img');
      this.scale = this.$el.getAttribute('data-zoom-level');
      this.zoomable = this.scale >= 1.25;
      this.framerate = 60;
      this.zoomed = false;
      this.resetZoom = this._resetZoom.bind(this);
      this._init();
      this.$img.addEventListener('img:load', _this._init());
    }
    ProductZoom_createClass(ProductZoom, [{
      key: "_init",
      value: function _init() {
        this.disableZoom();
        if (this.zoomable) {
          this.enableZoom();        
        }
      }
    }, {
      key: "enableZoom",
      value: function enableZoom() {
        this.$el.classList.add('product-image-zoomable');
        this._bindEvents();
      }
    }, {
      key: "disableZoom",
      value: function disableZoom() {
        this.$el.classList.remove('product-image-zoomable');
        this._resetZoom();
      }
    }, {
      key: "_bindEvents",
      value: function _bindEvents() {
        var _this2 = this;
        this.$el.onclick = function(event){
          _this2._toggleZoom(event.clientX, event.clientY);
        };
        window.onresize = function(event){
          this.resetZoom
        };
      }
    }, {
      key: "_toggleZoom",
      value: function _toggleZoom(clientX, clientY) {
        var _this3 = this;
        if (!this.zoomed) {
          this.$img.srcset = this.$img.getAttribute('data-zoom');        
          if (theme.isMobile) {
            this.$el.ontouchcancel = function(){
              _this3._resetZoom();
              return
            };
            document.body.classList.add('zoom-enabled');
            this.$el.ontouchmove = debounce(function (event) {
              var touch = event.touches[0];
              _this3._positionZoom(touch.clientX, touch.clientY);
            }, 100 / this.framerate, true, true);
          } else {
            this.$el.onmouseout = function(){
              _this3._resetZoom();
              return
            };
            this.$el.onmousemove = debounce(function (event) {
              _this3._positionZoom(event.clientX, event.clientY);
            }, 100 / this.framerate, true, true);        
          }          
          this.$el.classList.add('product-image-zoomed');          
          this.$img.style.transform = 'scale(' + this.scale + ')';          
          this._positionZoom(clientX, clientY);
          this.zoomed = true;
        } else {
          this._resetZoom();
        }
      }
    }, {
      key: "_resetZoom",
      value: function _resetZoom() {
        this.$el.ontouchend = null;
        this.$el.ontouchmove = null;
        this.$el.onmousemove = null;
        this.$el.onmouseout = null;
        if (theme.isMobile) {
          document.body.classList.remove('zoom-enabled');
        }
        this.$el.classList.remove('product-image-zoomed');        
        this.$img.style.removeProperty('transform');        
        this.zoomed = false;
      }
    }, {
      key: "_positionZoom",
      value: function _positionZoom(clientX, clientY) {
        if (!this.zoomed) {
          return;
        }
        var figRect = this.$el.querySelector('.slide-container').getBoundingClientRect(),
            imgRect = this.$img.getBoundingClientRect(),
            figHalfWidth = figRect.width / 2,
            figHalfHeight = figRect.height / 2,
            centerX = figRect.left + figHalfWidth,
            centerY = figRect.top + figHalfHeight,
            widthDiff = imgRect.width / 2 - figHalfWidth,
            heightDiff = imgRect.height / 2 - figHalfHeight,
            translateX = (centerX - clientX) / figHalfWidth * widthDiff / this.scale,
            translateY = (centerY - clientY) / figHalfHeight * heightDiff / this.scale;
        this.$img.style.transform = "scale(" .concat(this.scale, ") translate(").concat(translateX, "px, ").concat(translateY, "px)");
      }
    }]);
    return ProductZoom;
  }();
  function ProductGallery_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductGallery_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductGallery_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductGallery_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductGallery_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductGallery = function () {
    function ProductGallery(el) {      
      var _this = this,
          sectionId = el.getAttribute('data-section-id'),
          settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ProductGallery_classCallCheck(this, ProductGallery);
      this.el = el;      
      this.settings = settings;
      if (this.el.querySelector('[data-slideshow]')) {
        this.id = this.el.querySelector('[data-slideshow]').getAttribute('id');
      };
      this.layout = this.el.dataset.productGalleryLayout;
      this.viewport = this.el.querySelector('[data-product-gallery-viewport]');
      this.navigation = this.el.querySelector('[data-product-gallery-navigation]');
      this.figures = this.viewport.querySelectorAll('[data-product-gallery-figure]');
      this.thumbnails = this.viewport.querySelectorAll('[data-product-gallery-thumbnail]');
      this.selected = {
        figure: this.viewport.querySelector('[data-product-gallery-selected="true"]'),
        thumbnail: null
      };
      this.media = {
        images: [],
        models: [],
        videos: []
      };
      this.events = new Events();
      if (this.navigation) {
        this.selected.thumbnail = this.navigation.querySelector('[data-product-gallery-selected="true"]');
        this.featured = document.getElementById(sectionId + '-featured-images');
        this.thumbs = document.getElementById(sectionId + '-thumb-images');
        var variantImages = {},
            thumbnails,
            variant,
            variantImage,
            opt_key,
            opt_val,
            loop_index,
            vars = settings.section.data.product.variants,
            opts = settings.section.data.product.options,
            options = settings.section.el.querySelectorAll('.product-options [data-product-option]'),
            optionsTypes = {
              select: 'select',
              radio: 'radio'
            };
        vars.forEach(function(v) {
          variant = v;
          if ( typeof variant.featured_image !== 'undefined' && variant.featured_image !== null ) {
            variantImage =  variant.featured_image.src.split('?')[0].replace(/http(s)?:/,'');
            variantImages[variantImage] = variantImages[variantImage] || {};
            var opts = v.options
            opts.forEach(function(o,i) {
              opt_key = 'option-'+i;
              opt_val = o;
              if (typeof variantImages[variantImage][opt_key] === 'undefined') {
                variantImages[variantImage][opt_key] = opt_val;
              }
              else {
                var oldValue = variantImages[variantImage][opt_key];
                if ( oldValue !== null && oldValue !== opt_val )  {
                  variantImages[variantImage][opt_key] = null;
                }
              }
            });
          }
        });
        this.onThumbnailClick = function (e, data) {          
          if (data) {
            var index = data,
                thumb = this.thumbnails[index].querySelector('img[src]');            
          } else {
            var index = e.target.parentNode.getAttribute('data-product-gallery-thumbnail'),              
                thumb = this.querySelector('img[src]');
          }
          _this._selectMediaByIndex(index);
          thumbParent = _this.viewport.querySelector('[data-product-gallery-thumbnail-placeholder]'),
          image = thumb.getAttribute('src').split('?')[0].replace(/(_1x)/,'');
          if (thumbParent) {
            thumbParent.remove();
          }
          if (typeof variantImages[image] !== 'undefined') {
            opts.forEach(function(o,i) {
              loop_index = 'option-' + i;
              if (variantImages[image][loop_index] !== null) {
                var index = i;
                if (settings.section.data.option_type === optionsTypes.select) {
                  var sos = document.querySelector('[name="' + settings.section.id + '-' + settings.section.data.product.id + '-option' + index + '"]');
                  sos.value = variantImages[image][loop_index];
                  sos.dispatchEvent(new Event('change'));
                } else {
                  options.forEach(function (o) {
                    if (o.value == variantImages[image][loop_index]) {
                      o.checked = true;
                      o.dispatchEvent(new Event('change'));
                    }
                    return;
                  });
                }
              }
            });
          }          
        };
        this.thumbnails.forEach(function (thumbnail) {
          return _this.events.register(thumbnail, 'click', _this.onThumbnailClick);
        });
        this.onLayoutChange = function () {          
          if (_this.layout == 'list') {
            if(Layout.isBreakpoint('S')) {
              _this.featured.classList.add('slideshow', 'slider');
            } else {
              _this.featured.classList.remove('slideshow', 'slider', 'slider-loaded', 'active', 'sliding');
            }
          }
        };
        Layout.onBreakpointChange(this.onLayoutChange);
        _this.featured.classList.remove('loading');
      }
      var features = [];
      if (this.layout === 'list') {
        var imageEls = this.viewport.querySelectorAll('[data-media-type="image"][data-product-gallery-image-zoom]');
        for (var i = 0; i < imageEls.length; i++) {
          this._initZoom(imageEls[i]);
        }
      } else if (this.selected.figure.dataset.mediaType === 'image') {
        this._initZoom(this.selected.figure);
      }
      if (this.el.querySelectorAll('.product-gallery--viewport--figure[data-media-type="model"]')) {
        this.events.register(this.viewport, 'click', function (e) {
          if ('shopifyXr' in e.target.dataset) {
            _this._onViewInYourSpaceClick(e.target);
          }
        });
        features.push({
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: this._onModelLibraryLoad.bind(this)
        });
        features.push({
          name: 'shopify-xr',
          version: '1.0'
        });
      }
      if (this.el.querySelector('[data-media-type="video"]')) {
        Promise.all([new Promise(function (resolve) {
          if (!document.querySelector('#plyr-stylesheet')) {
            var link = document.createElement('link');
            link.setAttribute('id', 'plyr-stylesheet');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');
            link.onload = resolve;
            document.body.appendChild(link);
          } else {
            resolve();
          }
        }), new Promise(function (resolve) {
          features.push({
            name: 'video-ui',
            version: '1.0',
            onLoad: resolve
          });
        })]).then(this._onVideoLibraryLoad.bind(this));
      }
      if (features.length) {
        Shopify.loadFeatures(features);
      }
    }
    ProductGallery_createClass(ProductGallery, [{
      key: "selectMediaByVariant",
      value: function selectMediaByVariant(variant) {
        if (variant.featured_media) {
          var figure = this.viewport.querySelector("[data-media=\"".concat(variant.featured_media.id, "\"]"));
        }
        if (!figure) {
          if (this.selected.thumbnail) {
            this.selected.thumbnail.dataset.productGallerySelected = false;
          }
        } else {
          this._selectMediaByIndex(figure.dataset.productGalleryFigure);
          var thumb = {
            b: this.selected.thumbnail,
            i: this.selected.thumbnail.dataset.index,
            id: this.id,            
            s: this.featured.querySelector('.slider')
          };
          this.settings.section.postMessage('var:select', thumb);
        }
      }
    }, {
      key: "pauseVideos",
      value: function pauseVideos() {
        this.el.querySelectorAll('.js-youtube').forEach((video) => {
          video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
        this.el.querySelectorAll('.js-vimeo').forEach((video) => {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });
        var excludeVideo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.media.videos.forEach(function (v) {
          if (v !== excludeVideo) {
            v.pause();
          }
        });
      }
    }, {
      key: "pauseModels",
      value: function pauseModels() {
        var excludeModel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.media.models.forEach(function (m) {
          if (m !== excludeModel && m.ui.interacting) {
            m.ui.pause();
          }
        });
      }
    }, {
      key: "unload",
      value: function unload() {
        this.events.unregisterAll();
        this.media.videos.forEach(function (v) {
          return v.unload();
        });
        this.media.images.forEach(function (i) {
          return i.unload();
        });
      }
    }, {
      key: "_onModelLibraryLoad",
      value: function _onModelLibraryLoad() {
        var _this2 = this;
        var controls = ['zoom-in', 'zoom-out'];
        if (document.fullscreenEnabled) controls.push('fullscreen');
        this.viewport.querySelectorAll('.product-gallery--viewport--figure[data-media-type="model"]').forEach(function (modelFigure) {
          var modelEl = modelFigure.querySelector('model-viewer');
          _this2.media.models.push({
            ui: new Shopify.ModelViewerUI(modelEl, {
              controls: controls
            }),
            el: modelEl,
            figure: modelFigure
          });
          modelEl.addEventListener('shopify_model_viewer_ui_toggle_play', function(evt) {
            _this2.viewport.querySelector('.slider').classList.add('no-drag');
          }.bind(this));
          modelEl.addEventListener('shopify_model_viewer_ui_toggle_pause', function(evt) {
            _this2.viewport.querySelector('.slider').classList.remove('no-drag');
          }.bind(this));
        });
      }
    }, {
      key: "_onViewInYourSpaceClick",
      value: function _onViewInYourSpaceClick(target) {
        if (target.dataset.shopifyModel3dId === this.selected.figure.dataset.media) return;
        var figure = this.viewport.querySelector("[data-media=\"".concat(target.dataset.shopifyModel3dId, "\"]"));
        this._selectMediaByEl(figure);
      }
    }, {
      key: "_selectMediaByEl",
      value: function _selectMediaByEl(el) {
        this._selectMediaByIndex(parseInt(el.dataset.productGalleryFigure, 10));
      }
    }, {
      key: "_onVideoLibraryLoad",
      value: function _onVideoLibraryLoad() {
        var _this3 = this;
        var videoFigures = this.viewport.querySelectorAll('[data-media-type="video"]');
        var _loop = function _loop(i) {
          var videoFigure = videoFigures[i];
          var videoEl = videoFigure.querySelector('video');
          var player = new Shopify.Plyr(videoEl, {
            loop: {
              active: _this3.settings.enable_video_looping
            }
          });
          var video = {
            figure: videoFigure,
            el: videoEl,
            player: player,
            restart: function restart() {
              player.restart();
              player.play();
            },
            pause: function pause() {
              return player.pause();
            },
            play: function play() {
              return player.play();
            },
            unload: function unload() {
              return player.destroy();
            }
          };
          _this3.events.register(videoFigure, 'play', function () {
            return _this3.pauseVideos(video);
          });
          _this3.media.videos.push(video);
        };
        for (var i = 0; i < videoFigures.length; i++) {
          _loop(i);
        }
      }
    }, {
      key: "_onVideoSelect",
      value: function _onVideoSelect(video) {
        if (this.settings.enable_video_autoplay && this.layout !== 'list' && !theme.isMobile) {
          video.play();
        }
      }
    }, {
      key: "_onMediaSelect",
      value: function _onMediaSelect(index) {
        var _this8 = this;
        var focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var figure = this.figures[index];
        this.selected.figure.dataset.productGallerySelected = false;
        this.selected.figure = figure;
        this.selected.figure.dataset.productGallerySelected = true;
        var viewInYourSpaceEls = this.el.querySelectorAll('[data-shopify-xr]');
        var setViewInYourSpaceID = function setViewInYourSpaceID(id) {
          for (var i = 0; i < viewInYourSpaceEls.length; i++) {
            viewInYourSpaceEls[i].dataset.shopifyModel3dId = id;            
          }
        };
        if (viewInYourSpaceEls.length) {
          setViewInYourSpaceID(viewInYourSpaceEls[0].dataset.defaultModelId);
        }
        this.pauseVideos();
        this.pauseModels();
        if (focus) {
          this.media.videos.forEach(function (v) {
            if (v.figure === _this8.selected.figure) {
              v.el.focus();
            }
          });
          this.media.models.forEach(function (m) {
            if (m.figure === _this8.selected.figure) {
              if (!theme.isMobile) {
              	m.ui.play();
              }
              m.el.focus();
            }
          });
        }
        switch (this.selected.figure.dataset.mediaType) {
          case 'external_video':
            let f = this.selected.figure;
            if (this.layout !== 'list' && !f.getAttribute('loaded') && f.querySelector('template')) {
              f.querySelector('.youtube-container').appendChild(f.querySelector('template').content.firstElementChild.cloneNode(true));
              f.setAttribute('loaded', true);
            }
            f.focus();
            break;
          case 'video':
            this._onVideoSelect(this.media.videos.filter(function (v) {
              return v.figure === _this8.selected.figure;
            })[0]);
            break;
          case 'model':
            setViewInYourSpaceID(this.selected.figure.dataset.media);
            break;
          case 'image':
            this._initZoom(this.selected.figure);
            break;
          default:
            break;
        }
      }
    }, {
      key: "_selectMediaByIndex",
      value: function _selectMediaByIndex(index) {        
        var _this = this,
            focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (this.navigation) {
          var thumbnail = this.thumbnails[index];
          this.selected.thumbnail.dataset.productGallerySelected = false;          
          this.selected.thumbnail = thumbnail;          
          this.selected.thumbnail.dataset.productGallerySelected = true;
          if (this.navigation.querySelector('.slider').getAttribute('data-slider-axis') == 'vertical' && !Layout.isBreakpoint('S')) {
            var tAnchor = this.selected.thumbnail.offsetTop + (this.selected.thumbnail.offsetHeight / 2) - (this.navigation.querySelector('.slider').offsetHeight / 2);            
            this.navigation.querySelector('.slider').scroll({
              top: tAnchor,
              behavior: 'smooth'
            })
          } else {            
            var tAnchor = this.selected.thumbnail.offsetLeft + (this.selected.thumbnail.offsetWidth / 2) - (this.navigation.querySelector('.slider').offsetWidth / 2);            
            this.navigation.querySelector('.slider').scroll({
              left: tAnchor,
              behavior: 'smooth'
            })                
          };          
        }
        _this._onMediaSelect(index, focus);
      }
    }, {
      key: "_initZoom",
      value: function _initZoom(figure) {
        if (this.settings.enable_zoom) {        
          var exists = this.media.images.filter(function (image) {
            return image.el.dataset.media === figure.dataset.media;
          });
          if (this.media.images.length === 0 || exists.length === 0) {
            this.media.images.push(new ProductZoom(figure));
          }
        }
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, index) {
        if (name === 'slider:up') {
          if (index.i == this.id) {
            this.onThumbnailClick(name, index.d);
          }
        }
      }
    }]);
    return ProductGallery;
  }();  
  var calculateDistance = function calculateDistance(latitude1, longitude1, latitude2, longitude2, unitSystem) {
    var dtor = Math.PI / 180;
    var radius = unitSystem === 'metric' ? 6378.14 : 3959;
    var rlat1 = latitude1 * dtor;
    var rlong1 = longitude1 * dtor;
    var rlat2 = latitude2 * dtor;
    var rlong2 = longitude2 * dtor;
    var dlon = rlong1 - rlong2;
    var dlat = rlat1 - rlat2;
    var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };
  var getGeoLocation = function getGeoLocation() {
    return new Promise(function (resolve, reject) {
      var options = {
        maximumAge: 3600000,
        timeout: 5000
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (_ref) {
          var coords = _ref.coords;
          return resolve(coords);
        }, reject, options);
      } else {
        reject();
      }
    });
  };
  var index_es_location = null;
  var setLocation = function setLocation(_ref2) {
    var latitude = _ref2.latitude,
        longitude = _ref2.longitude;
    return new Promise(function (resolve) {
      var cachedLocation = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      var newData = {
        latitude: latitude,
        longitude: longitude,
        timestamp: Date.now()
      };
      index_es_location = newData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      if (cachedLocation !== null && cachedLocation.latitude === latitude && cachedLocation.longitude === longitude // Valid for 1 hour - per Debut's example
          && isNotExpired(cachedLocation.timestamp)) {
        resolve({
          latitude: latitude,
          longitude: longitude
        });
        return;
      }
      fetch('/localization.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude
        })
      }).then(function () {
        return resolve({
          latitude: latitude,
          longitude: longitude
        });
      });
    });
  };
  var getLocation = function getLocation() {
    return new Promise(function (resolve) {
      if (index_es_location && isNotExpired(index_es_location.timestamp)) {
        resolve(index_es_location);
        return;
      }
      resolve(getGeoLocation().then(setLocation));
    });
  };
  var LOCAL_STORAGE_KEY = 'shopify-surface-pick-up';
  var loadingClass = 'surface-pick-up--loading';
  var isNotExpired = function isNotExpired(timestamp) {
    return timestamp + 1000 * 60 * 60 <= Date.now();
  };
  var removeTrailingSlash = function removeTrailingSlash(s) {
    return s.replace(/(.*)\/$/, '$1');
  };
  function dist_index_es_classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function dist_index_es_defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function dist_index_es_createClass(Constructor, protoProps, staticProps) {
    if (protoProps) dist_index_es_defineProperties(Constructor.prototype, protoProps);
    if (staticProps) dist_index_es_defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var SurfacePickUp = function () {
    function SurfacePickUp(el, options) {
      dist_index_es_classCallCheck(this, SurfacePickUp);
      this.el = el;
      this.root_url = this.el.getAttribute('data-base-url');
      this.callbacks = [];
      this.onBtnPress = null;
      this.latestVariantId = null;
      this.pickUpEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    }
    dist_index_es_createClass(SurfacePickUp, [{
      key: "load",
      value: function load(variantId) {
        var _this = this;
        this.latestVariantId = variantId;
        this.el.classList.add(loadingClass);
        return _this._getData(variantId).then(function (data) {
          return _this._injectData(data);
        });
      }
    }, {
      key: "onModalRequest",
      value: function onModalRequest(callback) {
        if (this.callbacks.indexOf(callback) >= 0) return;
        this.callbacks.push(callback);
      }
    }, {
      key: "unload",
      value: function unload() {
        this.callbacks = [];
        this.el.innerHTML = '';
      }
    }, {
      key: "_getData",
      value: function _getData(variantId) {
        var _this2 = this;
        return new Promise(function (resolve) {
          var xhr = new XMLHttpRequest();
          var requestUrl = "".concat(_this2.root_url, "/variants/").concat(variantId, "/?section_id=modal-surface-pick-up");
          xhr.open('GET', requestUrl, true);
          xhr.onload = function () {
            var el = xhr.response;
            var embed = el.querySelector('[data-html="surface-pick-up-embed"]');
            var itemsContainer = el.querySelector('[data-html="surface-pick-up-items"]');
            var items = itemsContainer.content.querySelectorAll('[data-surface-pick-up-item]');
            resolve({
              embed: embed,
              itemsContainer: itemsContainer,
              items: items,
              variantId: variantId
            });
          };
          xhr.onerror = function () {
            resolve({
              embed: {
                innerHTML: ''
              },
              itemsContainer: {
                innerHTML: ''
              },
              items: [],
              variantId: variantId
            });
          };
          xhr.responseType = 'document';
          xhr.send();
        });
      }
    }, {
      key: "_injectData",
      value: function _injectData(_ref3, force) {
        var _this3 = this;
        var embed = _ref3.embed,
            itemsContainer = _ref3.itemsContainer,
            items = _ref3.items,
            variantId = _ref3.variantId;
        _this3.$el = this.el;
        if (variantId !== this.latestVariantId || items.length === 0) {
          Revealer('hide', force, _this3);
          setTimeout(function () {
            _this3.$el.innerHTML = '';
            _this3.$el.classList.remove(loadingClass);
          }, 500);
          return;
        }
        this.el.innerHTML = embed.innerHTML;
        this.el.classList.remove(loadingClass);
        Revealer('show', force, _this3);
        var processedDistances = false;
        var processDistances = function processDistances() {
          if (processedDistances) return;
          processedDistances = true;
          return getLocation().then(function (coords) {
            items.forEach(function (item) {
              var distanceEl = item.querySelector('[data-distance]');
              var distanceUnitEl = item.querySelector('[data-distance-unit]');
              var unitSystem = distanceUnitEl.dataset.distanceUnit;
              var itemLatitude = parseFloat(distanceEl.dataset.latitude);
              var itemLongitude = parseFloat(distanceEl.dataset.longitude);
              if (coords && isFinite(itemLatitude) && isFinite(itemLongitude)) {
                var distance = calculateDistance(coords.latitude, coords.longitude, itemLatitude, itemLongitude, unitSystem);
                distanceEl.innerHTML = distance.toFixed(1);
                distanceUnitEl.innerHTML = distanceUnitEl.getAttribute('data-unit');
              } else {
                distanceEl.remove();
                distanceUnitEl.remove();
              }
            })
          })
          ["catch"](function () {
            items.forEach(function (item) {
              var distanceEl = item.querySelector('[data-distance]');
              var distanceUnitEl = item.querySelector('[data-distance-unit]');
              distanceEl.remove();
              distanceUnitEl.remove();
            });
          })["finally"](function () {
            processedDistances = true;
            _this3.callbacks.forEach(function (callback) {
              return callback(itemsContainer.innerHTML);
            });
          });
        };
        this.el.querySelector('[data-surface-pick-up-embed-modal-btn]').addEventListener('click', function () {
          if (JSON.parse(_this3.el.getAttribute('data-geo'))) {
            processDistances();
          }
          _this3.callbacks.forEach(function (callback) {
            return callback(itemsContainer.innerHTML);
          });
        });
        return this.el;
      }
    }]);
    return SurfacePickUp;
  }();
  var shopify_surface_pick_up_dist_index_es = (SurfacePickUp);
  function SurfacePickUp_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function SurfacePickUp_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function SurfacePickUp_createClass(Constructor, protoProps, staticProps) { if (protoProps) SurfacePickUp_defineProperties(Constructor.prototype, protoProps); if (staticProps) SurfacePickUp_defineProperties(Constructor, staticProps); return Constructor; }
  var SurfacePickUp_SurfacePickUp = function () {
    function SurfacePickUp(_ref) {
      var _this = this;
      var el = _ref.el,
          product = _ref.product,
          initialVariantId = _ref.initialVariantId,
          hasOnlyDefaultVariant = _ref.hasOnlyDefaultVariant;
      SurfacePickUp_classCallCheck(this, SurfacePickUp);
      this.el = el;
      this.product = product;
      this.selectedVariant = product.variants.find(function (_ref2) {
        var id = _ref2.id;
        return id === initialVariantId;
      });
      var surfacePickUpEl = this.el.querySelector('[data-surface-pick-up]');
      var surfacePickUpElMobile = this.el.querySelector('[data-surface-pick-up-mobile]');
      this.surfacePickUps = [new shopify_surface_pick_up_dist_index_es(surfacePickUpEl)];
      if (surfacePickUpElMobile) {
        this.surfacePickUps.push(new shopify_surface_pick_up_dist_index_es(surfacePickUpElMobile));
      }
      var components_Modal = (new Modal());
      var onModalRequest = function onModalRequest(content) {
        var variantTitle = hasOnlyDefaultVariant ? '' : "<h6 class=\"modal-header__surface-pick-up-variant\">".concat(_this.selectedVariant.title, "</h6>");
        var header = "\n          <h2 class=\"modal-header__surface-pick-up-title\">".concat(product.title, "</h2>\n          ").concat(variantTitle, "\n        ");
        components_Modal.open({
          header: header,
          content: content
        });
      };
      this.surfacePickUps.forEach(function (surfacePickUp) {
        surfacePickUp.load(_this.selectedVariant.id);
        surfacePickUp.onModalRequest(onModalRequest);
      });
      this.handleVariantChange = function (event) {
        var data = event.detail;
        return _this.onVariantChange(data);
      };
      window.addEventListener('product-variant-switch', this.handleVariantChange);
    }
    SurfacePickUp_createClass(SurfacePickUp, [{
      key: "onVariantChange",
      value: function onVariantChange(_ref3) {
        var _this2 = this;
        var variant = _ref3.variant,
            isProduct = _ref3.isProduct;
        if (isProduct && !isProduct(this.product)) {
          return;
        }
        this.selectedVariant = variant;
        this.surfacePickUps.forEach(function (surfacePickUp) {
          return surfacePickUp.load(_this2.selectedVariant.id);
        });
      }
    }, {
      key: "unload",
      value: function unload() {
        window.removeEventListener('product-variant-switch', this.handleVariantChange);
        this.surfacePickUps.forEach(function (surfacePickUp) {
          return surfacePickUp.unload();
        });
      }
    }]);
    return SurfacePickUp;
  }();
  function ProductDetails_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductDetails_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductDetails_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductDetails_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductDetails_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductDetails = function () {
    function ProductDetails(_ref, force) {
      var _this = this;
      var $el = _ref.$el,
          section = _ref.section;
      ProductDetails_classCallCheck(this, ProductDetails);
      this.el = $el;
      this.section = section;
      this.data = section.data;
      this.onboarding = $el.querySelector('[data-onboarding]').getAttribute('data-onboarding');      
      this.postMessage = section.postMessage;
      this.type = section.type;
      this.$el = $el;
      this.$window = window;
      this.navigation = this.el.querySelector('[data-product-gallery-navigation]');
      this.$productInfo = $el.querySelector('[data-product-info]');
      this.$atc = $el.querySelector('[data-product-atc]');
      this.$atcl = $el.querySelector('[data-product-atcl]');
      this.$variantDetails = this.$el.querySelector('[data-variants]');
      this._handleVariantChange = this._handleVariantChange.bind(this);
      this.$tooltips = $el.querySelectorAll('.tooltip-btn');
      this.$alert = document.querySelector('.product-alert');      
      if (this.el.querySelector('[data-product-gallery]')) {
        this.productGallery = new ProductGallery(this.el.querySelector('[data-product-gallery]'), {
          enable_zoom: this.data.gallery_zoom,
          enable_video_autoplay: this.data.gallery_video_autoplay,
          enable_video_looping: this.data.gallery_video_looping,
          section: section
        });
      }
      this.listeningForVariantChange = false;
      this.listenForVariantChange();
      if (this.onboarding === 'false') {
        this.form = new ProductForm(this.$el.querySelector('[data-product-details]'), {
          form: this.$el.querySelector('[data-product-form-inline]'),
          productEl: this.$el,
          product: this.data.product,
          productVariants: this.data.product_variants,
          type: this.type,
          moneyFormat: window.theme.moneyFormat,
          postMessage: section.postMessage,
          useHistory: this.data.use_history,
          enableCartRedirection: this.data.enable_cart_redirection,
          onAddToCart: function onAddToCart() {
            return _this._onATC();
          },
          onSuccess: function onSuccess(response, quantity) {
            return _this._onAtcSuccess(response, quantity);
          },
          onError: function onError(response, error) {
            return _this._onAtcError(response, error);
          }
        });        
        let event = new CustomEvent('product-variant-switch', {
          detail: {
            variant: this.form.variantHelper.getSelectedVariant()
          }
        });
      }
      ContentSlide(this.el, force);
      this.$tooltips.forEach(function(t) {
        t.onclick = function(){
          return _this._showTooltip(t);
        };
      });
      if ($el.querySelector('.surface-pick-up')) {
        this.SurfacePickUp = new SurfacePickUp_SurfacePickUp({
          el: this.el,
          product: this.data.product,
          initialVariantId: parseInt(this.data.initial_variant_id, 10),
          hasOnlyDefaultVariant: this.data.has_only_default_variant
        });
      };
      if (this.$alert) {
        this.events = [
          this.$alert.querySelector('.product-alert-dismiss').onclick = function(event){
            return _this._hideAlert();
          }
        ];
      };
    }
    ProductDetails_createClass(ProductDetails, [{
      key: "listenForVariantChange",
      value: function listenForVariantChange() {
        if (!this.listeningForVariantChange) {
          window.addEventListener('product-variant-switch', this._handleVariantChange);
          this.listeningForVariantChange = true;
        }
      }
    }, {
      key: "stopListeningForVariantChange",
      value: function stopListeningForVariantChange() {
        if (this.listeningForVariantChange) {
          window.removeEventListener('product-variant-switch', this._handleVariantChange);
          this.listeningForVariantChange = false;
        }
      }
    },{
      key: "unload",
      value: function unload() {
        this._hideAlert();
        this.stopListeningForVariantChange();
        if (this.SurfacePickUp) {
          this.SurfacePickUp.unload();
        }
      }
    }, {
      key: "_onATC",
      value: function _onATC() {
        this._hideAlert();
        this.$atc.classList.add('loading');
      }
    }, {
      key: "_onAtcSuccess",
      value: function _onAtcSuccess(force) {
        var _this = this;
        this.postMessage('cart:refresh');
        theme.header_cart = this.$atc
        if (document.querySelector('[data-header-minicart]')) {
          this.postMessage('header-minicart:refresh');          
          setTimeout(function () {                  
            _this.$atc.classList.remove('loading');
          }, 250);
        } else {
          this.postMessage('header-minicart:refresh');
          this.$atc.classList.remove('loading');
          this.$atcl.$el =  this.$atcl;          
          Revealer('show', force, this.$atcl);          
        }
      }
    }, {
      key: "_onAtcError",
      value: function _onAtcError(response, error) {
        this.$atc.classList.remove('loading');
        this._showAlert(response, 'error');
      }
    }, {
      key: "_handleVariantChange",
      value: function _handleVariantChange() {
        var data = event.detail;
        this._onVariantChange(data);
      }
    }, {
      key: "_onVariantChangeFetch",
      value: function _onVariantChangeFetch(variant, force) {
        var qty = this.$el.querySelector('[data-quantity-container]'),
            qty_vol = this.$el.querySelector('[data-quantity-qty-vol]'),
            vMF = this.$el.querySelectorAll('.variant_metafields');        
        if (qty || vMF.length > 0) {
          fetch(this.$productInfo.dataset.href + '?variant=' + variant.id)
          .then(function(r) {
            return r.text();
          }).then(function(j) {            
            const htmlDocument = new DOMParser().parseFromString(j, 'text/html');
            if (qty) {
              var nQ = qty.getAttribute('id'),
                  sectionQ = htmlDocument.querySelector('#' + nQ);              
              if (!sectionQ) {
                return;
              }
              qty.innerHTML = sectionQ.innerHTML;
              new Quantity(qty.querySelector('[data-quantity]'));
              if (qty_vol) {
              var nQV = qty_vol.getAttribute('id'),
                  sectionQV = htmlDocument.querySelector('#' + nQV);
                qty_vol.$el = qty_vol;                
                if (qty.querySelector('[data-quantity]').getAttribute('data-qty-vol') == 'false') {
                  Revealer('hide', force, qty_vol);                  
                  setTimeout(function () {                    
                    qty_vol.classList.remove('visible');
                    qty_vol.innerHTML = sectionQV.innerHTML;
                  }, 500);
                } else {
                  qty_vol.innerHTML = sectionQV.innerHTML;
                  Revealer('show', force, qty_vol);
                }                
              }
            }            
            vMF.forEach(function(v) {
              var nM = v.getAttribute('id'),
                  section = htmlDocument.querySelector('#' + nM);
              if (!section) {
                return;
              }
              v.innerHTML = section.innerHTML;
            });        
          }).catch(function(err) {
            console.error('!: ' + err)
          });
        };
      }
    }, {
      key: "_onVariantChange",
      value: function _onVariantChange(_ref2, force) {
        var _this = this,
            variant = _ref2.variant,
            firstLoad = _ref2.firstLoad,
            isProduct = _ref2.isProduct,
            sku = this.$el.querySelector('.product-sku'),
            price = this.$el.querySelector('.product-details-price'),
            inv = this.$el.querySelector('.product-inventory'),
            btn = this.$el.querySelector('.product-form-inline-atc-button');
        theme.variant = variant;
        if (firstLoad == true || isProduct && !isProduct(this.data.product)) {
          return;
        }
        if (this.productGallery && this.navigation) {
          this.productGallery.selectMediaByVariant(variant);
        }
        if (sku) {          
          this.$sku = this.$productInfo.querySelector('[data-variant-sku]');
          this.$sku.$el = this.$sku;
          this.$skuInclude = this.$sku.getAttribute('data-sku-include');
          this.$skuText = this.$sku.getAttribute('data-sku-text');
          this.$barcodeInclude = this.$sku.getAttribute('data-barcode-include');
          this.$barcodeText = this.$sku.getAttribute('data-barcode-text');
          if (variant.sku && this.$skuInclude == 'true' || variant.barcode && this.$barcodeInclude == 'true') {
            if (variant.sku && this.$skuInclude == 'true' && variant.barcode && this.$barcodeInclude == 'true') {            
              this.$sku.innerHTML = '<span class="content-block"><span><span>' + this.$skuText + '</span>' + variant.sku + '</span><span><span>' + this.$barcodeText + '</span>' + variant.barcode + '</span></span>';
            } else if (variant.sku && this.$skuInclude == 'true') {            
              this.$sku.innerHTML = '<span class="content-block"><span><span>' + this.$skuText + '</span>' + variant.sku + '</span></span>';
            } else if (variant.barcode && this.$barcodeInclude == 'true') {            
              this.$sku.innerHTML = '<span class="content-block"><span><span>' + this.$barcodeText + '</span>' + variant.barcode + '</span></span>';
            }
            Revealer('show', force, this.$sku);
          } else {
            this.$sku.innerHTML = '<span class="content-block">&nbsp</span>';
            Revealer('hide', force, this.$sku);
          }
        }
        if (price) {
          var $unitPrice = this.$productInfo.querySelector('[data-unit-price]'),
              $unitPriceAmount = $unitPrice.querySelector('[data-unit-price-amount]'),
              $unitPriceMeasure = $unitPrice.querySelector('[data-unit-price-measure]'),            
              $price = this.$productInfo.querySelector('[data-variant-price]'),
              $priceTextReg = $price.getAttribute('data-regular'),
              $priceTextSale = $price.getAttribute('data-sale'),
              $priceLabel = $price.querySelector('.visually-hidden');
              $compareAtPrice = this.$productInfo.querySelector('[data-variant-compare-at-price]'),            
              $taxLine = this.$productInfo.querySelector('[data-tax-line]');
          $price.querySelector('.money').textContent = Shopify.formatMoney(variant.price, window.theme.moneyFormat);
          if (variant.compare_at_price && variant.compare_at_price !== variant.price) {
            $compareAtPrice.classList.remove('money-compare-at-hidden');
            $compareAtPrice.querySelector('.money').textContent = Shopify.formatMoney(variant.compare_at_price, window.theme.moneyFormat);
            $priceLabel.textContent = $priceTextSale;
          } else {
            $compareAtPrice.classList.add('money-compare-at-hidden');
            $priceLabel.textContent = $priceTextReg;
          }
          if ($taxLine) {
            $taxLine.$el = $taxLine;
            if (variant.taxable) {
              $taxLine.classList.remove('hidden');
              Revealer('show', force, $taxLine);
            } else {
              Revealer('hide', force, $taxLine);
              setTimeout(function () {
                $taxLine.classList.add('hidden');
              }, 500);
            }
          }
          if (variant.unit_price) {
            if ($unitPriceAmount) {
              $unitPriceAmount.textContent = Shopify.formatMoney(variant.unit_price, window.theme.moneyFormat);
            }
            if ($unitPriceMeasure) {
              if (variant.unit_price_measurement.reference_value !== 1) {
                $unitPriceMeasure.textContent = variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
              } else {
                $unitPriceMeasure.textContent = variant.unit_price_measurement.reference_unit;
              }
            }
            $unitPrice.$el = $unitPrice;
            $unitPrice.classList.remove('hidden');
            Revealer('show', force, $unitPrice);
          } else {
            $unitPrice.$el = $unitPrice;
            Revealer('hide', force, $unitPrice);
            setTimeout(function () {
              $unitPrice.classList.add('hidden');
            }, 500);
          }
        }
        if (inv) {
          var $invMin = inv.getAttribute('data-inv'),
              $invInv = parseInt(this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inv')),
              $invText = inv.querySelector('.inventory-availability-text'),
              $invMsg1 = this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inv-msg-1'),
              $invMsg2 = this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inv-msg-2'),
              $invPol = this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inv-pol'),
              $iconAvail = inv.querySelector('.inventory-icon.available'),
              $iconUnAvail = inv.querySelector('.inventory-icon.unavailable'),            
              $trans = inv.querySelector('.inventory-transfer'),
              $transConfirm = this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inc-msg'),
              $transText = inv.querySelector('.inventory-transfer-text'),
              $transMsg = this.$variantDetails.options[this.$variantDetails.selectedIndex].getAttribute('data-inc-msg');
          if (variant.available) {
            if (variant.inventory_management && $invInv > 0) {
              if ($invInv < $invMin) {
                if ($invPol == 'deny') {
                  $invText.textContent = $invMsg1
                } else {
                  $invText.textContent = $invMsg2
                }
              } else {
                $invText.textContent = this.data.text.product_in_stock;
              }
            } else {
              $invText.textContent = this.data.text.product_in_stock;                    
            };
            $iconAvail.classList.remove('hidden');
            $iconUnAvail.classList.add('hidden');
          } else {
            $invText.textContent = this.data.text.product_out_of_stock;
            $iconUnAvail.classList.remove('hidden');  
            $iconAvail.classList.add('hidden');          
          };
          if ($transConfirm) {
            $trans.classList.remove('hidden');
            $transText.textContent = $transMsg;
          } else {
            $trans.classList.add('hidden');
          }
        }
        if (btn) {
          btn.disabled = !variant.available;
          this.$el.querySelector('[data-product-inline-atc-text]').textContent = variant.available ? this.data.text.product_available : this.data.text.product_unavailable;
        }
        this._onVariantChangeFetch(variant);        
      }
    }, {
      key: "_showTooltip",
      value: function _showTooltip(t) {
        var components_Modal = (new Modal()),
            header = '<h4 id="modal__heading">' + t.getAttribute('title') + '</h4>',
            content = '<div class="toppad">' + JSON.parse(document.getElementById(t.getAttribute('data-id')).innerText) + '</div>';
        components_Modal.open({
          header: header,
          content: content
        });
      }
    }, {
      key: "_showAlert",
      value: function _showAlert(message, force) {
        var _this2 = this;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (type) {
          this.alertClassName = "product-alert-".concat(type);
          this.$alert.classList.add(this.alertClassName);
        }
        var $message = this.$alert.querySelector('.product-alert-message');        
        $message.innerHTML = '';        
        if (typeof message.description === 'object') {
          var $message_text = message.message;
        } else {
          var $message_text = message.description;
        }
        $message.innerHTML = $message_text;
        this.$alert.classList.add('visible');
        this.alertTimeout = setTimeout(function () {
          _this2._hideAlert();
        }, 5000);
      }
    }, {
      key: "_hideAlert",
      value: function _hideAlert(force) {
        clearTimeout(this.alertTimeout);
        if (this.$alert) {
          this.$alert.classList.remove(this.alertClassName);
          this.$alert.classList.remove('visible');
          this.alertClassName = null;
          var $message = this.$alert.querySelector('.product-alert-message');
          this.alertTimeout = setTimeout(function () {
            $message.innerHTML = '';
          }, 250);
        }
      }
    }]);
    return ProductDetails;
  }();
  function Product_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Product_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Product_createClass(Constructor, protoProps, staticProps) { if (protoProps) Product_defineProperties(Constructor.prototype, protoProps); if (staticProps) Product_defineProperties(Constructor, staticProps); return Constructor; }
  function Product(section) {
    Product_classCallCheck(this, Product);
    this.$el = section.el;
    this.section = section;
    if (this.section.data.product === null) {
      return;
    }    
    this.productDetails = new ProductDetails({
      $el: this.$el,
      section: section
    });
    var pC = document.getElementById('product-contact-' + section.id);
    if (pC) {
      pC.querySelector('button').onclick = function(){        
        var components_Modal = (new Modal()),
            header = '<h4 id="modal__heading">' + pC.querySelector('button').getAttribute('title') + '</h4>',
            content = '<div class="toppad">' + JSON.parse(pC.querySelector('.product-contact').innerText) + '</div>';
        components_Modal.open({
          header: header,
          content: content
        });        
      }      
    }    
    var pID = document.getElementById('product-select-' + section.id),
        pJ = JSON.parse(document.getElementById('ProductJson-' + section.id).innerHTML);
    function RecV() {
      const pA = [];
      let jR,
          jRA,
          jRAS;
      const nP = 16;
      const pD = {
        pID: pJ.product.id
      } 
      pA.push(pD);
      const cpT = pD.pID; 
      const pDS = JSON.stringify(pA);
      const lD = localStorage.getItem('rVP');
      if(lD == null) { 
        localStorage.setItem('rVP', pDS);
      } else if (lD != null ) {
        const opD = localStorage.getItem('rVP');
        const cpD = (opD.match(/pID/g) || []).length;
        const rP =  opD.includes(cpT);
        if (cpD < nP && rP == false) {
          jR = JSON.parse(opD);
          jRA = jR.concat(pA);
          jRAS = JSON.stringify(jRA);
          localStorage.setItem('rVP', jRAS);
        }
        else if (cpD >= nP && rP == false) {
          jR = JSON.parse(opD);
          jR.shift();
          jRA = jR.concat(pA);
          jRA =  JSON.stringify(jRA);
          localStorage.setItem('rVP', jRA);
        }
      }
    }
    RecV();
  }
  Product_createClass(Product, [{
    key: "onSectionMessage",
    value: function onSectionMessage(name, data) {
      if (name === 'product:add-to-cart') {
        this.productDetails._onVariantChangeFetch(theme.variant);
      }
      if (name === 'cart:update') {
        this.productDetails._onVariantChangeFetch(theme.variant);
      }
      if (this.productDetails.productGallery) {
        this.productDetails.productGallery.onSectionMessage(name, data);
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.productDetails) this.productDetails.unload();
    }
  }]);
  return Product;
})();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Product(section);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Product(section);
    });
    sectionContainer.classList.add('ignore');
  }
})