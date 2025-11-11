function Footer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Footer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Footer_createClass(Constructor, protoProps, staticProps) { if (protoProps) Footer_defineProperties(Constructor.prototype, protoProps); if (staticProps) Footer_defineProperties(Constructor, staticProps); return Constructor; }
var Footer = function () {
  function Footer(section) {
    Footer_classCallCheck(this, Footer);
    var newsletterEl = section.el.querySelector('.newsletter-message');
    if (newsletterEl && window.hasModal === undefined) {
      var newsletterElTitle = newsletterEl.getAttribute('data-title');
      var newsletterElText = newsletterEl.textContent;
      var components_Modal = (new Modal());
      var header = '<h2>' + newsletterElTitle + '</h2>';
      var content = '<p>' + newsletterElText + '</p>';
      components_Modal.open({
        header: header,
        content: content
      });
    }
    var currencyDisclosureEl = section.el.querySelector('[data-disclosure-currency]');
    var localeDisclosureEl = section.el.querySelector('[data-disclosure-locale]');
    if (currencyDisclosureEl) {
      this.currencyDisclosure = new Localization(currencyDisclosureEl);
    }
    if (localeDisclosureEl) {
      this.localeDisclosure = new Localization(localeDisclosureEl);
    }
  }
  Footer_createClass(Footer, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.currencyDisclosure) {
        this.currencyDisclosure.unload();
      }
      if (this.localeDisclosure) {
        this.localeDisclosure.unload();
      }
    }
  }]);
  return Footer;
}();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'footer' && !sectionContainer.classList.contains('ignore')){
    sections.register('footer', function (section) {
      return new Footer(section);
    });
    sectionContainer.classList.add('ignore');
  }
})