import re
import nltk

def readfile(input_file):
  """reads and input file and tokenizes all the lines
     returns an array of tokenized lines """
  text = ''
  with open(input_file, 'r') as content_file:
    text = content_file.read().decode('utf-8')

  sentences = nltk.sent_tokenize(text)

  all_tokens = []

  for sent in sentences:
    tokens = nltk.word_tokenize(sent)
    line_tokens = []
    for token in tokens:
      if(not(token.isspace())):
        line_tokens.append(token)
    if line_tokens:
      all_tokens.append(line_tokens)
  return all_tokens

def tokenize_text(input_file,replace):
  """tokenizes the given input file into an array of tokens"""
  text = ''
  with open(input_file, 'r') as content_file:
    text = content_file.read().decode('utf-8')
  if replace==True:
    text = re.sub('[^A-Za-z0-9+-.@]+',' ', text.lower())
  tokens = nltk.word_tokenize(text)
  return tokens


