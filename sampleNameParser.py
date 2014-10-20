import os
import os.path
import re
import string
import json


class WavDatum():

  restricted = set(['wav', '', 'the', 'in', 'zoom', 'shot', 'lucern', 'lucerne', 'session','august','day', 'and', 'to','reduc','woha','a','b','c','d','with','nice','on','tr','iver','vs','bagpipey','runner','region','studio','render','for','convo','breathing','arrival','piano'])

  def __init__(self, root, filename):
    self.root = root
    self.filename = filename
    self.fullname = os.path.join(root, filename);
    self.parts = re.sub(r'(.)([A-Z]+)', r'\1|||\2', self.filename)
    self.parts = re.sub(r'([^A-Za-z|])([A-Za-z])', r'\1|||\2', self.parts)
    self.words = self.parts.split('|||')
    self.words = [re.sub(r'[^A-Za-z]*', '', w) for w in self.words]
    self.words = set([w.lower() for w in self.words if w.lower() not in self.restricted])

  def to_dict(self):
    return {
      'root': self.root,
      'filename': self.filename,
      'fullname': self.fullname,
      'words': [word for word in self.words]
    }

class WavDatumEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, WavDatum):
      return obj.to_dict()
    return json.JSONEncoder.default(self, obj)


#path = '/Volumes/Transcend/Renders_MondayAugust29,2014/'
path1 = '/Users/nownownow/Projects/lucernPlayer/LucerneRenders_Flat'
# path2 = '/Volumes/Untitled 2/Lucerne/Orchestra Session/Orchestra/RenderedSamples'

# function to get datum for each file in a given location

def wavDataCollect(path,array):
  for root, dirs, files in os.walk(path):
    for f in files:
      if f.lower().endswith('.wav'):
        array.append(WavDatum(root,f));

#collect data from multiple paths
wavData = []
wavDataCollect(path1,wavData)
# wavDataCollect(path2,wavData)


# dictionary of words with array containing each data object
dataByWords = {}
for datum in wavData:
  for word in datum.words:
    if word in dataByWords:
      dataByWords[word].append(datum)
    else:
      dataByWords[word] = [datum]

# dictionary with numbers
dataByFileCount = {}
for word, dataArray in dataByWords.iteritems():
  size = len(dataArray)
  if size in dataByFileCount:
    dataByFileCount[size].append(word)
  else:
    dataByFileCount[size] = [word]

# print each word, along with a list of filenames
# for word, dataArray in dataByWords.iteritems():
# print word, [data.filename for data in dataArray]

for count, word in dataByFileCount.iteritems():
  print count, word

#print json.dumps(dataByWords['sing'], cls=WavDatumEncoder, indent=2)

with open('dataByWords.json', 'w') as outfile:
  json.dump(dataByWords, outfile, cls=WavDatumEncoder, indent=2)

with open('dataByFileCount.json', 'w') as outfile:
  json.dump(dataByFileCount, outfile, cls=WavDatumEncoder, indent=2)

with open('allData.json', 'w') as outfile:
  json.dump(wavData, outfile, cls=WavDatumEncoder, indent=2)

print 'we did it!!'
