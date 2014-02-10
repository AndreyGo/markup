$(document).ready(function() {

    var goodsQuantity = 2; // количество товаров в корзине
    $('.header_busket_value').html(goodsQuantity)

    //Cлайдер на главной

    var sliderIndex = $('.slider_pagination_curent');

    var slider = $('.page_slider ul').bxSlider({
        pager: true,
        hideControlOnEnd: true,
        pagerCustom: '.page_slider_pagination',
        infiniteLoop: false,
        onSliderLoad: function(currentIndex) {
            var newIndex = currentIndex + 1
            sliderIndex.html(newIndex + " ");
        },
        onSlideAfter: function(newIndex){
            sliderIndex.html(getC() + " ");
        }
    });

    function getC() {
        return slider.getCurrentSlide() + 1;
    }

    // Hovers
    $('.dropdown').hover(function() {
      $('.dropdown_block:first', this).fadeIn(100);
    }, function() {
      $('.dropdown_block:first', this).fadeOut(100);
    });

    // Item badges

    $('.item_badge').hover(function() {
        badgesValue(this);
        $('.badge_name', this).animate({right: '90%', opacity: 1}, 200, "easeOutQuint");
    }, function() {
        $(this).find('.badge_name').remove();
    });
    function badgesValue(self) {
        var text = '';
        var type = $(self).attr('data-type');
        switch(type) {
            case 'like':
                text = 'нравится';
                break;
            case 'exclamation':
                text = 'внимание';
                break;
            case 'discount':
                text = 'скидка';
                break;
        }
        $(self).find('.item_badge_box').before('<div class="badge_name">'+text+'</div>');
    }

    // Busket Close
    $('.busket_item_close').on('click', function(event) {
        event.preventDefault();
        $(this).parent('.header_busket_item').fadeOut(100).remove();
        goodsQuantity -= 1;
        $('.header_busket_items_num span.value').html(goodsQuantity);
        $('.header_busket_value').html(goodsQuantity);
    });

    // Fancybox
    $('[data-type="modal"]').click(function() {
        var target = $(this).attr('data-target');
        $.fancybox.open(target, {
            wrapCSS: "page_modal",
            width: 650,
            padding: 0,
            fitToView: false,
            autoSize: false,
            autoHeight: true,
            scrolling: "no",
            closeBtn: false,
            helpers: {
                overlay: {
                    locked: false,
                    css: {
                        'background': 'rgba(4, 31, 61, 0.80)'
                    }
                }
            }
        });
        return false;
    });

    $('.modal_close').on('click', function(event) {
        event.preventDefault();
        $.fancybox.close();
    });

    // Filters

    function dropdownList(el, ch) {
      var self = this;
      this.placeholder = el.children('.page_filter_dropdown_label');
      this.index = -1;
      this.val = '';
      this.opts = el.find('ul > li');
      this.onchange = ch;

      el.on('click', function(event) {
          event.preventDefault();
          el.toggleClass('active');
          return false;
      });

      self.opts.on('click', function() {
          var opt = $(this);
          this.val = opt.text();
          self.placeholder.text(this.val);

          if ($.isFunction(self.onchange)) {
                self.onchange(opt);
          }
      });

    }

    var pageFilterType = new dropdownList($('.page_filter_type'), function(o) {
        document.location = $('a', o).attr('href');
    });

    var pageFilterPrice = new dropdownList($('.page_filter_price'), function(o) {
        document.location = $('a', o).attr('href');
    });

    var pageFilterQuan = new dropdownList($('.page_filter_quan'), function(o) {
        document.location = $('a', o).attr('href');
    });

    // iCheck
    $('#sidebar_filter').iCheck({
      handle: 'checkbox',
      checkboxClass: 'sidebar_filter_checkbox'
    });


    // Custom slider
    $('#filter-slider').slider({
        range: true,
        min: 43000,
        max: 102000,
        values: [47300, 80000],
        slide: function( event, ui ) {
            $( "#minPrice" ).val(ui.values[ 0 ]);
            $( "#maxPrice" ).val(ui.values[ 1 ]);
        }
    });

    // Sidebar filters

    $('.sidebar_filter_block_header').on('click', function(event) {
        event.preventDefault();
        $('.icon', this).toggleClass('icon-filter-block-arrow-right');
        var self = $(this).parent('.sidebar_filter_block');
        self.children('fieldset').toggle(100);
    });

    // Sticky payment nav

    if(!!$('.page_pageup').offset()) {
      var pageTop = $('.page_news_article_body').offset().top;
    }
    if(!!$('.page_news_article_body').offset()) {
      var pageLeft = $('.page_news_article_body').offset().left;
    }
    $('.page_pageup').on('click', function(event) {
        event.preventDefault();
        $(window).scrollTop(0);
    });

    $(window).scroll(function(){
        var windowTop = $(window).scrollTop();

        if((pageTop + 40) < windowTop) {
            $('.page_pageup').css({position: 'fixed', top: '10px', display: 'block', left: pageLeft+10});
        } else {
            $('.page_pageup').css('display', 'none');
        }
    })



    // Images
    $(window).bind("load", function() {
        // IMAGE RESIZE
        $('.news_item_image a img').each(function() {
            var maxWidth = 214;
            var maxHeight = 214;
            var ratio = 1;
            var width = $(this).width();
            var height = $(this).height();

            if((height/width) < ratio) {
                $(this).css('max-height', '100%');
            }

            if((width/height) < ratio) {
                $(this).css('max-width', '100%');
            }

        });
    });

      $('.news_article_header_thumb img').load(function() {
          var maxWidth = 60;
          var maxHeight = 60;
          var ratio = 1;
          var width = $(this).width();
          var height = $(this).height();
          if((height/width) < ratio) {
            $(this).css('max-height', '100%');
          }

          if((width/height) < ratio) {
            $(this).css('max-width', '100%');
          }
      });
});
