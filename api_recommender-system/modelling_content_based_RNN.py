# %% [markdown]
# # **Get dataset from GitHub**

# %%
import requests

url = "https://raw.githubusercontent.com/siskasimandalahi/DestiGo/Machine-Learning/Dataset/data_destinasi_wisata.csv"
response = requests.get(url)
with open("data_destinasi_wisata.csv", "wb") as file:
    file.write(response.content)

# %%
# install the required library
#!pip install pandas
#!pip install numpy
#!pip install tensorflow
#!pip install scikit-learn
#!pip install nltk
#!pip install matplotlib

# %%
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('indonesian')

# %% [markdown]
# ### **Import the required Library**

# %%
# for preprocess data
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer

# for modelling
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import save_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Flatten
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

# visualization
import matplotlib.pyplot as plt

# %%
import sklearn
import tensorflow as tf
import matplotlib

# check version
print(np.__version__)
print(pd.__version__)
print(sklearn.__version__)
print(nltk.__version__)
print(tf.__version__)
print(matplotlib.__version__)

# %% [markdown]
# ### Data Understanding
# this is section that read the data that we get from github. File name is 'data_destinasi_wisata'

# %%
# read the data
destinations = pd.read_csv('data_destinasi_wisata.csv')
destinations.sample(5)

# %%
print(f"Number of places in the datasets : {len(destinations.id.unique())}")

# %% [markdown]
# ### Exploratory Data Analysis
# In this section, we analysis the data that we get which checks whether there are null data and drop data that are not used for processing

# %%
# check info of dataset such as how many column and what is the type
destinations.info()

# %%
# check if there is null
destinations.isnull().sum()

# %%
# drop the null data
destinations = destinations.dropna(subset=['deskripsi'])

# check again that null in 'deskripsi' is drop
destinations.isnull().sum()

# %%
# check if there is missing value
destinations.isna().sum()

# %%
# check the data unique of column 'kategori' and 'kota
print(destinations.kategori.unique())
print(destinations.kota.unique())

# %%
# check info again
destinations.info()

# %%
# see an overview of the data
destinations.head()

# %% [markdown]
# ### Data Preprocessing
# preprocess data may involves encoding value of features and labels, change encode to numeric. Also, process column 'deskripsi' that have a lot of word that must be cleaning and tokenizing. Use a tokenizer to convert description text into numeric vectors.

# %%
# Preprocessing data
def clean_text(text):
    # Cleaning up special characters using regex
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

# %%
# Cleaning data kota
destinations['clean_kota'] = destinations['kota'].apply(clean_text)

# Cleaning data kategori
destinations['clean_kategori'] = destinations['kategori'].apply(clean_text)

# %%
# Preprocessing text deskripsi
def clean_deskripsi(text):
    # Cleaning up special characters using regex
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Changing to lowercase
    text = text.lower()
    # Removing stop words using NLTK
    stop_words = set(stopwords.words('indonesian'))
    tokens = word_tokenize(text)
    filtered_tokens = [word for word in tokens if word not in stop_words]
    text = ' '.join(filtered_tokens)
    return text

# %%
# Cleaning text deskripsi
destinations['clean_deskripsi'] = destinations['deskripsi'].apply(clean_deskripsi)

# %% [markdown]
# ### trying Augmented Text

# %%
from nltk.corpus import wordnet
import random
nltk.download('wordnet')

# Function to get synonyms of a word using WordNet
def get_synonyms(word):
    synonyms = []
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonyms.append(lemma.name())
    return synonyms

# Function to perform synonym replacement on a sentence
def synonym_replacement(sentence, n=1):
    tokens = nltk.word_tokenize(sentence)
    augmented_sentences = []

    for _ in range(n):
        augmented_tokens = []
        for token in tokens:
            synonyms = get_synonyms(token)
            if synonyms:
                synonym = random.choice(synonyms)
                augmented_tokens.append(synonym)
            else:
                augmented_tokens.append(token)
        
        augmented_sentence = " ".join(augmented_tokens)
        augmented_sentences.append(augmented_sentence)
    
    return augmented_sentences

# %%
# Augment the text in the DataFrame
destinations['augmented_text'] = destinations['clean_deskripsi'].apply(lambda x: synonym_replacement(x, n=3))

# %%
# Join the values in 'cleaned' column into sentences
sentences = []
for words in destinations['augmented_text']:
    sentence = ' '.join(words)
    sentences.append(sentence)

# %%
destinations['new_aug'] = sentences
destinations.head()

# %%
# Combined three column
combined_text = destinations['clean_kota'] + ' ' + destinations['clean_kategori'] + ' ' + destinations['new_aug']

tokenizer = Tokenizer()
tokenizer.fit_on_texts(combined_text)
text_sequences = tokenizer.texts_to_sequences(combined_text)
max_sequence_length = max([len(seq) for seq in text_sequences])
padded_sequences = pad_sequences(text_sequences, maxlen=max_sequence_length)

