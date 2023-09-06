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

@app.route('/fetch/<string:ndb_no>', methods=['POST', 'GET'])
def fetch(ndb_no):
    # Fetching the data from the database
    query = f'SELECT * FROM ingredients WHERE id = "{ndb_no}"'
    results = db.fetch(query)

    # Checking if the ingredient exists
    if len(results) == 0:
        return jsonify({'success': False, 'message': 'Ingredient not found'})

    # Returning the data
    return jsonify({'success': True, 'data': results[0]})

if __name__ == '__main__':
    app.run(debug=True)