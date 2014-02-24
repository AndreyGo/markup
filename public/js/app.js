$(document).ready(function() {

    var goodsQuantity = $('ul.header_busket_list > li').length; // количество товаров в корзине
    $('.header_busket_value').html(goodsQuantity)


    // Add to bookmark AJAX
    //
    $('#addBookmark').on('click', function(){
      var self = this;

      $.ajax({
        type: "GET",
        url: '/bitrix/templates/.default/inc/bookmarks.php',
        dataType: 'text',
        data: { id : id },
        success: function(data) {
          if (data == 'add') {
            $(self).text('Удалить');
          } else if (data == 'remove') {
            $(self).text('В закладки');
          }
        }
      });

      return false;
    });

    //Cлайдер на главной

    var sliderIndex = $('.slider_pagination_curent');
    $('.slider_pagination_count').html($('.page_slider ul > li').length);

    var slider = $('.page_slider ul').bxSlider({
        pager: true,
        hideControlOnEnd: true,
        autoStart: true,
        auto: true,
        pagerCustom: '.page_slider_pagination',
        infiniteLoop: false,
        onSliderLoad: function(currentIndex) {
            var newIndex = currentIndex + 1
            sliderIndex.html(newIndex + " ");
        },
        onSlideAfter: function(newIndex) {
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

    // Product item
    $('.product_item').hover(function() {
        $('.product_item_hover_block', this).animate({
            opacity: 1
        }, 200, "easeInOutCubic");
    }, function() {
        $('.product_item_hover_block', this).animate({
            opacity: 0
        }, 200, "easeInOutCubic");
    });

    // Item badges

    $('.item_badge').hover(function() {
        badgesValue(this);
        $('.badge_name', this).animate({
            right: '90%',
            opacity: 1
        }, 200, "easeOutQuint");
    }, function() {
        $(this).find('.badge_name').remove();
    });

    function badgesValue(self) {
        var text = '';
        var type = $(self).attr('data-type');
        switch (type) {
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
        $(self).find('.item_badge_box').before('<div class="badge_name">' + text + '</div>');
    }

    // Busket Close
    $('.busket_item_close').on('click', function(event) {

        var URL = $('.header_busket_list').attr('data-url');
        var ID = $(this).attr('data-id');
        var totalPrice = parseInt($('.header_busket_items_sum .text-bold').text());

        var price = parseInt($(this).parents('.header_busket_item').find('.price_value').text().replace(/(&nbsp;| )+/g, ''));
        var self = this;

        event.preventDefault();

        $.ajax({
            type: "POST",
            url: URL,
            data: {
                ID: ID
            },
            statusCode: {
                200: function() {
                    goodsQuantity -= 1;
                    totalPrice -=price;
                    $('.header_busket_items_sum .text-bold').text(totalPrice);
                    $(self).parent('.header_busket_item').fadeOut(100).remove();
                    $('.header_busket_items_num span.value').html(goodsQuantity);
                    $('.header_busket_value').html(goodsQuantity);
                }
            }
        });
    });
    (function() {
        var totalPrice = 0;
        $('.price_value').each(function(index, el) {
            var price = parseInt($(this).text().replace(/(&nbsp;| )+/g, ''));
            totalPrice += price;
        });
        $('.header_busket_items_sum .text-bold').text(totalPrice);
    }());

    // Fancybox
    $('[data-type="modal"]').click(function() {
        var self = this;
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

    $(document).click(function() {
        // all dropdowns
        $('.dropdown_list').removeClass('active');
    });

    // iCheck
    $('#sidebar_filter').iCheck({
        handle: 'checkbox',
        checkboxClass: 'sidebar_filter_checkbox'
    });

    $('#page_basket').iCheck({
        handle: 'checkbox',
        checkboxClass: 'page_basket_checkbox'
    });

    $('.basket-header_checkbox input').on('ifChecked', function(event) {
        $('.basket-block_item input').iCheck('check');
    });

    $('.basket-header_checkbox input').on('ifUnchecked', function(event) {
        $('.basket-block_item input').iCheck('uncheck');
    });

    $('.basket-block_item input').each(function(index, el) {
        $(this).on('ifChecked', function(event) {
            event.preventDefault();
            $(this).parents('.basket-block_item').addClass('active')
        });

        $(this).on('ifUnchecked', function(event) {
            event.preventDefault();
            $(this).parents('.basket-block_item').removeClass('active');
        });
    });

    $('.product-bookmark_check').iCheck({
        handle: 'checkbox',
        checkboxClass: 'sidebar_filter_checkbox'
    });

    (function() {
        var total = 0;
        $('.page-bookmark_grid .product_item .product-bookmark_check').on('ifChecked', function(event) {
            event.preventDefault();
            total++;
            checkBook(total);
            console.log(total);
        });
        $('.page-bookmark_grid .product_item .product-bookmark_check').on('ifUnchecked', function(event) {
            event.preventDefault();
            total--;
            checkBook(total);
            console.log(total);
        });

        function checkBook (num) {
            if (num < 1) {
                $('.page_faq_header_subtitle .message').text('Вы ничего не выбрали');
            } else if (num == 1){
                $('.page_faq_header_subtitle .message').html('<span class="message">Выбран <span class="bookmark_num">'+ total +'</span> продукт</span>');
            } else if (num > 4) {
                $('.page_faq_header_subtitle .message').html('<span class="message">Выбрано <span class="bookmark_num">'+ total +'</span> продуктов</span>');
            } else {
                $('.page_faq_header_subtitle .message').html('<span class="message">Выбрано <span class="bookmark_num">'+ total +'</span> продукта</span>');
            }
            $('.bookmark_num').text(total);
        }
    }());


    // Custom slider
    $('#filter-slider').slider({
        range: true,
        min: 43000,
        max: 102000,
        values: [47300, 80000],
        slide: function(event, ui) {
            $("#minPrice").val(ui.values[0]);
            $("#maxPrice").val(ui.values[1]);
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

    $('.page_pageup').on('click', function(event) {
        event.preventDefault();
        $(window).scrollTop(0);
    });

    $(window).scroll(function() {
        var windowTop = $(window).scrollTop();
        var containerLeft = $('.container').offset().left

        if (windowTop) {
            $('.page_pageup').css({
                position: 'fixed',
                top: '10px',
                display: 'block',
                left: containerLeft + 10
            });
        } else {
            $('.page_pageup').css('display', 'none');
        }

        if (windowTop > 270) {
            $('.sidebar_payment_block').css({
                position: 'fixed',
                top: '10px'
            });
        } else {
            $('.sidebar_payment_block').css({
                position: 'static'
            });
        }
    })



    // Images
    $('.news_item_image img').each(function() {
        var maxWidth = 214;
        var maxHeight = 214;
        var ratio = 1;
        var width = $(this).width();
        var height = $(this).height();
        if (width > height) {
            $(this).css('max-height', '100%');
        }
        if (width < height) {
            $(this).css('max-width', '100%');
        }

    });

    $('.news_article_header_thumb img').load(function() {
        var maxWidth = 60;
        var maxHeight = 60;
        var ratio = 1;
        var width = $(this).width();
        var height = $(this).height();
        if (width > height) {
            $(this).css('max-height', '100%');
        }
        if (width < height) {
            $(this).css('max-width', '100%');
        }
    });

    // Show pass
    $('.icon-eye').one('click', showPass);

    function showPass() {
        var passVal = $('input[type=password]').val();
        $('input[type=password]').hide();
        $('input[name=fakePassword').show();
        $('input[name=fakePassword').val(passVal);
        $('input[name=fakePassword').focus();
        $(this).one('click', hidePass);
    }

    function hidePass() {
        var passVal = $('input[name=fakePassword').val();
        $('input[name=fakePassword').hide();
        $('input[type=password]').val(passVal);
        $('input[type=password]').show();
        $('input[type=password]').focus();
        $(this).one('click', showPass);
    }

    // Header login
    $('.header_login_enter').on('click', function() {
        $(this).toggleClass('active');
        $('.header_login_enter_block').toggle();
    });

    $('.header_pass_forgot').on('click', function() {
        $('#login_block').toggle();
        $('#pass_block').toggle();
    })

    // Call Me AJAX
    $('#recall form').on('submit', function() {
        var options = {
            beforeSubmit: function() {
                // Check fields
                var sName = $('.modal_body input[name="user_name"]').val().trim();
                var sPhone = $('.modal_body input[name="MESSAGE"]').val().trim();
                var hasError = false;

                if (sName == '') {
                    $('.modal_body input[name="user_name"]').addClass('has-error');
                    hasError = true;
                } else {
                    $('.modal_body input[name="user_name"]').removeClass('has-error');
                }

                if (sPhone == '') {
                    $('.modal_body input[name="MESSAGE"]').addClass('has-error');
                    hasError = true;
                } else {
                    $('.modal_body input[name="MESSAGE"]').removeClass('has-error');
                }

                return !hasError;
            },
            success: function(responseText) {
                $('.recall_ask').hide();
                $('.recall_thanks').show();
                setTimeout(function(){
                  $.fancybox.close();
                }, 5000);
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });

    // FAQ form
    $('#faq_ask').on('submit', function() {
        var options = {
            beforeSubmit: function() {
                // Check fields
                var sName = $('#faq_ask_name').val().trim();
                var sMail = $('#faq_ask_email').val().trim();
                var sMessage = $('#faq_ask_text').val().trim();
                var hasError = false;

                if (sName == '') {
                    $('#faq_ask_name').addClass('has-error');
                    hasError = true;
                } else {
                    $('#faq_ask_name').removeClass('has-error');
                }

                if (sMail == '') {
                    $('#faq_ask_email').addClass('has-error');
                    hasError = true;
                } else {
                    $('#faq_ask_email').removeClass('has-error');
                }

                if (sMessage == '') {
                    $('#faq_ask_text').addClass('has-error');
                    hasError = true;
                } else {
                    $('#faq_ask_text').removeClass('has-error');
                }

                return !hasError;
            },

            success: function(responseText) {
                $('.ask_block').hide()
                $('.thanks_block').show();
            }
        };

        $(this).ajaxSubmit(options);
        return false;
    });


    $('.thanks_block .icon').on('click', function() {
        $('.thanks_block').hide();
        $('.ask_block').show();
        $('#faq_ask input').val('');
    });

    // Product slider
    var productMiniSlider = $('.product_slider ul').bxSlider({
        slideSelector: 'li.product_slider_item',
        pager: false,
        controls: true,
        minSlides: 4,
        maxSlides: 4,
        slideWidth: 90,
        slideMargin: 5,
        nextSelector: '.product_slider_pagination',
        nextText: '',
        prevText: '',
        prevSelector: '.product_slider_pagination',
        moveSlides: 1,
        infiniteLoop: false,
        hideControlOnEnd: true
    });

    var productSlider = $('.product_image ul').bxSlider({
        pager: false,
        controls: false
    });

    $('.product_slider_item a').on('click', function() {
        event.preventDefault();
        var index = $(this).attr('data-slide-index');
        productSlider.goToSlide(index);
    });


    $('.product_image a').on('click', function(event) {
        event.preventDefault();
        var href = [];
        $('.product_image img').each(function(index, el){
          //href[index] = $(this).attr('src');
          href.push($(this).attr('src'));
        });
        var imgVal = $(this).attr('src');
        var imgTitle = $(this).parents('.page_product_block').find('h1').text();
        var imgPic = $(this).parents('.product_image').children('img');
        $.fancybox(href, {
            closeBtn: true,
            mouseWheel: true,
            arrows: true,
            padding: 0,
            wrapCSS: "page_modal map_modal product",
            minWidth: '600px',
            tpl: {
                image    : '<div class="product-image_wrap"><img class="fancybox-image" src="{href}" alt="" /></div>',
                closeBtn: '<div class="modal_close"><a title="Close" href="javascript:;" class="icon-modal-close"></span></div>'
            },
            autoHeight: true,
            autoSize: true,
            title: imgTitle,
            helpers: {
                title: {
                    type: 'inside',
                    position: 'top'
                }
            }
        });
    });

    // Similar Product Slider
    $('.similar_slider ul').bxSlider({
        slideSelector: 'li.similar_slider_item',
        pager: false,
        controls: true,
        minSlides: 4,
        maxSlides: 4,
        slideWidth: 212,
        slideMargin: 32,
        nextSelector: '.similar_slider_pagination',
        nextText: '',
        prevText: '',
        prevSelector: '.similar_slider_pagination',
        moveSlides: 1,
        infiniteLoop: false,
        hideControlOnEnd: true
    });

    // Header user dropdown

    $('.header_login_user').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $('.header_user_dropdown').toggle();
    });

    // Contact sliders
    var mySliders = [];
    $('.page_address_block_map').each(function(i, obj) {

        var self = this;

        $('.page_address_block_map_slides ul', self).bxSlider({
            pager: false,
            controls: true,
            slideWidth: 120,
            slideMargin: 20,
            maxSlides: 4,
            minSlides: 3,
            moveSlides: 1,
            infiniteLoop: false,
            hideControlOnEnd: true
        });

        mySliders.push(
            $('.page_address_block_map_img ul', self).bxSlider({
                slideWidth: 412,
                controls: false,
                pager: false
            })
        );

        $('.page_address_block_map_slides_item a', self).on('click', function(event) {
            event.preventDefault();
            var index = $(this).attr('data-slide-index');
            mySliders[i].goToSlide(index);
        });
    });

    $('.contacts_modal').on('click', function(event) {
        event.preventDefault();
        var imgVal = $(this).children('img').attr('src');
        var imgTitle = $(this).children('img').attr('alt');
        $.fancybox(imgVal, {
            closeBtn: true,
            padding: 0,
            wrapCSS: "page_modal map_modal",
            aspectRatio: true,
            height: '800px',
            tpl: {
                closeBtn: '<div class="modal_close"><a title="Close" href="javascript:;" class="icon-modal-close"></span></div>'
            },
            autoHeight: false,
            autoSize: false,
            maxHeight: 600,
            title: imgTitle,
            fitToView: false,
            helpers: {
                title: {
                    type: 'inside',
                    position: 'top'
                }
            }
        });
    });

    // Order radio

    $('#order_form input:radio').change(function(event) {
        checkRadio()
    });

    function checkRadio() {
        $('#order_form input:radio').each(function(index, el) {
            var opt = $(this).is(':checked');
            if (opt == false) {
                $(this).parents('.order_delivery_item').removeClass('order_delivery_item-active');
            } else {
                $(this).parents('.order_delivery_item').addClass('order_delivery_item-active');
            }
        });
    }

    // User profile order tooltip
    (function() {
        var toolTip = $('.status_tooltip');
        $('.user-order_status .value').hover(function(e) {
            toolTip.text($(this).attr('data-text'));
            $(toolTip).css({
                top: 20 + e.pageY + "px",
                left: 10 + e.pageX + "px",
                display: 'block'
            });
            $(this).parents('.user-order_status').children('.icon').removeClass('icon-profile-question').addClass('icon-profile-question-dark');
        }, function() {
            $(toolTip).css('display', 'none');
            $(this).parents('.user-order_status').children('.icon').removeClass('icon-profile-question-dark').addClass('icon-profile-question');
        });
        $('.user-order_status .value').mousemove(function(e) {
            $('.status_tooltip').css({
                top: 20 + e.pageY + 'px',
                left: 10 + e.pageX + 'px'
            });
        })
    }());

    // Cancel order
    $('.user-order_cancel').click(function() {
        var self = this;
        var target = $(this).attr('data-target');
        var itemNumber = $(this).parents('.user-order_item').find('.user-order_code').children('.value').text();
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
            },
            afterLoad: function(current) {
                $('.orderNumber').text(itemNumber);

            }
        });
        return false;
    });

    $('.orderCancel .close_modal').click(function() {
        $.fancybox.close();
    });

    // Cansel order submit

    $('#orderCancel').on('submit', function() {
        var options = {
            success: function(responseText) {
                $('.orderCancel_window').hide();
                $('.orderCancel_thanks').show();
                setTimeout(function() {
                    $.fancybox.close();
                }, 5000);
            }
        };

        $(this).ajaxSubmit(options);
    });
    $('input, textarea').focusin(function(){
      $(this).addClass('page_input-active');
    });
    $('input, textarea').focusout(function(){
      if (!$(this).val() == '') {
        $(this).css('color', '#000');
      }
      $(this).removeClass('page_input-active');
    });

    // Masonry Interior
    var container = $('.page-interior_grid');
    container.imagesLoaded(function(){
      container.masonry({
        columnWidth: 214,
        itemSelector: '.interior_item',
        gutter: 32
      });
    });

/*
 *     $('.interior_item').on('click', function(event) {
 *         event.preventDefault();
 *         var imgVal = $(this).find('.interior-item_image img').attr('src');
 *         var imgTitle = $(this).find('.interior-item_image img').attr('alt');
 *         var imgPic = $(this).parents('.product_image').children('img');
 *         $.fancybox(imgVal, {
 *             closeBtn: true,
 *             padding: 20,
 *             wrapCSS: "page_modal map_modal product interior_modal",
 *             minWidth: '400px',
 *             tpl: {
 *                 closeBtn: '<div class="modal_close"><a title="Close" href="javascript:;" class="icon-modal-close"></span></div>'
 *             },
 *             autoHeight: true,
 *             autoSize: true,
 *             title: imgTitle,
 *             helpers: {
 *                 title: {
 *                     type: 'outside',
 *                     position: 'top'
 *                 },
 *                 close: {
 *                   type: 'outside',
 *                   position: 'top'
 *                 }
 *             }
 *         });
 *     });
 *
 */

      $('.interior_item a').fancybox();
});
