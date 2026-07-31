(function ($, Drupal) {

  Drupal.behaviors.propertyCategoryTabs = {
    attach: function (context) {
      var slideSelector = '.view-id-property .swiper-slide[data-property-group]';

      $(document)
        .off('click.propertyTabs', slideSelector)
        .on('click.propertyTabs', slideSelector, function (e) {
          e.preventDefault();

          var $slide = $(this);
          var propertyGroup = $slide.data('property-group');
          var $view = $slide.closest('.view-id-property');

          if (!propertyGroup || !$view.length) {
            return;
          }

          $view.find('.swiper-slide[data-property-group]').removeClass('active');
          $slide.addClass('active');
          $view.find('.categories-item').removeClass('active');
          $slide.find('.categories-item').addClass('active');

          $view.find('.property-group[data-property-group]').each(function () {
            var isSelected = $(this).data('property-group') === propertyGroup;
            $(this).prop('hidden', !isSelected);
          });
        });

      $('.view-id-property', context).each(function () {
        var $view = $(this);

        if ($view.data('property-tabs-initialized')) {
          return;
        }

        $view.data('property-tabs-initialized', true);

        var $activeSlide = $view.find('.swiper-slide[data-property-group].active').first();
        if (!$activeSlide.length) {
          $activeSlide = $view.find('.swiper-slide[data-property-group]').first();
        }

        $activeSlide.trigger('click');
      });

    }
  };

})(jQuery, Drupal);


(function ($, Drupal) {
  'use strict';

  function initTradingTabs() {

    // Exposed form
    const $form = $('#views-exposed-form-trading-block-1');

    // Select field
    const $formSelect = $form.find('select[name="field_properties_target_id"]');

    // Submit button
    const $applyButton = $form.find('input[type="submit"]');

    if (!$formSelect.length) {
      // console.log('Select field not found');
      return;
    }

    // Active tab on page load
    const currentSelectedValue = $formSelect.val();

    $('.widget-menu-tab .item-title').removeClass('active');

    if (currentSelectedValue) {
      $('.widget-menu-tab .item-title[id="' + currentSelectedValue + '"]')
        .addClass('active');
    }

    // Tab click
    $('.widget-menu-tab .item-title')
      .off('click.tradingTabs')
      .on('click.tradingTabs', function (e) {

        e.preventDefault();

        const termId = $(this).attr('id');

        if (!termId) {
          return;
        }

        // console.log('Clicked:', termId);

        // Active class
        $('.widget-menu-tab .item-title').removeClass('active');
        $(this).addClass('active');

        // Set select value ONLY
        $formSelect.val(termId);

        // console.log('Select updated:', $formSelect.val());

        // Directly submit form
        if ($applyButton.length) {

          // Native click works best with Drupal AJAX
          $applyButton[0].click();

          // console.log('Form submitted');

        } else {

          $form.submit();

        }
      });
  }

  // Initial load
  $(document).ready(function () {
    initTradingTabs();
  });

  // Reattach after AJAX
  $(document).ajaxComplete(function () {
    initTradingTabs();
  });

})(jQuery, Drupal);

