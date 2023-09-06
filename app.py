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

@app.route('/search', methods=['POST', 'GET'])
def search():
    if request.method == 'POST':
        # Getting the search query & cleaning it
        search_query = request.json['search_query'].strip()
        search_query = search_query.split(' ')

        # Building the query
        query = 'SELECT NDB_No, Descrip FROM ingredients WHERE '
        for word in search_query:
            query += f'Descrip LIKE "%{word}%" AND '

        query = query[:-5] + ' LIMIT 100'
        
        # Fetching the data from the database
        results = []
        for row in db.fetch(query):
            results.append({'NDB_No': row[0], 'Descrip': row[1]})
            
        return jsonify({'success': True, 'data': results})
    else:
        return redirect(url_for('index'))
    
if __name__ == '__main__':
    app.run(debug=True)