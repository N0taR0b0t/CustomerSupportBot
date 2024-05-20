from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/tickets', methods=['OPTIONS', 'POST'])
def submit_ticket():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    email = data.get('email')
    description = data.get('description')
    severity = data.get('severity')

    if not email or not description or not severity:
        return jsonify({"error": "Missing data"}), 400

    return jsonify({"message": "Ticket submitted successfully"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)