document.addEventListener('DOMContentLoaded', function() {
  const marqueeContent = document.querySelector('.marquee-content');
  
  if (marqueeContent) {
    // Clone content for seamless loop
    const clone = marqueeContent.cloneNode(true);
    marqueeContent.parentElement.appendChild(clone);
    
    let position = 0;
    const speed = 1; // Pixels per frame (adjust for speed)
    
    function animate() {
      position -= speed;
      
      // Reset position when first set is completely scrolled
      if (Math.abs(position) >= marqueeContent.scrollWidth / 2) {
        position = 0;
      }
      
      marqueeContent.style.transform = `translateX(${position}px)`;
      marqueeContent.nextElementSibling.style.transform = `translateX(${position}px)`;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
});

document.addEventListener('DOMContentLoaded', function() {
    let swiperInstance = null;
    let isMobileLayout = window.innerWidth < 992;

    function initSwiper() {
        const currentIsMobile = window.innerWidth < 992;
        
        // Destroy existing swiper if it exists
        if (swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
            
            // Reset any inline styles that Swiper added
            const wrapper = document.querySelector('.searching .swiper-wrapper');
            if (wrapper) {
                wrapper.style.display = '';
                wrapper.style.flexWrap = '';
                wrapper.style.transform = '';
                wrapper.style.transition = '';
            }
            
            document.querySelectorAll('.searching .swiper-slide').forEach(slide => {
                slide.style.width = '';
                slide.style.marginRight = '';
                slide.style.flexShrink = '';
            });
            
            // Show pagination only on mobile
            const pagination = document.querySelector('.sw-pagination');
            if (pagination) {
                pagination.style.display = currentIsMobile ? '' : 'none';
            }
        }

        // Only initialize on mobile
        if (currentIsMobile) {
            // Swiper configuration for mobile only
            const swiperConfig = {
                slidesPerView: 'auto',
                spaceBetween: 30,
                centeredSlides: false,
                loop: false,
                
                // Pagination configuration
                pagination: {
                    el: '.sw-pagination',
                    clickable: true,
                    dynamicBullets: false,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                },
                
                // Responsive breakpoints for mobile
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                    }
                },
                
                // Autoplay only on mobile
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: true,
                },
                
                // Events
                on: {
                    slideChange: function() {
                        const activeIndex = this.activeIndex;
                        const slides = this.slides;
                        
                        slides.forEach((slide, index) => {
                            const link = slide.querySelector('.categories-item');
                            if (link) {
                                if (index === activeIndex) {
                                    link.classList.add('show');
                                } else {
                                    link.classList.remove('show');
                                }
                            }
                        });
                    }
                }
            };

            // Initialize Swiper
            swiperInstance = new Swiper('.searching', swiperConfig);
            
            // Show pagination on mobile
            const pagination = document.querySelector('.sw-pagination');
            if (pagination) {
                pagination.style.display = '';
            }
        } else {
            // Desktop: Reset styles and show all items
            // const wrapper = document.querySelector('.searching .swiper-wrapper');
            // if (wrapper) {
            //     wrapper.style.display = 'flex';
            //     wrapper.style.flexWrap = 'wrap';
            //     wrapper.style.justifyContent = 'center';
            //     wrapper.style.gap = '20px';
            //     wrapper.style.transform = 'none';
            // }
           
            document.querySelectorAll('.searching .swiper-slide').forEach(slide => {
                slide.style.width = '188.333px';
                slide.style.marginRight = '30px';
                // slide.style.flexShrink = '0';
            });
            
            // Hide pagination on desktop
            const pagination = document.querySelector('.sw-pagination');
            if (pagination) {
                pagination.style.display = 'none';
            }
        }
    }

    // Initialize on page load
    initSwiper();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initSwiper();
        }, 300);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.property', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: false,
        loop: false,
        
        // Pagination configuration
        pagination: {
            el: '.sw-pagination',
            clickable: true,
            dynamicBullets: false,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },
        
        // Responsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 30,
            }
        },
        
        // Optional: Auto play
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        
        // Optional: Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Events
        on: {
            init: function() {
                // console.log('Swiper initialized');
            },
            slideChange: function() {
                // Update active class on categories
                const activeIndex = this.activeIndex;
                const slides = this.slides;
                
                slides.forEach((slide, index) => {
                    const link = slide.querySelector('.categories-item');
                    if (link) {
                        if (index === activeIndex) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            }
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.together', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: false,
        loop: false,
        
        // Pagination configuration
        pagination: {
            el: '.sw-pagination',
            clickable: true,
            dynamicBullets: false,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },
        
        // Responsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 30,
            }
        },
        
        // Optional: Auto play
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        
        // Optional: Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Events
        on: {
            init: function() {
                // console.log('Swiper initialized');
            },
            slideChange: function() {
                // Update active class on categories
                const activeIndex = this.activeIndex;
                const slides = this.slides;
                
                slides.forEach((slide, index) => {
                    const link = slide.querySelector('.categories-item');
                    if (link) {
                        if (index === activeIndex) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            }
        }
    });

});

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on mobile and tablet (screens less than 992px)
    if (window.innerWidth < 992) {
        const swiper = new Swiper('.mobile-search', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
            loop: false,
            
            // Pagination configuration
            pagination: {
                el: '.sw-pagination',
                clickable: true,
                dynamicBullets: false,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            
            // Responsive breakpoints
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 25,
                }
            },
            
            // Optional: Auto play
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            
            // Events
            on: {
                init: function() {
                    // console.log('Swiper initialized');
                },
                slideChange: function() {
                    // Update active class on categories
                    const activeIndex = this.activeIndex;
                    const slides = this.slides;
                    
                    slides.forEach((slide, index) => {
                        const link = slide.querySelector('.categories-item');
                        if (link) {
                            if (index === activeIndex) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        }
                    });
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.mobile-test', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: false,
        loop: false,
        
        // Pagination configuration
        pagination: {
            el: '.sw-pagination',
            clickable: true,
            dynamicBullets: false,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },
        
        // Responsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25,
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 30,
            }
        },
        
        // Optional: Auto play
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        
        // Optional: Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Events
        on: {
            init: function() {
                // console.log('Swiper initialized');
            },
            slideChange: function() {
                // Update active class on categories
                const activeIndex = this.activeIndex;
                const slides = this.slides;
                
                slides.forEach((slide, index) => {
                    const link = slide.querySelector('.categories-item');
                    if (link) {
                        if (index === activeIndex) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                });
            }
        }
    });
});


