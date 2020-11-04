import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import io
import os
import re
import shutil
import string
import tensorflow as tf
from tensorflow import keras
from keras.models import load_model

from datetime import datetime
from tensorflow.keras import Model, Sequential
from tensorflow.keras.layers import Activation, Dense, Embedding, GlobalAveragePooling1D
from tensorflow.keras.layers.experimental.preprocessing import TextVectorization
from tensorflow.keras import layers
# getting data
data = pd.read_csv("sample-data.csv")

# test train split
msk = np.random.rand(len(data)) < 0.8
train_X = data[msk]['message']
train_Y = data[msk]['vulnerable']
test_X  = data[~msk]['message']
test_Y  = data[~msk]['vulnerable']

max = 0
mess = ""

for message in train_X:

  if len(message) > max:
    max = len(message)
    mess = message

vocab_size = 12612
sequence_length = 1000

embedding_layer = tf.keras.layers.Embedding(vocab_size, sequence_length)

def custom_standardization(input_data):
  lowercase = tf.strings.lower(input_data)
  stripped_html = tf.strings.regex_replace(lowercase, '<br />', ' ')
  return tf.strings.regex_replace(stripped_html,
                                  '[%s]' % re.escape(string.punctuation), '')

# Use the text vectorization layer to normalize, split, and map strings to
# integers. Note that the layer uses the custom standardization defined above.
# Set maximum_sequence length as all samples are not of the same length.
vectorizer = TextVectorization(max_tokens=vocab_size, output_sequence_length=sequence_length)
text_ds = tf.data.Dataset.from_tensor_slices(train_X).batch(32)
vectorizer.adapt(text_ds)
##print(len(vectorizer.get_vocabulary()))

model = load_model('kylesThiccModel.h5')
print ("I loaded a model")

string_input = keras.Input(shape=(1,), dtype="string")
x = vectorizer(string_input)
preds = model(x)
end_to_end_model = keras.Model(string_input, preds)

count = 0
Vuln = 0
vulnLengthSum = 0
nonVuln = 0
nonVulnLengthSum = 0
print("non-vulnerables:")
for x in test_X:
    count = count + 1
    probabilities = end_to_end_model.predict(
        [[x]]
        )
    np.argmax(probabilities[0])

    if probabilities[0][1] > 0.5 :
        vulnLengthSum = vulnLengthSum + len(x)
        print("length:",len(x))
        print(x)
        Vuln = Vuln + 1
    if probabilities[0][0] > 0.5 :
        nonVulnLengthSum = nonVulnLengthSum + len(x)
        print("length:",len(x))
        print(x)
        nonVuln = nonVuln + 1
print("Vuln commits: ", Vuln)
print("Average vuln length",  vulnLengthSum/Vuln)
print("non vuln commits: ", nonVuln)
print("Average non vuln length", nonVulnLengthSum/nonVuln)
