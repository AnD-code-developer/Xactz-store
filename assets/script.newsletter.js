function Newsletter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Newsletter = function () {
  function Newsletter(section) {
    var sectionId = section.getAttribute('data-section-id'),
        newsletterEl = section.querySelector('.newsletter-title');
    if (newsletterEl && window.hasModal === undefined) {
      var newsletterElTitle = newsletterEl.getAttribute('data-title'),
          newsletterElText = section.querySelector('.newsletter-message').innerHTML,
          newsletterElLink = newsletterEl.getAttribute('data-link'),
          components_Modal = (new Modal()),
          header = '<h4 id="modal__heading">' + newsletterElTitle + '</h4>',
          content = newsletterElText + '<p><a class="btn" href="' + window.theme.routes.all_products_collection_url + '" title="' + newsletterElLink + '">' + newsletterElLink + '</a></p>';
      components_Modal.open({
        header: header,
        content: content
      });
    }   
  }
  return Newsletter;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'newsletter-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Newsletter(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'newsletter-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Newsletter(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})