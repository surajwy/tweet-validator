import nltk
import argparse
import os
import sys
import re
import chunk

def readfile(input_file):
  ins = open(input_file,'r')
  array = []
  for line in ins:
    line = re.sub('[^A-Za-z0-9\-\:]+',' ', line)
    chunked = cooker(line)
    print '\n',

def cooker(input_text):
    chunked = chunk.process_text(input_text)
    if chunked:
        get_chunks(chunked)

def get_chunks(chunked):
  for idx, chnk in enumerate(chunked):
    if isinstance(chnk,nltk.tree.Tree):
      if chnk.label() == 'NP':
        lfs = chnk.leaves()
	for lf in lfs:
	  print lf[0] ,

parser = argparse.ArgumentParser(description='Pass an input')
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('-i','--input-text', help='Input Text')
group.add_argument('-f','--input-file', help='Input File')

args= parser.parse_args()

if args.input_text:
    input_text = args.input_text
    cooker(input_text)

if args.input_file:
    input_file = args.input_file
    if os.path.isfile(input_file):
        readfile(input_file)
    else:
        print "File does not exist"
	sys.exit(1)
	
    

