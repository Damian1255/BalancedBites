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

        # Fetching the data from the database
        data = db.fetch('SELECT NDB_No, Descrip FROM ingredients WHERE Descrip LIKE %s', ('%'+search_query+'%',))
        return jsonify({'success': True, 'data': data})
    else:
        return redirect(url_for('index'))
    
if __name__ == '__main__':
    app.run(debug=True)