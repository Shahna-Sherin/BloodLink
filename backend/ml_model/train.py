import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def train_model():
    # Generate training data based on donation eligibility rules
    np.random.seed(42)
    n = 500

    data = {
        'age': np.random.randint(18, 60, n),
        'weight': np.random.randint(40, 100, n),
        'months_since_last_donation': np.random.randint(0, 24, n),
        'total_donations': np.random.randint(0, 15, n),
        'availability': np.random.randint(0, 2, n),
    }

    df = pd.DataFrame(data)

    # Create target score based on medical donation rules
    df['score'] = (
        (df['weight'] >= 50).astype(int) * 25 +
        (df['weight'] >= 55).astype(int) * 10 +
        (df['age'] >= 18).astype(int) * 10 +
        (df['age'] <= 50).astype(int) * 10 +
        (df['total_donations'] * 5).clip(0, 25) +
        (df['months_since_last_donation'] <= 3).astype(int) * 10 +
        (df['availability'] == 1).astype(int) * 10
    )

    df['eligible'] = (df['score'] >= 50).astype(int)

    features = ['age', 'weight', 'months_since_last_donation', 'total_donations', 'availability']
    X = df[features]
    y = df['score']

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    os.makedirs('ml_model', exist_ok=True)
    with open('ml_model/donor_model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print(f'Model trained and saved! Features: {features}')
    return model

if __name__ == '__main__':
    train_model()