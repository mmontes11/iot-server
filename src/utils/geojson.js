const longLatToPoint = (longitude, latitude) => {
    return {
        type: 'Point',
        coordinates: [
            longitude,
            latitude
        ]
    };
};

export default { longLatToPoint }