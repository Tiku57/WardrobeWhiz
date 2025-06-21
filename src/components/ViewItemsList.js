// frontend/src/components/ViewItemsList.js
import React, { useState, useEffect, useCallback } from 'react'; // <--- Add useCallback
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../api';
import ItemDetailModal from './ItemDetailModal';
import './ViewItemsList.css';

const ViewItemsList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Wrap fetchItems in useCallback so it doesn't cause infinite loops in useEffect
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/items`);
            setItems(response.data);
        } catch (err) {
            setError('Failed to load items. Please try again later.');
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means this function is created once

    useEffect(() => {
        fetchItems();
    }, [fetchItems]); // Depend on fetchItems so it re-runs if fetchItems itself changes (it won't with useCallback)

    const openItemDetail = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeItemDetail = () => {
        setSelectedItem(null);
        setModalIsOpen(false);
    };

    const handleItemDeleted = (deletedItemId) => {
        // After an item is deleted, re-fetch the list to update the UI
        fetchItems();
        // The modal should already be closed by ItemDetailModal itself
    };

    if (loading) return <div className="loading-message">Loading items...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (items.length === 0) return <div className="no-items-message">No items added yet.</div>;

    return (
        <div className="view-items-list-container">
            <h2>Your Wishlist</h2>
            <div className="items-grid">
                {items.map((item) => (
                    <div key={item.id} className="item-card" onClick={() => openItemDetail(item)}>
                        <img
                            src={`${IMAGE_BASE_URL}${item.coverImage}`}
                            alt={item.name}
                            className="item-cover-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                        />
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </div>
            {selectedItem && (
                <ItemDetailModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeItemDetail}
                    item={selectedItem}
                    onDeleteSuccess={handleItemDeleted} // <--- Pass the new handler
                />
            )}
        </div>
    );
};

export default ViewItemsList;