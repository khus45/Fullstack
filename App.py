from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/testdb'
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
    socketio.run(app, debug=True)
