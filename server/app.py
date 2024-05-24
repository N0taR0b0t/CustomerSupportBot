from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from servicebot import GPTCustomerService
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import configparser

app = Flask(__name__)
CORS(app)
db = None

# Load configuration
config = configparser.ConfigParser()
config.read('config.ini')

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465  # For SSL
EMAIL_USER = config['email']['EMAIL_USER']
EMAIL_PASS = config['email']['EMAIL_PASS']

service_bot = GPTCustomerService('config.ini')

print("Attempting Database Connection")
# Database connection setup
try:
    db = mysql.connector.connect(
        host='localhost',
        user='root',
        password='ZQMPcorners',
        database='ticket_system',
        port=3306
    )
    print("Connected to MySQL database")
except Error as e:
    print(f"Error connecting to MySQL database: {e}")

def send_email(subject, body, to):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, to, msg.as_string())
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

@app.route('/api/services', methods=['GET'])
def get_services():
    global db  # Declare db as global to ensure it is recognized within this function
    if db is None:
        return jsonify({"error": "Database connection not initialized"}), 500
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT service_id, service_name FROM services")
        result = cursor.fetchall()
        cursor.close()
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching services: {str(e)}")
        return jsonify({"error": "Unable to fetch services"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_id = request.json.get('user_id')
        question = request.json.get('question')
        if not user_id or not question:
            missing = "Missing 'user_id'" if not user_id else "Missing 'question'"
            return jsonify({"response": f"Request error: {missing}."}), 400

        response = service_bot.ask_question(user_id, question)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error processing request for user {user_id}: {str(e)}")
        return jsonify({"response": "We encountered an issue processing your request. Please try again later."}), 500

# Ticket submission endpoint
@app.route('/api/tickets', methods=['POST'])
def submit_ticket():
    try:
        data = request.get_json()
        service_id = data.get('service_id')
        description = data.get('description')
        severity = data.get('severity')

        if not service_id or not description or not severity:
            return jsonify({"error": "Missing data"}), 400

        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO tickets (service_id, description, severity) VALUES (%s, %s, %s)",
            (service_id, description, severity)
        )
        db.commit()

        cursor.execute("SELECT service_name FROM services WHERE service_id = %s", (service_id,))
        service_name = cursor.fetchone()[0]

        # Send email notification
        subject = "New Ticket Submitted"
        body = f"A new ticket has been submitted.\n\nService: {service_name}\nService ID: {service_id}\nDescription: {description}\nSeverity: {severity}"
        send_email(subject, body, 'maticapa6@gmail.com')
        
        return jsonify({"message": "Ticket submitted successfully"}), 201
    except Exception as e:
        print(f"Error processing ticket submission: {str(e)}")
        return jsonify({"error": "Server error, unable to process the ticket submission."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
