from flask import Flask,render_template,request
import sqlite3

def connect_to_db():
    conn = sqlite3.connect('database.db')
    return conn

def create_db_table():
    try:
        conn = connect_to_db()
        # conn.execute('''DROP TABLE users''')
        conn.execute('''
            CREATE TABLE users (
                user_id INTEGER   PRIMARY KEY AUTOINCREMENT ,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                user_name TEXT NOT NULL
            );
        ''')

        conn.commit()
        print("User table created successfully")
    except:
        print("User table creation failed - Maybe table")
    finally:
        conn.close()

create_db_table()     


app = Flask(__name__)

@app.route("/")
def hello_world():   
    return render_template("index.html")

@app.route("/register")
def register():   
    return render_template("register.html")

@app.route("/home") 
def home():   
    return render_template("home.html")


@app.route('/home',methods = ['POST'])
def addrec():
   msg = ""
  
   if request.method == 'POST':
      try:
         name = request.form['name']
         email = request.form['email']
         password = request.form['password']
         user_name = request.form['user_name']
         print(name)
         conn = connect_to_db()
         cur = conn.cursor()
         cur.execute("INSERT INTO users (name,email,password,user_name)   VALUES (?,?,?,?)",(name,email,password,user_name) )
         conn.commit()
         msg = "Record successfully added"
         print(msg)
         return render_template("home.html")
      except:
         conn.rollback()
         msg = "error in insert operation"
         print(msg)
         return render_template("index.html")
      finally:
        print("==========",msg)
        # return render_template("index.html")
        conn.close()
 

if __name__ == "__main__":
    app.run(debug=True)