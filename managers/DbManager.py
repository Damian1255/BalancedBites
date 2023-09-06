class DBManager():
    def __init__(self, mysql):
        self.mysql = mysql

    # Fetches the data from the database
    def fetch(self, query, params=None):
        # Creating a connection cursor & executing the query
        cursor =  self.mysql.connection.cursor()
        cursor.execute(query, params)

        # Fetching the data & closing the connection
        data = cursor.fetchall()
        print(f'Query executed: {len(data)} rows returned.')

        # Closing the connection & returning the data
        cursor.close()
        return data

    # Executes a query 
    def execute(self, query, params=None):
        # Creating a connection cursor & executing the query
        cursor =  self.mysql.connection.cursor()
        cursor.execute(query, params)
        
        # Commiting the changes & closing the connection
        self.mysql.connection.commit()
        print(f'Query executed: {cursor.rowcount} rows affected.')

        # Closing the connection & returning True
        cursor.close()
        return True
    
    
    
    
