Customer = (function() {
  let customer = document.getElementById('customer');
  if(!customer) {
    return;
  };  
  let rEF = document.getElementById('recover-email-form');
  var $customerAddresses = customer.querySelectorAll('[data-address-id]');
  if ($customerAddresses) {
    addressTemplate($customerAddresses);
  }  
  function addressTemplate($customerAddresses, force) {
    var $addressForm = customer.querySelector('.account-address-forms');
    var $addressEditLinks = customer.querySelectorAll('[data-edit-address]');
    if ($addressEditLinks.length) {      
      $addressEditLinks.forEach(function(a){      
        a.onclick = function(event) {
          var itemId = this.getAttribute('data-edit-address');
          customer.$options = customer.querySelector('.account-options-slide.visible');
          customer.$options.$el = customer.$options;
          customer.$recovery = customer.querySelector("[data-address-id=\"".concat(itemId, "\"]"));
          customer.$recovery.$el = customer.$recovery;
          let height = customer.$options.scrollHeight;
          customer.$options.style.setProperty('--max-height', height + 'px');
          customer.$options.classList.toggle('visible');
          customer.$recovery.classList.toggle('visible');
          let s = document.getElementById('account-address-forms').getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({top:s-document.selectors.sht}); 
          setTimeout(function() {
            $addressForm.querySelector('.visible input[type=text]:first-of-type').focus();
          }, 250);
        };
      });
    }
    var $addressDeleteLinks = customer.querySelectorAll('[data-delete-address]');
    if ($addressDeleteLinks.length) {
      $addressDeleteLinks.forEach(function(a){      
        a.onclick = function(event) {
          var aB = document.getElementById('ajaxBusy'),
              t = a.getAttribute('data-delete-address'),
              m = a.getAttribute('data-confirm');
          if (a.classList.contains('edit_address_confirm')) {
            Shopify.postLink(t, {
              parameters: { _method: 'delete' }
            });
            aB.style.display = 'block';
          } else {
            a.textContent = m;
            a.classList.add('edit_address_confirm','error-text');
          }
        };
      });
    }
    $customerAddresses.forEach(function provincePopulator(c) {
      var id = c.getAttribute('data-address-id');
      new Shopify.CountryProvinceSelector('customer-addr-'.concat(id, '-country'), 'customer-addr-'.concat(id, '-province'), {
        hideElement: 'address-province-container-'.concat(id)
      });
    });
  }  
  if (rEF) {
    var rE = document.getElementById('recover-email'),
        rEB = document.getElementById('recover-email-button');
    function recoverSubmit(e) {
      e.preventDefault();
      rE.focus();
      setTimeout(function () {
        rEF.submit();
      }, 100);      
    }
    rEB.ontouchstart = function(e){
      recoverSubmit(e);
    };
  }  
})();