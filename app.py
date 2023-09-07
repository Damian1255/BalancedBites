from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
from managers import DbManager
import logging

# Flask app
app = Flask(__name__)
app.config.from_pyfile('configs/db.py')

# Disable logging
log = logging.getLogger('werkzeug')
log.disabled = True
app.logger.disabled = True

# Managers
db = DbManager.DBManager(MySQL(app))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/wizard')
def wizard():
    return render_template('wizard.html')

@app.route('/search', methods=['POST', 'GET'])
def search():
    if request.method == 'POST':
        # Getting the search query & cleaning it
        search_query = request.json['search_query'].strip()
        search_query = search_query.split(' ')

        # Building the query
        query = 'SELECT id, name FROM ingredients WHERE '
        for i in range(len(search_query)):
            query += f'name LIKE "%{search_query[i]}%"'
            if i != len(search_query) - 1:
                query += ' AND '
        
        # Fetching the data from the database
        results = []
        for row in db.fetch(query):
            results.append({'id': row[0], 'name': row[1].capitalize()})
            
        return jsonify({'success': True, 'data': results})
    else:
        return redirect(url_for('index'))

@app.route('/fetch/<string:id>', methods=['POST', 'GET'])
def fetch(id):
    # Fetching the data from the database
    query = f'SELECT * FROM ingredients WHERE id = "{id}"'
    results = db.fetch(query)

    # Checking if the ingredient exists
    if len(results) == 0:
        return jsonify({'success': False, 'message': 'Ingredient not found'})

    item = {'id': results[0][0], 'name': results[0][1].capitalize(), 'calories_cal': results[0][2],
             'total_fat_g': results[0][3], 'saturated_fat_g': results[0][4], 'cholesterol_mg': results[0][5],
             'sodium_mg': results[0][6], 'vitamin_a_iu': results[0][7], 'vitamin_b12_mcg': results[0][8],
             'vitamin_b6_mg': results[0][9], 'vitamin_c_mg': results[0][10], 'vitamin_d_iu': results[0][11],
             'vitamin_e_mg': results[0][12], 'vitamin_k_mcg': results[0][13], 'calcium_mg': results[0][14],
             'iron_mg': results[0][15], 'magnesium_mg': results[0][16], 'potassium_mg': results[0][17],
             'protein_g': results[0][18], 'carbohydrate_g': results[0][19], 'fiber_g': results[0][20],
             'sugars_g': results[0][21], 'glucose_g': results[0][22], 'lactose_g': results[0][23],
             'sucrose_g': results[0][24], 'alcohol_g': results[0][25], 'caffeine_mg': results[0][26],
             'water_g': results[0][27], 'serving_size_g': 100}
    
    # Returning the data
    return jsonify({'success': True, 'data': item})

if __name__ == '__main__':
    app.run(debug=True)