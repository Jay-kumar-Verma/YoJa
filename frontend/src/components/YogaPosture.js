import React, { useState, useEffect } from 'react';

const YogaPosture = () => {
    const [postureData, setPostureData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostureData = async () => {
            try {
                const response = await fetch('/api/yoga/postures');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPostureData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPostureData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!postureData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Yoga Posture Monitoring</h2>
            <ul>
                {postureData.map((posture, index) => (
                    <li key={index}>
                        <h3>{posture.name}</h3>
                        <p>{posture.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YogaPosture;