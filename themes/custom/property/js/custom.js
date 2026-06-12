


(function ($, Drupal) {
  'use strict';

  /**
   * Handles category click events and form submission
   */
  function initCategoryFilters() {
    // Get the select element from your exposed form
    const $formSelect = $('#edit-field-properties-target-id');
    
    // If the form select doesn't exist, stop the function
    if (!$formSelect.length) {
      return;
    }

    // Get the currently selected value from the form
    const currentSelectedValue = $formSelect.val();
    
    // Highlight the active category on page load based on form selection
    if (currentSelectedValue && currentSelectedValue !== 'All') {
      // Remove active class from all categories
      $('.categories-item').removeClass('active');
      // Add active class to the matching category
      $(`.categories-item[id="${currentSelectedValue}"]`).addClass('active');
    }

    // Attach click event to all category items
    $('.categories-item').off('click').on('click', function (e) {
      // Prevent the default anchor behavior
      e.preventDefault();

      // Get the term id from the link's 'id' attribute (e.g., "1", "6")
      const termId = $(this).attr('id');
      
      // Get the category name (optional)
      const categoryName = $(this).find('h5').text();

      if (termId && termId !== '') {
        // Remove active class from all category items
        $('.categories-item').removeClass('active');
        
        // Add active class to the clicked category
        $(this).addClass('active');
        
        // Set the select option to the matching term id
        $formSelect.val(termId);
        
        // Trigger a change event
        $formSelect.trigger('change');
        
        // Submit the exposed form
        $('#views-exposed-form-property-block-1').submit();
      }
    });
  }

  // Run when document is ready
  $(document).ready(function () {
    initCategoryFilters();
  });

  // Re-attach after AJAX calls (for Drupal views with AJAX)
  $(document).ajaxComplete(function () {
    initCategoryFilters();
  });

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
      console.log('Select field not found');
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

// document.addEventListener('DOMContentLoaded', function() {
//   var swiper = new Swiper('.rtl-slider', {
//     direction: 'horizontal',
//     rtl: true,
//     slidesPerView: 'auto',
//     spaceBetween: 30,
//     loop: true,
//     loopAdditionalSlides: 5,  // Extra slides for smooth loop
//     autoplay: {
//       delay: 0,
//       disableOnInteraction: false,
//       reverseDirection: true,
//       pauseOnMouseEnter: true,
//       waitForTransition: false,
//     },
//     speed: 5000,
//     freeMode: true,
//     freeModeMomentum: false,  // Disable momentum for smooth continuous scroll
//     centeredSlides: false,
    
//     // Responsive breakpoints
//     breakpoints: {
//       320: {
//         slidesPerView: 2,
//         spaceBetween: 20
//       },
//       768: {
//         slidesPerView: 3,
//         spaceBetween: 25
//       },
//       1024: {
//         slidesPerView: 5,
//         spaceBetween: 30
//       }
//     }
//   });
// });