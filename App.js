import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

app = Flask(__name__)

# Replace these with your actual database credentials
DATABASE_USERNAME = 'your_db_username'
DATABASE_PASSWORD = 'your_db_password'
DATABASE_HOST = 'localhost'  # or your DB host
DATABASE_NAME = 'testdb'

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
socketio = SocketIO(app)

class TestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(200))
    status = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status
        }

@app.route('/testcases', methods=['GET'])
def get_testcases():
    testcases = TestCase.query.all()
    return jsonify([testcase.to_dict() for testcase in testcases])

@app.route('/testcases/<int:id>', methods=['PUT'])
def update_testcase(id):
    data = request.json
    testcase = TestCase.query.get(id)
    if testcase:
        testcase.title = data.get('title', testcase.title)
        testcase.description = data.get('description', testcase.description)
        testcase.status = data.get('status', testcase.status)
        db.session.commit()
        socketio.emit('update', testcase.to_dict())
        return jsonify(testcase.to_dict())
    return jsonify({'error': 'TestCase not found'}), 404

if __name__ == '__main__':
    db.create_all()  # This creates the tables if they don't exist
    socketio.run(app, debug=True)

const socket = io('http://localhost:5000');

function App() {
    const [testcases, setTestcases] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/testcases')
            .then(response => setTestcases(response.data));

        socket.on('update', (data) => {
            setTestcases(prev => prev.map(tc => tc.id === data.id ? data : tc));
        });
    }, []);

    const updateTestCase = (id, updates) => {
        axios.put(`http://localhost:5000/testcases/${id}`, updates)
            .then(response => {
                setTestcases(prev => prev.map(tc => tc.id === id ? response.data : tc));
            });
    };

    return (
        <div className="App">
            <h1>Test Cases</h1>
            <ul>
                {testcases.map(tc => (
                    <li key={tc.id}>
                        <h2>{tc.title}</h2>
                        <p>{tc.description}</p>
                        <p>{tc.status}</p>
                        <button onClick={() => updateTestCase(tc.id, { status: 'completed' })}>Complete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
