$(function () {
  $('.loader__container').on('click', '.loader', function(){
    if ($('.loader__spinner', this).length <= 0) {
      $('.loader__label', this).append('<span class="loader__spinner"><span></span><span></span><span></span></span>');
      $(this).addClass('is-active');
    }
  });
});
