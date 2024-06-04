const PlaceImg = ({ place, index = 0, className = null }) => {
    if (!className) {
        className = 'object-cover';
    }

    // Check if place has photos, if not, render a placeholder image or default content
    if (!place.photos || place.photos.length === 0) {
        return (
            <div className={className}>
                {/* Placeholder image or default content */}
                <img src="https://via.placeholder.com/150" alt="Placeholder" />
                {/* You can also render default content here */}
            </div>
        );
    }

    // Render the actual image
    return (
        <img className={className} src={'http://localhost:8000/uploads/' + place.photos[index]} alt="" />
    );
}

export default PlaceImg;
