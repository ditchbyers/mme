'use server';

export const GetSimilarUserRecommendations = async (currentUserId: any, currentGameId: any) => {
    try {

        const currentUser = currentUserId
        const currentGame = currentGameId
        const response = await fetch(
            `${process.env.DEV_URL}/recommendation/recommend/users?user_id=${currentUser}&game_id=${currentGame}`,
            {
                method: "GET",
            }
        )
        
        const data = await response.json();
        console.log("data", data)
        if (!response.ok) {
            console.error("Error fetching users:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }
        console.log("data", data)
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}
