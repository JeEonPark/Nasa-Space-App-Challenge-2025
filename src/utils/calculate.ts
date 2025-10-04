/**
 * Haversine式を使用して2点間の距離を計算
 * @param lat1 地点1の緯度
 * @param lon1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lon2 地点2の経度
 * @returns 距離（km）
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * 距離に基づいてスコアを計算
 * @param distance 距離（km）
 * @param maxScore 最大スコア（デフォルト: 5000）
 * @returns スコア
 */
export function calculateScore(distance: number, maxScore: number = 5000): number {
    return Math.max(0, maxScore - distance);
}

/**
 * 回答時間に基づいてボーナススコアを計算
 * @param answerTime 回答時間（秒）
 * @param maxBonus 最大ボーナス（デフォルト: 1000）
 * @returns ボーナススコア
 */
export function calculateTimeBonus(answerTime: number, maxBonus: number = 1000): number {
    // 30秒以内なら最大ボーナス、それ以降は線形減少
    if (answerTime <= 30) return maxBonus;
    return Math.max(0, maxBonus - (answerTime - 30) * 20);
}

/**
 * 総合スコアを計算（距離スコア + 時間ボーナス）
 * @param distance 距離（km）
 * @param answerTime 回答時間（秒）
 * @param maxDistanceScore 最大距離スコア（デフォルト: 5000）
 * @param maxTimeBonus 最大時間ボーナス（デフォルト: 1000）
 * @returns 総合スコア
 */
export function calculateTotalScore(
    distance: number,
    answerTime: number,
    maxDistanceScore: number = 5000,
    maxTimeBonus: number = 1000
): number {
    const distanceScore = calculateScore(distance, maxDistanceScore);
    const timeBonus = calculateTimeBonus(answerTime, maxTimeBonus);
    return distanceScore + timeBonus;
}
