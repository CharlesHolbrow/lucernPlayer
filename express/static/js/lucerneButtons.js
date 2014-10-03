window.allData = null;
window.dataByFileCount = null;
window.dataByWords = null;

window.proceed = function(){
  // This should be on the server
  if (!allData || !dataByFileCount || !dataByWords) return;
  var fileCounts = Object.keys(dataByFileCount);
  for (var i = fileCounts.length -1; i >= 1; i--){
    var count = fileCounts[i];
    var words = dataByFileCount[count];
    for (var j = 0; j < words.length; j++){
      var word = words[j];
      $('#sound-buttons').append('<span sound=' + word + ' class="button">' + word + ' (' + count + ') </span>');
    }
  }

  // this should be on the client
  $('.button').click(function(){
    sound = this.getAttribute('sound');

    if (!sound) return;
    else $.post('/sound', {data:dataByWords[sound]}, function(data, textStatus, jqXHR){
      if (textStatus !== 'success'){
        console.warn(textStatus, jqXHR);
      }
    });
  })
}