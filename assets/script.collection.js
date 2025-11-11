Collection = (function() {
  function Select_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Select_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Select_createClass(Constructor, protoProps, staticProps) { if (protoProps) Select_defineProperties(Constructor.prototype, protoProps); if (staticProps) Select_defineProperties(Constructor, staticProps); return Constructor; }
  var Select = function () {
    function Select(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this = this;
      Select_classCallCheck(this, Select);
      this.callback = options.callback || false;
      this.label = el.querySelector('[data-select-label]');
      this.select = el.querySelector('[data-select]');
      this.onChange = this._onChange.bind(this);
      this.select.addEventListener('change', this.onChange);
      this.select.onkeyup = function (e) {
        switch (e.key) {
          case 'Tab':
            _this.select.parentNode.classList.add('focused');
        }
      };
      this.select.onfocus = function(s){
        _this.select.parentNode.classList.add('focused');        
      };
      this.select.onblur = function(s){
        _this.select.parentNode.classList.remove('focused');        
      };      
    }
    Select_createClass(Select, [{
      key: "_onChange",
      value: function _onChange() {
      var text = this.select[this.select.selectedIndex].text;
        var value = this.select[this.select.selectedIndex].value;
        this.label.innerText = text;
        if (this.callback) {
          this.callback(value);
        }
      }
    }, {
      key: "unload",
      value: function unload() {
        this.select.removeEventListener('change', this.onChange);
      }
    }]);
    return Select;
  }();
  function Collection_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = Collection_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
  function Collection_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Collection_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Collection_arrayLikeToArray(o, minLen); }
  function Collection_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function Collection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Collection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Collection_createClass(Constructor, protoProps, staticProps) { if (protoProps) Collection_defineProperties(Constructor.prototype, protoProps); if (staticProps) Collection_defineProperties(Constructor, staticProps); return Constructor; }
  function Collection(section,force) {
    var _this = this;
    Collection_classCallCheck(this, Collection);
    window.localStorage.removeItem('refine');
    this.section = section;
    this.$el = section.el;
    this.el = section.el;
    var data = document.getElementById('collection');    
    this.data = section.data;    
    this.data.collection_handle = data.getAttribute('data-collection-handle');
    this.data.sort_by = data.getAttribute('data-sort-by');
    this.data.pagination_method = data.getAttribute('data-pagination-method');
    this.data.products_per_page = JSON.parse(data.getAttribute('data-products-per-page'));
    this.data.total_products = JSON.parse(data.getAttribute('data-total-products'));
    this.cF = document.getElementById('filters');
    this.closeButton = this.el.querySelector('[data-look-close]');    
    this.$clearButton = this.el.querySelector('[data-clear-tags]');    
    this.onSortByChange = this._onSortByChange.bind(this);
    this._infiniteScrollHandler = this._infiniteScrollHandler.bind(this);
    this.buttonFilter = section.el.querySelector('[data-filter]');
    this.selectWrapperSortBy = section.el.querySelector('[data-select-wrapper-sortby]');    
    this.cG = document.getElementById('collection-grid');
    this.events = new Events();    
    if (this.buttonFilter) {
      this._filterButton(this.buttonFilter);
      this._onRemoveChange();
      this._onFilterChange();
      this._onPriceChange();    
      ContentSlide(this.$el, force);
    }
    if (this.selectWrapperSortBy) {
      this.selectSortBy = new Select(this.selectWrapperSortBy, {
        callback: this.onSortByChange
      });
    }
    if (section.type == 'search') {
      this._searchLoad();
    }    
    this._infiniteScrollLoad();
    this._setSortByQueryParameters();
    this._bindEvents();
  };
  Collection_createClass(Collection, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      this.$infinite = this.el.querySelector('[data-infinite-scroll-button]');
      if (this.enableInfiniteScroll && this.$infinite) {
        this.$infinite.addEventListener('click', this._infiniteScrollHandler);
      }
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      if (this.enableInfiniteScroll) {
        this.showMoreButton.removeEventListener('click', this._infiniteScrollHandler);
      }
    }
  }, {
    key: "_filterButton",
    value: function _filterButton(b, force) {
      var _this = this;      
      b.onclick = function(){ 
        _this.open(b);
      }      
      this.trigger = null;
      this.events.register(this.closeButton, 'click', function () {
        return _this.close();
      });
      this.background_body = document.querySelectorAll('[data-body-slide-background]');      
      for (let i = 0; i < this.background_body.length; i++) {
        this.events.register(this.background_body[i], 'click', function () {
          return _this.close();
        });
      };      
    }
  }, {
    key: "open",
    value: function open(b) {
      this.trigger = b;      
      html.classList.add('body-slide-open', 'filter-slide-open');      
      this.cF.closest('.shopify-section').classList.add('section-open');      
      this.cF.hidden = false;
      this.cF.setAttribute('aria-hidden','false');      
      trapFocus(this.cF);
    }
  }, {
    key: "close",
    value: function close() {      
      var _this = this;
      html.classList.remove('body-slide-open', 'filter-slide-open');
      if (this.cF) {
        this.cF.closest('.shopify-section').classList.remove('section-open');        
        removeTrapFocus(this.cF);  
        setTimeout(function() {
          _this.cF.hidden = true;      
          _this.cF.setAttribute('aria-hidden','true');
          if (_this.trigger) {
            _this.trigger.focus();
          }
        }, 250);
      };
    }
  }, {
    key: "ajaxLoadPage",
    value: function ajaxLoadPage(url,q,s,force) {      
      var _this = this,
          aB = document.getElementById('ajaxBusy'),
          fC = document.getElementById('filters-container'),          
          cG = document.getElementById('collection-grid'),        
          srT = this.$el.querySelector('.search-results-tabs'),
          nB = this.$el.querySelector('nav.breadcrumb'),        
          i = document.getElementById('infinite'),        
          m = document.getElementById('search-title');      
          p = document.getElementById('pagination');
      aB.style.display = 'block';
      removeTrapFocus(this.cF);      
      if (s) {
        var c = this.$el.querySelector('.collection-filter-form')
        if (c) {
          c.$el = c;
          Revealer('hide', force, c);
        }
      } else if (!s && this.cF) {
        let height = this.cF.scrollHeight;
        this.cF.style.setProperty('--max-height', height + 'px');
      }
      fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var NfC = htmlDocument.documentElement.querySelector('#filters-container'),
            NcG = htmlDocument.documentElement.querySelector('#collection-grid'),
            NnB = htmlDocument.documentElement.querySelector('nav.breadcrumb'),          
            Ni = htmlDocument.documentElement.querySelector('#infinite'),
            Np = htmlDocument.documentElement.querySelector('#pagination'),          
            Nm = htmlDocument.documentElement.querySelector('#search-title');        
          if (this.cF && this.cF.getAttribute('aria-hidden') === 'false') {
            fC.innerHTML = NfC.innerHTML;
            trapFocus(this.cF);
            ContentSlide(this.$el, force);
          }
        cG.replaceWith(NcG);
        if (srT) {
          srT.remove();
        }
        if (nB) {
          nB.replaceWith(NnB);
        }
        if (i) {
          i.replaceWith(Ni);
        }        
        if (p) {
          p.replaceWith(Np);
        }        
        if (m) {
          m.replaceWith(Nm);
        }
        if (s && q) {       
          document.getElementById('collection').setAttribute('data-sort-by', q);
        }
        if (this.cF) {
          this._filterButton(this.buttonFilter);
          this._onRemoveChange();
          this._onFilterChange();
          this._onPriceChange();
          this._filterValues();
        };
        sectionObserver();
        if (window.theme.swatches) {
          var $options = document.querySelectorAll('.product-item [data-product-option]');
          Swatches($options, 'loop')
        }
        if (window.theme.quick) {
          new Quick();
        }
        var sP = document.getElementById('search-products'); 	
        if (sP && sP.classList.contains('visible')) {
          setTimeout(function () {
            let height = sP.scrollHeight;
            sP.style.setProperty('--max-height', height + 'px');
          }, 100);
        }
        this._infiniteScrollLoad();
        this._bindEvents();
        history.replaceState({
          page: url
        }, url, url);
        aB.style.display = 'none';
      }).catch(function (err) {
        console.log('!: ' + err);
      });
    }
  }, {
    key: "_setSortByQueryParameters",
    value: function _setSortByQueryParameters() {
      Shopify.queryParams = {};
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('='); 
          if (aKeyValue.length > 1 && aKeyValue[0] != 'page') {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          } else if (aKeyValue[0] === 'page') {
            this.currentPage = parseInt(aKeyValue[1]);
          }
        }
      }
    }
  }, {
    key: "_applySortByAndRefine",
    value: function _applySortByAndRefine(s) {
      var u = new URL(window.location),
          params = u.searchParams,
          mnV = document.getElementById('price-min-slide'),
          mxV = document.getElementById('price-max-slide');      
      if (s && Shopify.queryParams.sort_by) {
        params.set('sort_by', Shopify.queryParams.sort_by);
        var q = Shopify.queryParams.sort_by;
        this.data.sort_by = q;
      } else {
        var q = this.data.sort_by;
      }      
      if (mnV && mxV) {
        var q = q + '&filter.v.price.gte=' + mnV.value + '&filter.v.price.lte=' + mxV.value;
      }      
      if (window.localStorage.getItem('refine')) {
        var params = window.localStorage.getItem('refine') + '&sort_by=' + q;
      } else if (!s) {
        var params = '?sort_by=' + q;
      }
      u.search = params.toString();      
      var url = u.toString();
      this.ajaxLoadPage(url,q,s);
    }
  }, {
    key: "_filterValues",
    value: function _filterValues() {
      function createSearchParams(form) {
        const formData = new FormData(form);  
        return new URLSearchParams(formData).toString();
      }
      const check = this.cF.querySelectorAll('input[type=checkbox]');
      const check_empty = [...check].every((el) => {
        return !el.checked
      });
      if (this.data.collection_handle == null) {
        window.localStorage.setItem('refine', createSearchParams(document.getElementById('filters-form')));
      }  else {
        if (check_empty) {
          window.localStorage.removeItem('refine')
        } else {
          window.localStorage.setItem('refine', createSearchParams(document.getElementById('filters-form')));
        }
      }
    }
  }, {
    key: "_onRemoveChange",
    value: function _onRemoveChange(value) {
      var _this = this;
      this.cF.querySelectorAll('[data-filter-option]').forEach(function(i) {
        i.onclick = function(e){
          e.preventDefault();
          var url = i.getAttribute('href');
          _this.ajaxLoadPage(url);
        }
      });      
    }
  }, {
    key: "_onFilterChange",
    value: function _onFilterChange(value) {
      var _this = this;
      this.cF.querySelectorAll('input[type=checkbox]').forEach(function(i) {
        i.onclick = function(){
          _this._filterValues();
          let isSort = false;
          _this._applySortByAndRefine(isSort);
        }
      });
    }
  }, {
    key: "_onPriceChange",
    value: function _onPriceChange(value) {
      var _this = this,
          mnV = document.getElementById('price-min-slide'),
          mxV = document.getElementById('price-max-slide'),
          pIR = this.cF.querySelectorAll('[type="range"]');
      if (mnV && mxV) {
        var rtl = html.getAttribute('dir');
        mnV.oninput = function () {          
          this.value=Math.min(this.value,this.parentNode.childNodes[5].value-1);
          var value=(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.value)-(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.min);
          var children = this.parentNode.childNodes[1].childNodes;children[1].style.width=value+'%';
          if (rtl == 'ltr') {
            children[5].style.left=value+'%';children[7].style.left=value+'%';         
          } else {
            children[5].style.right=value+'%';children[7].style.right=value+'%';
          }          
          var curr = new Intl.NumberFormat(html.getAttribute('lang'), { style: 'currency', currency: html.getAttribute('data-currency'), minimumFractionDigits: 0, }).format(this.value);  
          document.getElementById('price-min-input').textContent=curr;          
        }
        mxV.oninput = function () {
          this.value=Math.max(this.value,this.parentNode.childNodes[3].value-(-1));
          var value=(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.value)-(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.min);
          var children = this.parentNode.childNodes[1].childNodes;children[3].style.width=(100-value)+'%';
          if (rtl == 'ltr') {
            children[5].style.right=(100-value)+'%';
            children[9].style.left=value+'%';
          } else {
            children[5].style.left=(100-value)+'%';
            children[9].style.right=value+'%';
          }          
          var curr = new Intl.NumberFormat(html.getAttribute('lang'), { style: 'currency', currency: html.getAttribute('data-currency'), minimumFractionDigits: 0, }).format(this.value);          
          document.getElementById('price-max-span').textContent=curr;          
        }        
      }      
      function PriceChangeType() {
        _this._filterValues();
        let isSort = false;
        _this._applySortByAndRefine(isSort);
      }
      pIR.forEach(function(p) {        
        p.onkeyup = function (e) {
          switch (e.key) {
            case 'ArrowLeft':
              PriceChangeType();
            case 'ArrowRight':
              PriceChangeType();
          }
        };
        p.onmouseup = function () {
          PriceChangeType();
        }
        p.ontouchend = function () {
          PriceChangeType();
        }
      });      
    }
  }, {
    key: "_onSortByChange",
    value: function _onSortByChange(value) {
      Shopify.queryParams.sort_by = value;
      let isSort = true;
      this._applySortByAndRefine(isSort);
    }
  }, {
    key: "_infiniteScrollLoad",
    value: function _infiniteScrollLoad() {
      var _this = this;
      if (this.data.pagination_method.indexOf('infinite_scroll') > -1 && this.data.products_per_page < this.data.total_products && window.location.search.indexOf('page') === -1) {
        this.loadMoreTarget = this.el.querySelector('[data-infinite-scroll-target]');
        this.showMoreButton = this.el.querySelector('[data-infinite-scroll-button]');
        if (this.showMoreButton) {
          this.showMoreButton.style.display = 'block'; 
        }
        this.currentPage = 1;
        this.fullCollectionLoaded = false;
        this.enableInfiniteScroll = true;
        if (this.data.pagination_method === 'infinite_scroll') {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.intersectionRatio > 0) {
                _this.scrollTargetVisible = true;
                _this._infiniteScroll();
              } else {
                _this.scrollTargetVisible = false;
              }
            });
          });
          observer.observe(this.loadMoreTarget);
        }
      }
    }
  }, {
    key: "_infiniteScrollHandler",
    value: function _infiniteScrollHandler() {
      this._infiniteScroll();
    }
  }, {
    key: "_infiniteScroll",
    value: function _infiniteScroll() {
      var _this3 = this;
      var autoScrollCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this.fullCollectionLoaded || autoScrollCount > 2) {
        return;
      }
      var currentPage = "page=".concat(this.currentPage);
      this.currentPage++;
      var nextPage = "page=".concat(this.currentPage);
      var url = "".concat(window.location.pathname).concat(window.location.search);
      if (window.location.search.indexOf('page') > -1) {
        url = url.replace(currentPage, nextPage);
      } else if (window.location.search.indexOf('?') > -1) {
        url = "".concat(url, "&").concat(nextPage);
      } else {
        url = "".concat(url, "?").concat(nextPage);
      }
      if (this.showMoreButton) {
        this.showMoreButton.classList.add('loading');
      };
      fetch(url)
      .then(response => response.text())
      .then(data => {   
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var $products = htmlDocument.querySelectorAll('[data-product-item]');
        for (var i = 0; i < $products.length; i++) {
          var $productGridItem = $products[i]; 
          _this3.$el.querySelector('#collection-grid .section-card-rows').appendChild($productGridItem);
          $products[0].classList.add('skip');
        }
        var $allProducts = _this3.$el.querySelectorAll('[data-product-item]');
        if ($allProducts.length >= _this3.data.total_products) {
          _this3.fullCollectionLoaded = true;
          if (_this3.showMoreButton) {
            _this3.showMoreButton.style.display = 'none';
          };
        }
        sectionObserver();
        if (window.theme.swatches) {
          var $options = document.querySelectorAll('.product-item [data-product-option]');
          Swatches($options, 'loop')
        }
        if (window.theme.quick) {
          new Quick();
        }        
        if (_this3.showMoreButton) {
          _this3.showMoreButton.classList.remove('loading');
        };
        setTimeout(function () {
          if (_this3.scrollTargetVisible) {
            _this3._infiniteScroll(autoScrollCount + 1);
          }
        }, 200);        
      }).catch(function (err) {
        console.log('!: ' + err);
      });
    }
  }, {
    key: "_searchLoad",
    value: function _searchLoad() {
      var _this = this;
      this.$tabs = this.section.el.querySelectorAll('.search-results-tab');
      this.$groups = this.section.el.querySelectorAll('.search-results-group');
      this.$tabs.forEach(function(t) {
        function slideLoad() {          
          let f = document.getElementById(t.getAttribute('data-id'));
          if (f.getAttribute('data-loaded') === 'true') {
            return;
          }
          let height = f.scrollHeight;
          f.setAttribute('data-max-height', height);
          f.setAttribute('data-loaded', true);
          _this.cG.classList.remove('first-visible');
          let new_height = _this.cG.querySelector('.search-results-group.visible').scrollHeight;
          _this.cG.style.setProperty('--max-height', new_height + 'px');
        }
        t.onmouseenter = function(){
          slideLoad();
        };
        t.ontouchstart = function(){
          slideLoad();
        };        
        t.onfocus = (event) => {
          slideLoad();
        };
        t.onclick = function(event){
          _this._searchTab(event.currentTarget);
        };
      });
    }
  }, {
    key: "_searchTab",
    value: function _searchTab(el,force) {
      this.section.el.querySelector('.search-results-tab.search-results-tab-selected').parentNode.classList.remove('collection-sortby-option-selected');
      this.section.el.querySelector('.search-results-tab.search-results-tab-selected').classList.remove('search-results-tab-selected');
      el.parentNode.classList.add('collection-sortby-option-selected'); 
      el.classList.add('search-results-tab-selected');
      var o = this.section.el.querySelector('.search-results-group.selected');
      var n = document.getElementById(el.getAttribute('data-id')); 
      let height = n.getAttribute('data-max-height');
      this.cG.style.setProperty('--max-height', height + 'px');
      o.classList.remove('selected', 'visible');
      n.classList.add('selected', 'visible');
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name, data, force) {
      if (this.menu && name === 'header-minicart:open') {
        Revealer('hide', force, this.menu);
      }
      if (this.menu && name === 'header-minicart:close') {
        Revealer('show', force, this.menu);
      }      
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.close();
      this._unbindEvents();
      if (this.menu) {
        this.menu.unload();
      }
      if (this.selectFilter && this.selectSortBy) {
        this.selectFilter.unload();
        this.selectSortBy.unload();
      }
    }
  }]);
  return Collection;
})();