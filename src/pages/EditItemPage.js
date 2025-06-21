import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemForm from '../components/AddItemForm';
import { getItemById } from '../api'; // Import getItemById

const EditItemPage = () => {
    const { id } = useParams(); // Get item ID from URL
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const fetchedItem = await getItemById(id);
                setItem(fetchedItem);
            } catch (err) {
                console.error("Error fetching item for edit:", err);
                setError("Failed to load item for editing.");
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleSubmitSuccess = () => {
        // After successful update, navigate back to view items or item detail
        navigate(`/view-items`); // Or `/item-detail/${id}` if you have that
    };

    if (loading) return <div className="page-container">Loading item for edit...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;
    if (!item) return <div className="page-container">Item not found.</div>;

    return (
        <div className="page-container">
            <ItemForm itemToEdit={item} onSubmitSuccess={handleSubmitSuccess} />
        </div>
    );
};

export default EditItemPage;