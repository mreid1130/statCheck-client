$(document).ready(() => {
  var names = [];
  var activePlayerPosition = 0;
  $(document).keydown(function(e) {
    switch (e.which) {
      case 38: // up
        if ($('.search-autocomplete-result').length) {
          $('.search-autocomplete-result.active').removeClass('active');

          e.preventDefault(); // prevent the default action (scroll / move caret)
          if (activePlayerPosition >= $('.search-autocomplete-result').length) {
            activePlayerPosition = $('.search-autocomplete-result').length;
          } else if ($('.search-autocomplete-result').length > 1 && activePlayerPosition <= 2) {
            activePlayerPosition = 1;
          } else {
            activePlayerPosition--;
          }
          $('.search-autocomplete-result:nth-of-type(' + activePlayerPosition + ')').addClass('active');
        }
        break;

      case 40: // down
        if ($('.search-autocomplete-result').length) {
          $('.search-autocomplete-result.active').removeClass('active');

          e.preventDefault(); // prevent the default action (scroll / move caret)
          if (activePlayerPosition >= $('.search-autocomplete-result').length) {
            activePlayerPosition = $('.search-autocomplete-result').length;
          } else {
            activePlayerPosition++;
          }
          $('.search-autocomplete-result:nth-of-type(' + activePlayerPosition + ')').addClass('active');
        }
        break;

      default:
        return; // exit this handler for other keys
    }
  });
  $('.js-searchBox-input').keypress((e) => {
    if (e.keyCode !== 13) {
      var getNames = () => {
        return $.ajax({
          type: "GET",
          url: 'http://localhost:5000/nba/players/' + $('.js-searchBox-input').val(),
        });
      };
      $('.search-autocomplete').css('border', '');
      $('.search-autocomplete').empty();
      if ($('.js-searchBox-input').val()) {
        getNames().done((data) => {
          if (data.success && data.success.length) {
            data.success.forEach((player) => {
              $('.search-autocomplete').append("<div class='search-autocomplete-result' data-id='" + player._id + "'><div class='transparent-result-overlay'></div><img class='player-photo' src='" + (player.photo ? player.photo : 'http://www.clker.com/cliparts/m/3/I/C/c/2/grey-silhouette-of-man-md.png') + "'><span class='player-name'>" + player.name + "</span></div>");
            });
            $(".search-autocomplete-result").hover(
              function() {
                $('.search-autocomplete-result.active').removeClass('active');
                $(this).addClass("active");
              },
              function() {
                $(this).removeClass("active");
              }
            );
            $('.search-autocomplete').css('border', '1px solid #d6dadc');
            $('.transparent-result-overlay').click((e) => {
              $('.js-searchBox-input').val($(e.target).siblings('.player-name').text());
              var getPlayer = () => {
                $('.total-stats-table-body').empty();
                $('.nba-stats-total').css('display', 'none');
                return $.ajax({
                  type: "GET",
                  url: 'http://localhost:5000/nba/player/' + $(e.target).parent().data('id')
                });
              };
              getPlayer().done((data) => {
                if (data.success) {
                  if (data.success.stats && data.success.stats.length) {
                    activePlayerPosition = 0;

                    data.success.stats.forEach((season) => {
                      var htmlString = '';
                      htmlString += '<tr>';
                      htmlString += '<td>' + season.season + '</td>';
                      htmlString += '<td>' + season.team + '</td>';
                      htmlString += '<td>' + season.gamesPlayed + '</td>';
                      htmlString += '<td>' + season.gamesStarted + '</td>';
                      htmlString += '<td>' + season.minutes + '</td>';
                      htmlString += '<td>' + season.FGM + '</td>';
                      htmlString += '<td>' + season.FGA + '</td>';
                      if (season.FGM && season.FGA) {
                        htmlString += '<td>' + (season.FGM / season.FGA * 100).toFixed(2) + '</td>';
                      } else {
                        htmlString += '<td>0.00</td>';
                      }
                      htmlString += '<td>' + season.threePM + '</td>';
                      htmlString += '<td>' + season.threePA + '</td>';
                      if (season.threePM && season.threePA) {
                        htmlString += '<td>' + (season.threePM / season.threePA * 100).toFixed(2) + '</td>';
                      } else {
                        htmlString += '<td>0.00</td>';
                      }
                      htmlString += '<td>' + season.twoPM + '</td>';
                      htmlString += '<td>' + season.twoPA + '</td>';
                      if (season.twoPM && season.twoPA) {
                        htmlString += '<td>' + (season.twoPM / season.twoPA * 100).toFixed(2) + '</td>';
                      } else {
                        htmlString += '<td>0.00</td>';
                      }
                      htmlString += '<td>' + season.FTM + '</td>';
                      htmlString += '<td>' + season.FTA + '</td>';
                      if (season.FTM && season.FTA) {
                        htmlString += '<td>' + (season.FTM / season.FTA * 100).toFixed(2) + '</td>';
                      } else {
                        htmlString += '<td>0.00</td>';
                      }
                      htmlString += '<td>' + season.oRebound + '</td>';
                      htmlString += '<td>' + season.dRebound + '</td>';
                      htmlString += '<td>' + season.tRebound + '</td>';
                      htmlString += '<td>' + season.assists + '</td>';
                      htmlString += '<td>' + season.steals + '</td>';
                      htmlString += '<td>' + season.blocks + '</td>';
                      htmlString += '<td>' + season.turnovers + '</td>';
                      htmlString += '<td>' + season.personalFouls + '</td>';
                      htmlString += '<td>' + season.points + '</td>';
                      htmlString += '</tr>';

                      $('.total-stats-table-body').append(htmlString);
                      $('.nba-stats-total').css('display', 'table');
                      activePlayerPosition = 0;
                    });
                  } else {}
                }
              });
              $('.search-autocomplete').empty();
              $('.search-autocomplete').css('border', '');
            });
          }
        });
      }
    } else {
      e.preventDefault();
    }
  });

  $('.search-form').keypress((e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if ($('.search-autocomplete-result').length) {
        var getPlayer;
        if ($('.search-autocomplete-result').length === 1) {
          $('.js-searchBox-input').val($('.search-autocomplete-result').find('.player-name').text());
          getPlayer = () => {
            $('.total-stats-table-body').empty();
            $('.nba-stats-total').css('display', 'none');
            return $.ajax({
              type: "GET",
              url: 'http://localhost:5000/nba/player/' + $('.search-autocomplete-result').data('id')
            });
          };
        } else {
          if ($('.js-searchBox-input').val($('.search-autocomplete-result.active').length === 1)) {
            $('.js-searchBox-input').val($('.search-autocomplete-result.active').find('.player-name').text());
            getPlayer = () => {
              $('.total-stats-table-body').empty();
              $('.nba-stats-total').css('display', 'none');
              return $.ajax({
                type: "GET",
                url: 'http://localhost:5000/nba/player/' + $('.search-autocomplete-result.active').data('id')
              });
            };
          }
        }
        if (getPlayer) {
          activePlayerPosition = 0;
          getPlayer().done((data) => {
            if (data.success) {
              if (data.success.stats && data.success.stats.length) {
                data.success.stats.forEach((season) => {
                  var htmlString = '';
                  htmlString += '<tr>';
                  htmlString += '<td>' + season.season + '</td>';
                  htmlString += '<td>' + season.team + '</td>';
                  htmlString += '<td>' + season.gamesPlayed + '</td>';
                  htmlString += '<td>' + season.gamesStarted + '</td>';
                  htmlString += '<td>' + season.minutes + '</td>';
                  htmlString += '<td>' + season.FGM + '</td>';
                  htmlString += '<td>' + season.FGA + '</td>';
                  if (season.FGM && season.FGA) {
                    htmlString += '<td>' + (season.FGM / season.FGA * 100).toFixed(2) + '</td>';
                  } else {
                    htmlString += '<td>0.00</td>';
                  }
                  htmlString += '<td>' + season.threePM + '</td>';
                  htmlString += '<td>' + season.threePA + '</td>';
                  if (season.threePM && season.threePA) {
                    htmlString += '<td>' + (season.threePM / season.threePA * 100).toFixed(2) + '</td>';
                  } else {
                    htmlString += '<td>0.00</td>';
                  }
                  htmlString += '<td>' + season.twoPM + '</td>';
                  htmlString += '<td>' + season.twoPA + '</td>';
                  if (season.twoPM && season.twoPA) {
                    htmlString += '<td>' + (season.twoPM / season.twoPA * 100).toFixed(2) + '</td>';
                  } else {
                    htmlString += '<td>0.00</td>';
                  }
                  htmlString += '<td>' + season.FTM + '</td>';
                  htmlString += '<td>' + season.FTA + '</td>';
                  if (season.FTM && season.FTA) {
                    htmlString += '<td>' + (season.FTM / season.FTA * 100).toFixed(2) + '</td>';
                  } else {
                    htmlString += '<td>0.00</td>';
                  }
                  htmlString += '<td>' + season.oRebound || 0 + '</td>';
                  htmlString += '<td>' + season.dRebound + '</td>';
                  htmlString += '<td>' + season.tRebound + '</td>';
                  htmlString += '<td>' + season.assists + '</td>';
                  htmlString += '<td>' + season.steals + '</td>';
                  htmlString += '<td>' + season.blocks + '</td>';
                  htmlString += '<td>' + season.turnovers + '</td>';
                  htmlString += '<td>' + season.personalFouls + '</td>';
                  htmlString += '<td>' + season.points + '</td>';
                  htmlString += '</tr>';


                  $('.total-stats-table-body').append(htmlString);
                  $('.nba-stats-total').css('display', 'table');
                });
              } else {}
            }
          });
        }
        $('.search-autocomplete').empty();
        $('.search-autocomplete').css('border', '');
      }
    }
  });
});
