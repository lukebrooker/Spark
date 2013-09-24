$(function() {

  var collapseActiveDropdowns,
      toggleThisCollapseOthers;

  collapseActiveDropdowns = function () {
    $('.dropdown.is-active .dropdown__toggle').click();
  };

  toggleThisCollapseOthers = function (e) {
    var dropdown = $(this).parent('.dropdown');
    $('.dropdown.is-active').not(dropdown).removeClass('is-active')
                            .parents('.dropdown__container').removeClass('is-active');
    dropdown.toggleClass('is-active').parents('.dropdown__container').toggleClass('is-active');
    e.stopPropagation();
  };

  // Don't toggle dropdown when clicking links inside it
  $('.dropdown__toggle a, .dropdown__content').bind('click', function(e) {
    e.stopPropagation();
  });

  $(document).bind('click', collapseActiveDropdowns);
  $('.dropdown__toggle').bind('click', toggleThisCollapseOthers);

});
