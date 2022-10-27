from flask import Flask, flash, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
from flask_cors import CORS, cross_origin

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_DB'] = 'aidays'

mysql = MySQL(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/data', methods=['GET'])
@cross_origin()
def get_data():
    cur = mysql.connection.cursor()
    cur.execute('''select distinct CountryName from SDGData''')
    rv = cur.fetchall()
    # convert to list and flatten
    countries  = [item for t in rv for item in t]
    cur.execute('''select distinct IndicatorName from SDGData''')
    rv = cur.fetchall()
    # convert to list and flatten
    indicator_name  = [item for t in rv for item in t]
    return jsonify({'countries': countries, 'indicator_name': indicator_name})

@app.route('/api/data/chart', methods=['GET'])
@cross_origin()
def get_data_chart():
    # countru country and indicator from params
    country = request.args.get('country')
    indicator = request.args.get('indicator')
    cur = mysql.connection.cursor()
    rv = None
    if not indicator:
        cur.execute("select distinct IndicatorName, Year, Value from SDGData where CountryName = '{0}' and Value is not null".format(country))
        rv = cur.fetchall()
        # make data value for every IndicatorName
        data = {}
        for item in rv:
            if item[0] not in data:
                data[item[0]] = {'year': [], 'value': []}
            data[item[0]]['year'].append(item[1])
            data[item[0]]['value'].append(item[2])
        return jsonify(data)
    else:
        cur.execute("select distinct IndicatorName, Year, Value from SDGData where CountryName = '{0}' and IndicatorName = '{1}'".format(country, indicator))
        rv = cur.fetchall()
        data = {}
        for item in rv:
            if item[0] not in data:
                data[item[0]] = {'year': [], 'value': []}
            data[item[0]]['year'].append(item[1])
            data[item[0]]['value'].append(item[2])
        return jsonify(data)


if __name__ == '__main__':
    # allow connections from localhosts    
    app.run(debug=True, host='0.0.0.0', port=5001)
