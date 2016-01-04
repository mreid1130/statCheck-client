$(document).ready(() => {
  $('.js-clearSearchBox').css('opacity', '0');

  $('.js-searchBox-input').keyup(() => {
    if ($('.js-searchBox-input').val() !== '') {
      $('.js-clearSearchBox').css('opacity', '1');
    } else {
      $('.js-clearSearchBox').css('opacity', '0');
    }

    $(window).bind('keydown', (e) => {
      if (e.keyCode === 27) {
        $('.js-searchBox-input').val('');
      }
    });
  });
  // click the button 
  $('.js-clearSearchBox').click(() => {
    $('.js-searchBox-input').val('');
    $('.js-searchBox-input').focus();
    $('.js-clearSearchBox').css('opacity', '0');
  });

});
