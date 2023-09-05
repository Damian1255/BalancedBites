class DBManager():

    # Executes a query and returns the data
    def execute(self, mysql, query, params=None):
        # Creating a connection cursor & executing the query
        cursor =  mysql.connection.cursor()
        cursor.execute(query, params)

        # Fetching the data
        data = cursor.fetchall()
        
        # Commiting the changes & closing the connection
        mysql.connection.commit()
        cursor.close()

        print(f'Query executed: {len(data)} rows returned.')
        return data
    
    
    
