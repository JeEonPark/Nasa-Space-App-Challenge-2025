#!/usr/bin/env python3
"""
本格的な並列画像ダウンロード実行スクリプト
earth_observatory_ids.jsonを使用して20並列でダウンロード
"""

import os
import time
from parallel_image_downloader import ParallelImageDownloader

def main():
    """メイン関数"""
    print("🚀 本格的な並列画像ダウンロード実行")
    print("=" * 60)
    
    # JSONファイルの存在確認
    json_file = "earth_observatory_ids.json"
    if not os.path.exists(json_file):
        print(f"❌ JSONファイルが見つかりません: {json_file}")
        return
    
    # ダウンローダーを初期化（30並列、デバッグモード有効）
    print(f"🔧 並列ダウンローダー初期化: 30並列")
    downloader = ParallelImageDownloader(max_workers=30, debug=True)
    
    # 実行開始時刻を記録
    start_time = time.time()
    print(f"⏰ 実行開始時刻: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 並列ダウンロード実行
    print(f"\n🚀 並列ダウンロード開始...")
    results = downloader.download_images_parallel(json_file, "downloads")
    
    # 実行終了時刻を記録
    end_time = time.time()
    total_time = end_time - start_time
    
    # 結果を表示
    downloader.print_summary(results)
    
    # 実行時間の詳細
    print(f"\n⏱️  実行時間詳細:")
    print(f"   開始時刻: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")
    print(f"   終了時刻: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))}")
    print(f"   総実行時間: {total_time:.2f}秒 ({total_time/60:.1f}分)")
    
    # 成功したファイルの統計
    successful_files = results.get('successful', [])
    if successful_files:
        print(f"\n📊 成功ファイル統計:")
        
        # 解像度別統計
        resolution_stats = {}
        for file_info in successful_files:
            resolution = file_info['resolution']
            if resolution not in resolution_stats:
                resolution_stats[resolution] = {'count': 0, 'total_size': 0}
            resolution_stats[resolution]['count'] += 1
            resolution_stats[resolution]['total_size'] += file_info['info'].get('file_size', 0)
        
        for resolution, stats in resolution_stats.items():
            avg_size = stats['total_size'] / stats['count'] if stats['count'] > 0 else 0
            print(f"   {resolution}: {stats['count']} ファイル, 平均 {avg_size:,.0f} バイト")
    
    # 失敗したファイルがあれば詳細を表示
    failed_files = results.get('failed', [])
    if failed_files:
        print(f"\n❌ 失敗ファイル詳細:")
        for failed in failed_files[:20]:  # 最初の20件のみ表示
            print(f"   - {failed['image_id']} ({failed['resolution']}): {failed['error']}")
        if len(failed_files) > 20:
            print(f"   ... 他 {len(failed_files) - 20} 件")
    
    print(f"\n✅ 並列ダウンロード完了!")

if __name__ == "__main__":
    main()
