// store.provider.js

import { getPreviewReview } from '../dao/store.dao.js';
import { previewReviewResponseDTO } from '../dto/review.dto.js';

export const getReview = async (storeId, query) => {
    const { reviewId, size = 3 } = query;
    try {
        const reviews = await getPreviewReview(reviewId, size, storeId);
        const responseDTO = reviews.map(review => previewReviewResponseDTO(review));
        return responseDTO;
    } catch (err) {
        throw new Error('Failed to fetch reviews');
    }
};
