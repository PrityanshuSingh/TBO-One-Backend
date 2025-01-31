const generateEmbedding = require('../embedding/generateEmbedding');
const hotel = require("../../models/Hotel")

const vectorSearch = async (query, cityCode) => {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) {
        return "invalid!!";
    }

    const pipeline = [
        {
            $match: { cityCode } 
        },
        {
            $vectorSearch: {
                index: "vector_try_1",
                queryVector: queryEmbedding.embedding,
                path: "feature_embedding",
                numCandidates: 100,
                limit: 4, // Limit to top 4 results
                project: {
                    _id: 0,
                    text: 1,
                    feature_embedding: 0,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        }
    ];

    try {
        const dbResult = await hotels.aggregate(pipeline).toArray();
        return dbResult;
    } catch (error) {
        console.error("Error executing vector search:", error);
        throw error;
    }
}

module.exports = vectorSearch;
