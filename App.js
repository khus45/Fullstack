import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

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
