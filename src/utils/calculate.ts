/**
 * Haversine式を使用して2点間の距離を計算
 * @param lat1 地点1の緯度
 * @param lon1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lon2 地点2の経度
 * @returns 距離（km）
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371.0088; // Earth's mean radius in km
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
 * @param maxScore 最大スコア（デフォルト: 7000）
 * @returns スコア
 */
export function calculateScore(distance: number, maxScore: number = 7000): number {
    // Maximum possible distance on Earth (half the circumference)
    // Earth's mean radius is 6371.0088km, so max distance = π * R
    const maxDistance = Math.PI * 6371.0088;
    // Distance 0km = 7000 points, max distance = 0 points
    return Math.max(0, maxScore * (1 - distance / maxDistance));
}

/**
 * 回答時間に基づいてボーナススコアを計算
 * @param answerTime 回答時間（秒）
 * @param maxBonus 最大ボーナス（デフォルト: 1000）
 * @returns ボーナススコア
 */
export function calculateTimeBonus(answerTime: number, maxBonus: number = 3000): number {
    // x < 10: 3000 points
    // 10 <= x <= 180: 3000 * (1 - (log(1 + 0.001 * (x - 10)) / log(1 + 0.001 * (180 - 10)))^0.5)
    // x > 180: 0 points
    if (answerTime < 10) {
        return 3000;
    } else if (answerTime <= 180) {
        const logNumerator = Math.log(1 + 0.001 * (answerTime - 10));
        const logDenominator = Math.log(1 + 0.001 * (180 - 10));
        const ratio = logNumerator / logDenominator;
        return 3000 * (1 - Math.pow(ratio, 0.5));
    } else {
        return 0;
    }
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
    maxDistanceScore: number = 7000,
    maxTimeBonus: number = 3000
): number {
    const distanceScore = calculateScore(distance, maxDistanceScore);
    const timeBonus = calculateTimeBonus(answerTime, maxTimeBonus);
    return distanceScore + timeBonus;
}
