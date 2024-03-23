import React, { useState, useEffect } from 'react';
import { ref, get, child, getDatabase } from 'firebase/database';

function BabysitterData() {
    const [babysitterData, setBabysitterData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            // Replace 'BabysitterRequest' with your actual database path
            const dbRef = ref(getDatabase(), 'BabysitterRequest');

            try {
                const snapshot = await get(child(dbRef, '/'));
                if (snapshot.exists()) {
                    setBabysitterData(snapshot.val());
                } else {
                    console.log('No data available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return babysitterData;
}

export default BabysitterData;
