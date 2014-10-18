$.get('json/allData.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.allData = data;
  considerProceed()
});

$.get('json/dataByFileCount.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.dataByFileCount = data;
  considerProceed()
});

$.get('json/dataByWords.json', {}, function(data, textStatus, jqXHR){
  if (textStatus != 'success') {
    console.warn(jqXHR);
    return;
  }
  window.dataByWords = data;
  considerProceed()
});

var considerProceed = function(){
  if (allData && dataByFileCount && dataByWords) proceed();
}