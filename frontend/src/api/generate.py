import csv, json

with open('blood_donor.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

donors = []
for i, r in enumerate(rows):
    weight = float(r['weight']) if r['weight'] else 50
    donations = int(r['total_number_of_blood_donations']) if r['total_number_of_blood_donations'] else 0
    months = int(r['month_since_last_donation']) if r['month_since_last_donation'] else 0
    w_score = 1.0 if 55 <= weight <= 80 else 0.7
    d_score = min(donations * 0.1 + 0.5, 1.0)
    r_score = max(1.0 - months * 0.02, 0.3)
    ml_score = round((w_score * 0.3 + d_score * 0.4 + r_score * 0.3), 2)
    donors.append({
        'id': i + 1,
        'name': r['name'],
        'email': r['e_mail'],
        'contact': r['contact_number'],
        'place_of_residence': r['place_of_residence'].strip(),
        'current_locality': r['current_locality'].strip(),
        'age': int(r['age']) if r['age'] else 0,
        'weight': float(r['weight']) if r['weight'] else 0,
        'blood_group': r['blood_group'],
        'availability': r['availability'].strip().lower() == 'yes',
        'months_since_last_donation': months,
        'total_donations': donations,
        'ml_score': ml_score
    })

donors.sort(key=lambda x: x['ml_score'], reverse=True)

js = 'const donorsData = ' + json.dumps(donors, indent=2) + ';\n\nexport default donorsData;'
with open('donorsData.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f'Done! Generated {len(donors)} donors.')