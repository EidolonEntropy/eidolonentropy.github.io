
// init Isotope
var $grid = $('.grid').isotope({
    itemSelector: '.grid-item',
    // use packery for better space management
    layoutMode: 'packery',
    // use element for option
    columnWidth: '.grid-sizer',
    percentPosition: true,
    // filter by dummy class for an empty load
    filter: '.init',
  });
  
  // store filter for each group
  var filters = {};
  
  $('.filters').on( 'click', '.button', function( event ) {
    var $button = $( event.currentTarget );
    // get group key
    var $buttonGroup = $button.parents('.button-group');
    var filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    filters[ filterGroup ] = $button.attr('data-filter');
    // combine filters
    var filterValue = concatValues( filters );
    // set filter for Isotope
    $grid.isotope({ filter: filterValue });
  });
  
  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function( event ) {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      var $button = $( event.currentTarget );
      $button.addClass('is-checked');
    });
  });
    
  // flatten object by concatting values
  function concatValues( obj ) {
    var value = '';
    for ( var prop in obj ) {
      value += obj[ prop ];
    }
    return value;
  }

// layout Isotope again after all images have loaded
$grid.imagesLoaded().progress( function() {
   $grid.isotope('layout');
});

// um
$grid.on( 'arrangeComplete', function( event, filteredItems ) {
  console.log('Second layout pass triggered');
  $grid.isotope('layout');
});
