function randomInArray(array){
  return array[Math.floor(Math.random()*array.length)];
}
function randomSampleFromArray(array, n){
  return repeatStoreInArray(function(){return randomInArray(array)},n);
}
function repeatStoreInArray(f, n){
  var slices = [];
  for(var i = 0; i < n; i++){
    slices.push(f());
  }
  return slices;
}
function randomNumberBetween(lower, upper){
  return lower + Math.random()*(upper-lower);
}
function linearGradientBetween(lower, upper, n){
  var slices = [];
  var delta = (upper-lower)/n;
  for(var i = 0; i < n; i++){
    slices.push(lower + i * delta);
  }
  return slices;
}