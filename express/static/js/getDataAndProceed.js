$.get('json/allData.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.allData = data;
  proceed()
});

$.get('json/dataByFileCount.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.dataByFileCount = data;
  proceed()
});

$.get('json/dataByWords.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.dataByWords = data;
  proceed()
});
