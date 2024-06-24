document.addEventListener('DOMContentLoaded', function () {
  var pswpElement = document.querySelectorAll('.pswp')[0];

  // Build items array with correct width and height

  const items = [];
  for(let i = 1; i < 17; i++) {
    items.push({
      src: `images/gallery (${i}).jpg`,
      w: 1200,
      h: 900
    });
  }
  
  // Define click event for each gallery item
  var galleryElements = document.querySelectorAll('#my-gallery a');
  galleryElements.forEach(function (el, index) {
    el.addEventListener('click', function (event) {
      event.preventDefault();

      var options = {
        index: index, // start at clicked item
        bgOpacity: 1,
        showHideOpacity: true,
        getThumbBoundsFn: function (index) {
          // Define the thumbnail bounds
          var thumbnail = galleryElements[index].querySelector('img'),
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        maxSpreadZoom: 1, // Restrict zoom level to 1 to avoid stretching
        getDoubleTapZoom: function (isMouseClick, item) {
          // Return the zoom level based on the image's original size
          if (item.initialZoomLevel > 0.7) {
            return 1.5; // Double tap to zoom in
          } else {
            return 1; // Double tap to zoom out
          }
        }
      };

      // Initialize PhotoSwipe
      var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    });
  });
});
