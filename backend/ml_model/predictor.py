import pickle
import numpy as np
import os

MODEL_PATH = 'ml_model/donor_model.pkl'

def load_model():
    if not os.path.exists(MODEL_PATH):
        from ml_model.train import train_model
        return train_model()
    with open(MODEL_PATH, 'rb') as f:
        return pickle.load(f)

model = load_model()

def predict_donor_score(age, weight, months_since_last_donation, total_donations, availability):
    features = np.array([[age, weight, months_since_last_donation, total_donations, int(availability)]])
    score = model.predict(features)[0]
    normalized = min(round(float(score) / 100, 2), 1.0)
    return normalized

def rank_donors(donors: list) -> list:
    for donor in donors:
        donor['ml_score'] = predict_donor_score(
            age=donor.get('age', 25),
            weight=donor.get('weight', 60),
            months_since_last_donation=donor.get('months_since_last_donation', 0),
            total_donations=donor.get('total_donations', 0),
            availability=donor.get('availability', True)
        )
    donors.sort(key=lambda x: x['ml_score'], reverse=True)
    return donors