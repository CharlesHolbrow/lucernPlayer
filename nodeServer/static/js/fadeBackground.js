var bgTo = function(url, duration){
  duration = (typeof duration === 'number') ? duration : 1000;

  var current = $('.currentBg');

  // new image to appended to the background
  $('<img class="nextBg">').one('load', function(){
    // the image is loaded, fade out the top image
    var newImage = this;
    current.fadeTo(1000, 0, function(){
      // the current image has faded out
      current.remove();
      // just in case another one showed up
      $('.currentBg').remove()
      newImage.setAttribute('class', 'currentBg');
    });
  }).attr('src', url).appendTo($('#background'));
};

var bgImageUrls = ["img/bridge_river_city.jpg", "img/bridge_tower_mountains_river.jpg", "img/cow.jpg", "img/ducks_swans_water.jpg", "img/marketscene.jpg", "img/nature_gras_mountains.jpg", "img/nature_mountains.jpg", "img/nature_rocks_mountains.jpg", "img/nature_small-lake2.jpg", "img/nature_small_lake.jpg", "img/orchestra1.jpg", "img/orchestra2.jpg", "img/organ.jpg", "img/panorama_bridge_city.jpg", "img/street_old_city_centre.jpg", "img/title.jpg", "img/title_bar_restaurant.jpg", "img/title_dockyard_construction.jpg", "img/title_harbor_ship.jpg", "img/title_market.jpg", "img/title_park.jpg", "img/title_tod_trainstation.jpg", "img/water_city_mountains.jpg", "img/water_city_nature.jpg", "img/water_lake_city2.jpg", "img/water_river_city_night.jpg", "img/water_river_lake_city.jpg", "img/yodel.jpg"]
bgImageUrls.position = 0;

setInterval(function(){
  var imageUrl = bgImageUrls[bgImageUrls.position];
  if (imageUrl) bgTo(imageUrl);
  if (++bgImageUrls.position >= bgImageUrls.length) bgImageUrls.position = 0;
}, 12000);