label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(destinations['nama_tempat'])

# %%
max_sequence_length

# %% [markdown]
# ### Training Model
# - split dataset into training and testing data use this 80%-20%
# - Train the model using the training data

# %%
# Division of data into training data and test data
X_train, X_test, y_train, y_test = train_test_split(padded_sequences, labels, test_size=0.2, random_state=42)

# %%
# Building deep learning model with embedding and LSTM
vocab_size = len(tokenizer.word_index) + 1
embedding_dim = 100

model = Sequential()
model.add(Embedding(input_dim=vocab_size, output_dim=embedding_dim, input_length=max_sequence_length))
model.add(LSTM(units=16))
model.add(Dense(len(label_encoder.classes_), activation='softmax'))

# Compile the model
model.compile(loss='sparse_categorical_crossentropy', 
              optimizer=Adam(), metrics=['accuracy'])

# %%
model.summary()

# %%
# Training model with early stopping
#early_stopping = EarlyStopping(patience=10, restore_best_weights=True)
#history = model.fit(X_train, y_train, validation_data=(X_test, y_test), 
#                   batch_size=32, epochs=20, callbacks=[early_stopping])
history = model.fit(X_train, y_train, validation_data=(X_test, y_test), 
                    batch_size=32, epochs=100)

# %%
# Display accuracy and loss
train_acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
train_loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(1, len(train_acc) + 1)

# %%
# Plotting Accuracy
plt.plot(epochs, train_acc, 'b', label='Training Accuracy')
plt.plot(epochs, val_acc, 'r', label='Validation Accuracy')
plt.title('Training and Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

# %%
# Plotting loss
plt.plot(epochs, train_loss, 'b', label='Training Loss')
plt.plot(epochs, val_loss, 'r', label='Validation Loss')
plt.title('Training and Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# %% [markdown]
# ## Predict the model
# 
# Make Recommendation System

# %%
# Recomendation Function
def recommend_places(input_text, top_n=5):
    input_sequence = tokenizer.texts_to_sequences([input_text])
    input_sequence = pad_sequences(input_sequence, maxlen=max_sequence_length)
    predictions = model.predict(input_sequence)
    top_indices = np.argsort(predictions.squeeze())[:-top_n-1:-1]
    recommended_labels = label_encoder.inverse_transform(top_indices)
    recommendations = destinations[destinations['nama_tempat'].isin(recommended_labels)]
    return recommendations

# %%
# Recommendation function usage example
input_text = "Museum"
recommended_places = recommend_places(input_text)

# Display recommendation results
print(recommended_places[['nama_tempat', 'kota', 'kategori', 'alamat', 'lat', 'long', 'deskripsi']])

# %% [markdown]
# ## Deployment
# output the h5 model

# %%
#Save the trained model as a Keras HDF5 file. 

saved_model_path = "./model_recommendation_v2.h5"
model.save(saved_model_path)

# %%
import joblib

# Menyimpan label_encoder ke dalam file
joblib.dump(label_encoder, 'label_encoder.pkl')

# %%
#from google.colab import files
# Download the model file
# files.download('model_recommendation_v2.h5')

# %% [markdown]
# ## Try Load model

# %%
import tensorflow as tf
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.preprocessing.text import Tokenizer

# Load the model from GCP storage
#model_path = 'gs://your-bucket/model_recommendation_v2.h5'
model = tf.keras.models.load_model('model_recommendation.h5')

# Memuat label_encoder dari file terpisah
label_encoder = joblib.load('label_encoder.pkl')

# define Tokenizer
tokenizer = Tokenizer()

# Load destinations data
#destinations_path = 'gs://your-bucket/data_destinasi_wisata.csv'
destinations = pd.read_csv('data_destinasi_wisata.csv')

# Set max_sequence_length based on the model architecture
max_sequence_length = 613  # Set the maximum sequence length used in the model

# Function for content-based recommendation
def recommend(input_text):
    input_sequence = tokenizer.texts_to_sequences([input_text])
    input_sequence = tf.keras.preprocessing.sequence.pad_sequences(input_sequence, maxlen=max_sequence_length)
    predictions = model.predict(input_sequence)
    top_indices = np.argsort(predictions.squeeze())[::-1][:5]
    recommended_labels = label_encoder.inverse_transform(top_indices)
    recommendations = destinations[destinations['nama_tempat'].isin(recommended_labels)]
    return recommendations[['nama_tempat', 'kota', 'kategori', 'alamat', 'lat', 'long', 'deskripsi']]

# Example usage
input_text = "Monumen Tugu Pahlawan"
recommended_places = recommend(input_text)

# Display recommendation results
print(recommended_places)


