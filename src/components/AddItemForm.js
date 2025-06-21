// frontend/src/components/AddItemForm.js
import React, { useState, useEffect } from 'react';
import { addItem } from '../api'; // Only import addItem now
import './AddItemForm.css';

const AddItemForm = ({ onSubmitSuccess }) => { // No itemToEdit prop
    const [name, setName] = useState('');
    const [type, setType] = useState('Shirt');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Effect to clear form when component mounts/resets, no longer for itemToEdit
    useEffect(() => {
        setName('');
        setType('Shirt');
        setDescription('');
        setCoverImage(null);
        setAdditionalImages([]);
        setMessage('');
        setMessageType('');
    }, []); // Empty dependency array means this runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setMessageType('');

        if (!coverImage) {
            setMessage('Please select a cover image for the item.');
            setMessageType('error');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('description', description);
        formData.append('coverImage', coverImage); // Cover image is always required for new items

        additionalImages.forEach((image) => {
            formData.append('additionalImages', image);
        });

        try {
            const response = await addItem(formData); // Always call addItem
            setMessage(response.message);
            setMessageType('success');

            // Clear form fields
            setName('');
            setType('Shirt');
            setDescription('');
            setCoverImage(null);
            setAdditionalImages([]);
            document.getElementById('coverImageInput').value = null; // Clear file input
            document.getElementById('additionalImagesInput').value = null; // Clear file input

            // Call the success callback if provided
            if (onSubmitSuccess) {
                onSubmitSuccess(response.item);
            }

        } catch (error) {
            console.error('Error adding item:', error);
            setMessage(error.response?.data?.message || 'Failed to add item. Please try again.');
            setMessageType('error');
        }
    };

    // Removed: renderCurrentImages function

    return (
        <div className="add-item-form-container">
            <h2>Add New Item</h2> {/* Title always "Add New Item" */}
            {message && <div className={`message ${messageType}`}>{message}</div>}
            <form onSubmit={handleSubmit} className="add-item-form">
                {/* Removed: renderCurrentImages call */}

                <div className="form-group">
                    <label htmlFor="name">Item Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Item Type:</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="Shirt">Shirt</option>
                        <option value="Pant">Pant</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Sports Gear">Sports Gear</option>
                        <option value="Accessory">Accessory</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Item Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="coverImageInput">Item Cover Image:</label>
                    <input
                        type="file"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        required 
                    />
                    {coverImage && <span className="file-name">{coverImage.name}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="additionalImagesInput">Item Additional Images (up to 3):</label>
                    <input
                        type="file"
                        id="additionalImagesInput"
                        accept="image/*"
                        multiple
                        onChange={(e) => setAdditionalImages(Array.from(e.target.files))}
                    />
                    {additionalImages.length > 0 && (
                        <div className="file-names">
                            {additionalImages.map((file, index) => (
                                <span key={index} className="file-name">{file.name}</span>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" className="submit-button">
                    Add Item {/* Button text always "Add Item" */}
                </button>
            </form>
        </div>
    );
};

export default AddItemForm;