CartCart = (function() {
  function CartCart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function CartCart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function CartCart_createClass(Constructor, protoProps, staticProps) { if (protoProps) CartCart_defineProperties(Constructor.prototype, protoProps); if (staticProps) CartCart_defineProperties(Constructor, staticProps); return Constructor; }
  function CartCart(section, force) {
    var _this = this;
    CartCart_classCallCheck(this, CartCart);
    this.$el = section.el;
    this.data = section.data;
    this.events = []; 
    this.$shippingCalc = this.$el.querySelector('section').getAttribute('data-calc');
    this.$shippingFieldsInline = this.$el.querySelector('.shipping-calculator-inline .input-wrapper');
    if (this.$shippingFieldsInline) {
      this.$shippingFieldsInline.$el = this.$shippingFieldsInline;
    }
    ContentSlide(this.$el, force);
    if(this.$shippingCalc == 'true') {
      if (Shopify) {          
        new Shopify.CountryProvinceSelector(
          'address_country',
          'address_province',
          {
            hideElement: 'address_province_container'
          }
        );
      }      
      var responseMsg = document.getElementById('wrapper-response');
      this.events.push(
        this.$el.querySelector('[data-shipping-calculator-submit]').onclick = function(event){
          responseMsg.$el = responseMsg;
          if (responseMsg.hasAttribute('data-revealer-visible')) {
            Revealer('toggle', force, responseMsg);
            setTimeout(function () {            
              _this._calculateShipping(responseMsg);
            }, 500);
          } else {
            _this._calculateShipping(responseMsg);
          }
        }
      )
      this.events.push(
        this.$el.querySelector('#address_zip').onkeydown = function(event) {          
          if (event.keyCode === 13) {
            event.preventDefault();
            _this._calculateShipping(responseMsg)
          } else {
            return;
          }
        }
      )
    };  
    Cart.addCart(section, section.postMessage);
  };
  CartCart_createClass(CartCart, [{
    key: "_calculateShipping",
    value: function _calculateShipping(r, force) {
      var _this2 = this;
      var shippingAddress = {};
      shippingAddress.zip = this.$el.querySelector('#address_zip').value || '';
      shippingAddress.country = this.$el.querySelector('#address_country').value || '';
      shippingAddress.province = this.$el.querySelector('#address_province').value || '';
      var shippingBtn = this.$el.querySelector('[data-shipping-calculator-submit]');
      r.$el = r;
      if (shippingAddress.zip.length > 0) {
        shippingBtn.classList.add('loading');
        var url = "".concat(window.theme.routes.cart_url, "/shipping_rates.json?shipping_address%5Bzip%5D=").concat(shippingAddress.zip, "&shipping_address%5Bcountry%5D=").concat(shippingAddress.country, "&shipping_address%5Bprovince%5D=").concat(shippingAddress.province);
        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }).then(function(r) {
          return r.json();
        }).then(function(d) {
          if (d.zip && d.zip.length > 0) {
            shippingBtn.classList.remove('loading');
            return _this2._handleErrors(d);
          } else {
            var rates = d.shipping_rates;
            var address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.province, ", ").concat(shippingAddress.country);
            if (!shippingAddress.province.length) {
              address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.country);
            }
            if (!shippingAddress.zip.length) {
              address = "".concat(shippingAddress.province, ", ").concat(shippingAddress.country);
            }
            if (!shippingAddress.province.length || !shippingAddress.zip.length) {
              address = shippingAddress.country;
            }
            r.innerHTML = ''
            r.innerHTML = '<div class="shipping-calculator-response"><p class="shipping-rates-feedback" id="shipping-rates-feedback"></p><ul class="shipping-rates"></ul></div>'
            var ratesFeedback = _this2.$el.querySelector('.shipping-rates-feedback');
            if (rates && rates.length > 1) {
              var firstRate = Shopify.formatMoney(rates[0].price, window.theme.moneyFormat);
              var multipleShippingRates = window.theme.shippingCalcMultiRates.replace('--address--', address).replace('--number_of_rates--', rates.length).replace('--rate--', "<span class='money'>".concat(firstRate, "</span>"));
              ratesFeedback.innerHTML = multipleShippingRates;
            } else if (rates && rates.length === 1) {
              var oneShippingRate = window.theme.shippingCalcOneRate.replace('--address--', address);
              ratesFeedback.innerHTML = oneShippingRate;
            } else {
              ratesFeedback.innerHTML = window.theme.shippingCalcNoRates;
            }
            var $cartShippingRates = _this2.$el.querySelector('.shipping-rates');
            for (var i = 0; i < rates.length; i++) {
              var rate = rates[i];
              var price = Shopify.formatMoney(rate.price, window.theme.moneyFormat);
              if (rate.delivery_date == null) {                
                if (!rate.delivery_days.length) {
                  var rateValues = window.theme.shippingCalcLocDev.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>'));            
                } else {
                  var date = rate.delivery_days.toString().replace(/,/g, '-'),
                      rateValues = window.theme.shippingCalcBusDays.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>')).replace('--rate_delivery--', '<span>'.concat(date, '</span>'));
                }
              } else {
                var event = new Date(rate.delivery_date),
                    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
                    date = event.toLocaleDateString(window.theme.language, options),
                    rateValues = window.theme.shippingCalcRateValues.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>')).replace('--rate_delivery--', '<span>'.concat(date, '</span>'));
              }
              var li = document.createElement('li');
              li.innerHTML = rateValues;
              $cartShippingRates.appendChild(li);
            }
            shippingBtn.classList.remove('loading');
            Revealer('show', force, r);
            window.setTimeout(function() {
              if (theme.minicart) {
                r.closest('.blocks-button-content').scrollTo({
                  top: r.offsetTop,
                  behavior: "smooth"
                });                  
              } else {
                var s = r.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({top:s-document.selectors.sht, behavior: 'smooth'});              
              }
            }, 500);
          }
        });
      } else {
        return _this2._handleErrors();
      }
    }
  }, {
    key: "_handleErrors",
    value: function _handleErrors(errors, force) {
      if (errors) {
        var zipMessage = window.theme.shippingCalcErrorMessage.replace('--error_message--', errors.zip);
      } else {
        var zipMessage = window.theme.shippingCalcErrorMessageZip;
      }
      this.$el.querySelector('.shipping-calculator-response').innerHTML = '';
      this.$el.querySelector('.shipping-calculator-response').innerHTML = "<p class=\"shipping-rates-feedback\" id=\"shipping-rates-feedback\">".concat(zipMessage, "</p>");
      var responseMsg = document.getElementById('wrapper-response');
      responseMsg.$el = responseMsg;
      Revealer('show', force, responseMsg);
    }
  }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        if (name === 'cart:refresh') {
          Cart.update();
        }
      }
    }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events = [];
    }
  }]);
  return CartCart;
})();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'cart';
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Slider(sectionContainer, section);
    });
    sectionContainer.classList.add('ignore');
  }
})