$(function() {
  var offCanvasToggle = $('[class^=off-canvas__toggle], .off-canvas__close');

  function offCanvasAction(offCanvasTarget) {
    var offCanvasMethod = $(offCanvasTarget).attr('data-off-canvas'),
        offCanvasClass  = offCanvasTarget.replace('#', ''),
        offCanvasToggleItem = offCanvasClass.replace('off-canvas--', '.off-canvas__toggle--');
    $('.off-canvas__outer').toggleClass(offCanvasClass + '-' + offCanvasMethod);
    $(offCanvasToggleItem).toggleClass('is-active');
    if (!$('.off-canvas__inner').attr('data-active-target')) {
      $('.off-canvas__inner').addClass('is-off-canvas').attr('data-active-target', offCanvasTarget);
    }
    else {
      $('.off-canvas__inner').removeClass('is-off-canvas').removeAttr('data-active-target');
    }
  }

  // TODO: Figure out how to use hammer.js properly
  // TODO: Implement drag instead of swipe but with a high threshold

  offCanvasToggle.on('click', function(e) {
    e.preventDefault();
  });

  // $('.off-canvas__inner').on('click', function(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (typeof $(this).attr('data-active-target') !== 'undefined') {
  //     offCanvasAction($(this).attr('data-active-target'));
  //   }
  // });

  offCanvasToggle.hammer().on('swipe', function() {
    offCanvasAction($(this).attr('href'));
  });

  offCanvasToggle.hammer().on('release', function(e) {
    e.stopPropagation();
    e.preventDefault();
    offCanvasAction($(this).attr('href'));
  });

  $('.off-canvas__target').hammer().on('swipe', function() {
    offCanvasAction('#' + $(this).attr('id'));
  });

});
