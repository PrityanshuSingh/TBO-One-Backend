const generateEmbedding = require('../embedding/generateEmbedding');
const hotel = require("../../models/Hotel")

const vectorSearch = async (query, CityCode, limit = 1) => {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) {
        return "invalid!!";
    }
    console.log("type of generated embedding ", Array.isArray(queryEmbedding));

    const processedVector = queryEmbedding.map(value => parseFloat(value));

    const pipeline = [
        {
            $vectorSearch: {
                index: "vector_try_1",
                path: "feature_embedding",
                // queryVector: queryEmbedding.embedding,
                queryVector: processedVector,
                numCandidates: 100,
                limit,
                filter: {
                    CityCode: "111558"
                }
            }

        },
        {
            '$project': {
                _id: 0,
                HotelCode: 1,
                HotelRating: 1,
                CityCode: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ];

    try {
        const dbResult = await hotel.aggregate(pipeline);
        return dbResult;
    } catch (error) {
        console.error("Error executing vector search:", error);
        throw error;
    }
}

module.exports = vectorSearch;


