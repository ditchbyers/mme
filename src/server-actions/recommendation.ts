export const GetSimilarUserRecommendations = async (currentUserId: any, currentGameId: any) => {
    try {

        const currentUser = currentUserId
        const currentGame = currentGameId
        const response = await fetch(`${process.env.DEV_URL}/user/all/chat/profile?user_id=${currentUser}&game_id?${currentGame}`, {
            method: "GET"
        });


        const data = await response.json();
        if (!response.ok) {
            console.error("Error fetching users:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}