(function (Drupal) {
  'use strict';

  Drupal.behaviors.footerMenuToggle = {
    attach: function (context, settings) {
      
      // Function to check if we're on mobile
      function isMobile() {
        return window.innerWidth < 768; // Adjust breakpoint as needed
        // For tablet and mobile: return window.innerWidth < 992;
      }
      
      // Only run if on mobile
      if (!isMobile()) {
        return;
      }
      
      var menus = context.querySelectorAll('.footer-menu-list.footer-col-block.style-2');
      
      menus.forEach(function(menu, index) {
        if (menu.dataset.initialized) return;
        menu.dataset.initialized = true;
        
        var heading = menu.querySelector('.title');
        var content = menu.querySelector('.tf-collapse-content');
        
        
        if (!heading || !content) return;
        
        // Set initial state - closed on mobile
        content.style.height = '0px';
        content.style.overflow = 'hidden';
        content.style.transition = 'height 0.3s ease';
        
        // Click handler on the entire menu container
        menu.addEventListener('click', function(e) {
          // Don't trigger on links
          if (e.target.closest('a')) return;
          
          e.preventDefault();
          e.stopPropagation();
          
          
          menu.classList.toggle('open');
          
          if (menu.classList.contains('open')) {
            var fullHeight = content.scrollHeight;
            content.style.height = fullHeight + 'px';
          } else {
            content.style.height = '0px';
          }
        });
        
        // Make headings look clickable
        heading.style.cursor = 'pointer';
      });
    }
  };

})(Drupal);



(function ($, Drupal, once) {
  Drupal.behaviors.openGalleryOnSectionClick = {
    attach: function (context, settings) {

      $(once('gallery-click', '#gallery-swiper-started', context)).on('click', function (e) {

        // Don't trigger if user actually clicked an image/link
        if ($(e.target).closest('a[data-fancybox]').length) {
          return;
        }

        // Open gallery from first image
        $(this).find('a[data-fancybox="gallery"]').first().trigger('click');
      });

    }
  };
})(jQuery, Drupal, once);
