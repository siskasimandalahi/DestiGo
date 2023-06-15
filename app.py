from flask import Flask
import tensorflow as tf
import numpy as np
import pandas as pd
import joblib
from keras.preprocessing.text import Tokenizer

# Load the model from GCP storage
#model_path = 'gs://your-bucket/model_recommendation.h5'
model = tf.keras.models.load_model("model_recommendation.h5")

# Memuat label_encoder dari file terpisah
label_encoder = joblib.load('label_encoder.pkl')

# define Tokenizer
tokenizer = Tokenizer()

# Load destinations data
#destinations_path = 'gs://your-bucket/data_destinasi_wisata.csv'
destinations = pd.read_csv('data_destinasi_wisata.csv')

# Set max_sequence_length based on the model architecture
max_sequence_length = 607  # Set the maximum sequence length used in the model

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/recommendation/<input_text>', methods=['GET'])
def recommendation(input_text):
    input_sequence = tokenizer.texts_to_sequences([input_text])
    input_sequence = tf.keras.preprocessing.sequence.pad_sequences(input_sequence, maxlen=max_sequence_length)
    predictions = model.predict(input_sequence)
    top_indices = np.argsort(predictions.squeeze())[::-1][:5]
    recommended_labels = label_encoder.inverse_transform(top_indices)
    recommendations = destinations[destinations['nama_tempat'].isin(recommended_labels)]
    list_recommendations = recommendations[['nama_tempat', 'kota', 'kategori', 'alamat', 'lat', 'long', 'deskripsi']].values.tolist()
    # return recommendations[['nama_tempat', 'kota', 'kategori', 'alamat', 'lat', 'long', 'deskripsi']]
    return list_recommendations


if __name__ == '__main__':
    app.run(debug=True)
