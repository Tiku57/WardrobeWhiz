// frontend/src/components/ItemDetailModal.js
import React from 'react';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { IMAGE_BASE_URL, deleteItem } from '../api';
import './ItemDetailModal.css';

Modal.setAppElement('#root');

const ItemDetailModal = ({ isOpen, onRequestClose, item, onDeleteSuccess }) => {
    if (!item) return null;

    const allImages = [item.coverImage, ...item.additionalImages];

    const handleEnquire = () => {
        alert(`Enquiry for "${item.name}"!`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            try {
                const response = await deleteItem(item.id);
                console.log(response.message);
                onRequestClose();
                if (onDeleteSuccess) onDeleteSuccess(item.id);
            } catch (error) {
                console.error('Error deleting item:', error);
                alert(error.response?.data?.message || 'Failed to delete item.');
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Item Details"
            className="item-detail-modal"
            overlayClassName="item-detail-overlay"
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{item.name}</h2>
                    <button onClick={onRequestClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {allImages.length > 0 ? (
                        <div className="image-carousel-container">
                            <Carousel
                                showArrows={true}
                                infiniteLoop={true}
                                dynamicHeight={false}
                                useKeyboardArrows={true}
                                emulateTouch={true}
                                showThumbs={true}
                                thumbWidth={80}
                                renderThumbs={() =>
                                    allImages.map((imagePath, index) => (
                                        <img
                                            key={index}
                                            src={`${IMAGE_BASE_URL}${imagePath}`}
                                            alt={`Thumb ${index + 1}`}
                                            className="carousel-thumb"
                                        />
                                    ))
                                }
                                showIndicators={allImages.length > 1}
                                showStatus={allImages.length > 1}
                            >
                                {allImages.map((imagePath, index) => (
                                    <div key={index} className="carousel-image-wrapper">
                                        <img
                                            src={`${IMAGE_BASE_URL}${imagePath}`}
                                            alt={`${item.name} image ${index + 1}`}
                                            className="carousel-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.png';
                                            }}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    ) : (
                        <div className="no-image-placeholder">
                            <p>No images available for this item.</p>
                        </div>
                    )}

                    <div className="item-details-text">
                        <p><strong>Type:</strong> {item.type}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        <div className="modal-buttons">
                            <button className="enquire-button" onClick={handleEnquire}>Enquire</button>
                            <button className="delete-button" onClick={handleDelete}>Delete Item</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ItemDetailModal;
