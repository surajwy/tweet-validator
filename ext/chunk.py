import nltk
from nltk.corpus import conll2000
import utils
import os

def chunk_preposition(text):
  pattern = "CHUNK:{<<CD>?(?!(IN|CC|\,|\:)).*>+}"
  chunker=nltk.RegexpParser(pattern)
  result =chunker.parse(tagged)
  result.draw()
  print result

def chunk_np(tokens):
  pattern = r"""NP: {(<CD><TO>)?<DT|PP\$|CD>?<JJ.*>*<NN.*>+}
  """
  #                  {<JJ>*<NN.*>+}
  chunker=nltk.RegexpParser(pattern)
  result =chunker.parse(tokens)
  #result.draw()
  #print result
  return result

class UnigramChunker(nltk.ChunkParserI):
    def __init__(self, train_sents): 
        train_data = [[(t,c) for w,t,c in nltk.chunk.tree2conlltags(sent)]for sent in train_sents]
        self.tagger = nltk.UnigramTagger(train_data) 

    def parse(self, sentence):
        pos_tags = [pos for (word,pos) in sentence]
        tagged_pos_tags = self.tagger.tag(pos_tags)
        chunktags = [chunktag for (pos, chunktag) in tagged_pos_tags]
        conlltags = [(word, pos, chunktag) for ((word,pos),chunktag) in zip(sentence, chunktags)]
        return nltk.chunk.util.conlltags2tree(conlltags)


class BigramChunker(nltk.ChunkParserI):
    def __init__(self, train_sents): 
        train_data = [[(t,c) for w,t,c in nltk.chunk.tree2conlltags(sent)]for sent in train_sents]
        self.tagger = nltk.BigramTagger(train_data) 

    def parse(self, sentence):
        pos_tags = [pos for (word,pos) in sentence]
        tagged_pos_tags = self.tagger.tag(pos_tags)
        chunktags = [chunktag for (pos, chunktag) in tagged_pos_tags]
        conlltags = [(word, pos, chunktag) for ((word,pos),chunktag) in zip(sentence, chunktags)]
        return nltk.chunk.util.conlltags2tree(conlltags)

def process_file(input_file):
	file_text=''
	with open(input_file, 'r') as content_file:
	  file_text = content_file.read().decode('utf-8')

	#sentences= nltk.sent_tokenize(file_text)
	sentences=file_text.split('\n')
	noun_phrases=[] 
	train_sents = conll2000.chunked_sents('train.txt', chunk_types=['NP'])
	test_sents = conll2000.chunked_sents('test.txt', chunk_types=['NP']) 
	chunker = BigramChunker(train_sents)
	print (chunker.evaluate(test_sents))
	for sent in sentences:
	  if not sent:
	    continue
	  tokens = nltk.word_tokenize(sent)
	  if len(tokens)>0:
	    tagged = nltk.pos_tag(tokens)
	    chunked = chunk_np(tagged)
	    #chunked = chunker.parse(tagged)
	    #chunked.draw()
	    utils.traverse(chunked)
	  
	  """
	  nps= [word for word,pos in chunked if pos == 'NP']
	  if len(nps)>0:
	    noun_phrases.append(nps)

	  print noun_phrases
	 
	  """

def process_text(text):
  #text = text.lower()
  global chunker
  tokens = nltk.word_tokenize(text)
  if len(tokens) == 0:
    return None
  tagged = nltk.pos_tag(tokens)
  chunked = chunker.parse(tagged)
  return chunked
  '''
  for chnk in chunked:
    if isinstance(chnk, nltk.tree.Tree): 
      if chnk.node == 'NP':
	
        leaves =  chnk.leaves()
	for leaf in leaves:
          leaf = leaf[0].lower()
	  if leaf in ltd_set:
	    print str(chnk).encode('utf-8')
	    break

  chunked.draw()
  '''

train_sents = conll2000.chunked_sents('train.txt', chunk_types=['NP'])
chunker = BigramChunker(train_sents)

