#!/usr/bin/env python3
"""
並列画像ダウンローダー
earth_observatory_ids.jsonから画像IDを読み込んで20並列でダウンロード
"""

import json
import os
import time
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import threading

class ParallelImageDownloader:
    """並列画像ダウンローダークラス"""
    
    def __init__(self, max_workers: int = 20, debug: bool = False):
        """
        初期化
        
        Args:
            max_workers (int): 並列実行数
            debug (bool): デバッグモードの有効/無効
        """
        self.max_workers = max_workers
        self.debug = debug
        self.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        self.download_stats = {
            'successful': 0,
            'failed': 0,
            'total_size': 0,
            'start_time': None,
            'end_time': None,
            'completed': 0,
            'total_tasks': 0
        }
        self.lock = threading.Lock()
    
    def load_image_ids(self, json_file: str) -> Dict[str, Dict]:
        """
        JSONファイルから画像IDを読み込む
        
        Args:
            json_file (str): JSONファイルのパス
            
        Returns:
            Dict[str, Dict]: 画像IDとメタデータの辞書
        """
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if self.debug:
                print(f"📄 JSONファイル読み込み完了: {len(data)} 件の画像ID")
            
            return data
        except Exception as e:
            print(f"❌ JSONファイル読み込みエラー: {e}")
            return {}
    
    def generate_image_urls(self, image_id: str) -> List[Tuple[str, str, str]]:
        """
        画像IDから複数の解像度のURLを生成（解像度順でソート）
        
        Args:
            image_id (str): 画像ID（例: ISS008-E-19646）
            
        Returns:
            List[Tuple[str, str, str]]: (URL, ファイル名, 解像度) のリスト（解像度順）
        """
        urls = []
        
        # 画像IDからミッション番号を抽出（例: ISS008-E-19646 -> ISS008）
        mission = image_id.split('-')[0] if '-' in image_id else image_id
        
        # 異なる解像度のURLパターン（解像度の低い順）
        url_patterns = [
            (f"https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/{mission}/{image_id}.JPG", "small", "小", 1),
            (f"https://eol.jsc.nasa.gov/DatabaseImages/ESC/large/{mission}/{image_id}.JPG", "large", "大", 2),
            (f"https://eol.jsc.nasa.gov/DatabaseImages/EFS/highres/{mission}/{image_id}.JPG", "highres", "高解像度", 3)
        ]
        
        for url, size, description, priority in url_patterns:
            filename = f"{image_id}.JPG"  # ディレクトリ分けしないので、シンプルなファイル名
            urls.append((url, filename, description, priority))
        
        # 解像度の高い順でソート（priorityの降順）
        urls.sort(key=lambda x: x[3], reverse=True)
        
        return [(url, filename, description) for url, filename, description, _ in urls]
    
    def download_single_image(self, url: str, filepath: str, image_id: str, resolution: str) -> Tuple[bool, str, Dict]:
        """
        単一画像をダウンロード
        
        Args:
            url (str): 画像URL
            filepath (str): 保存先ファイルパス
            image_id (str): 画像ID
            resolution (str): 解像度
            
        Returns:
            Tuple[bool, str, Dict]: (成功フラグ, メッセージ, 情報)
        """
        try:
            # ディレクトリが存在しない場合は作成
            Path(filepath).parent.mkdir(parents=True, exist_ok=True)
            
            # curlコマンドを実行
            curl_cmd = [
                'curl', '-s', '-L',           # サイレントモード、リダイレクトに従う
                '-o', filepath,               # 出力ファイル名
                '-H', f'User-Agent: {self.user_agent}',
                '--connect-timeout', '30',    # 接続タイムアウト
                '--max-time', '120',          # 最大実行時間
                '--write-out', 'HTTP_CODE:%{http_code}|SIZE:%{size_download}|TIME:%{time_total}',
                url
            ]
            
            start_time = time.time()
            result = subprocess.run(curl_cmd, capture_output=True, text=True, timeout=150)
            end_time = time.time()
            execution_time = end_time - start_time
            
            if result.returncode == 0 and os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                
                # 出力から情報を抽出
                info = self._parse_curl_output(result.stdout)
                info.update({
                    'file_size': file_size,
                    'execution_time': execution_time,
                    'image_id': image_id,
                    'resolution': resolution
                })
                
                # 統計情報を更新
                with self.lock:
                    self.download_stats['successful'] += 1
                    self.download_stats['total_size'] += file_size
                    self.download_stats['completed'] += 1
                
                success_msg = f"{image_id} ({resolution}): {file_size:,} バイト ({execution_time:.2f}秒)"
                
                if self.debug:
                    print(f"✅ {success_msg}")
                
                return True, success_msg, info
            else:
                error_msg = f"{image_id} ({resolution}): ダウンロード失敗"
                if self.debug:
                    print(f"❌ {error_msg}")
                
                with self.lock:
                    self.download_stats['failed'] += 1
                    self.download_stats['completed'] += 1
                
                return False, error_msg, {}
                
        except subprocess.TimeoutExpired:
            error_msg = f"{image_id} ({resolution}): タイムアウト"
            if self.debug:
                print(f"❌ {error_msg}")
            
            with self.lock:
                self.download_stats['failed'] += 1
                self.download_stats['completed'] += 1
            
            return False, error_msg, {}
        except Exception as e:
            error_msg = f"{image_id} ({resolution}): エラー - {e}"
            if self.debug:
                print(f"❌ {error_msg}")
            
            with self.lock:
                self.download_stats['failed'] += 1
                self.download_stats['completed'] += 1
            
            return False, error_msg, {}
    
    def _parse_curl_output(self, output: str) -> Dict:
        """curlの出力から情報を抽出"""
        info = {}
        try:
            for line in output.split('\n'):
                if 'HTTP_CODE:' in line:
                    info['http_code'] = line.split('HTTP_CODE:')[1].split('|')[0]
                elif 'SIZE:' in line:
                    info['size_download'] = int(line.split('SIZE:')[1].split('|')[0])
                elif 'TIME:' in line:
                    info['time_total'] = float(line.split('TIME:')[1])
        except Exception:
            pass
        return info
    
    def print_progress(self):
        """進捗情報を表示"""
        with self.lock:
            completed = self.download_stats['completed']
            total = self.download_stats['total_tasks']
            successful = self.download_stats['successful']
            failed = self.download_stats['failed']
            total_size = self.download_stats['total_size']
            
            if total > 0:
                progress_percent = (completed / total) * 100
                print(f"\r📊 進捗: {completed}/{total} ({progress_percent:.1f}%) | ✅ 成功: {successful} | ❌ 失敗: {failed} | 📄 サイズ: {total_size:,} バイト", end="", flush=True)
    
    def select_second_best_image(self, image_id: str, downloaded_files: List[Dict]) -> Optional[Dict]:
        """
        複数解像度から2番目に解像度の高い画像を選択
        
        Args:
            image_id (str): 画像ID
            downloaded_files (List[Dict]): ダウンロードされたファイルのリスト
            
        Returns:
            Optional[Dict]: 選択された2番目に解像度の高いファイル情報
        """
        if not downloaded_files:
            return None
        
        # ファイルサイズでソート（大きい順）
        sorted_files = sorted(downloaded_files, key=lambda x: x.get('file_size', 0), reverse=True)
        
        # 2番目に大きなファイルを選択（存在する場合）
        if len(sorted_files) >= 2:
            second_best_file = sorted_files[1]
        else:
            # 1つしかない場合はそれを使用
            second_best_file = sorted_files[0]
        
        if self.debug:
            print(f"🎯 {image_id}: 2番目解像度選択 - {second_best_file['resolution']} ({second_best_file.get('file_size', 0):,} バイト)")
        
        return second_best_file
    
    def download_images_parallel(self, json_file: str, base_dir: str = "downloads") -> Dict:
        """
        並列で画像をダウンロード
        
        Args:
            json_file (str): JSONファイルのパス
            base_dir (str): ベースディレクトリ
            
        Returns:
            Dict: ダウンロード結果
        """
        # JSONファイルを読み込み
        image_data = self.load_image_ids(json_file)
        if not image_data:
            return {'error': 'JSONファイルの読み込みに失敗しました'}
        
        # ダウンロードタスクを準備
        download_tasks = []
        for image_id, metadata in image_data.items():
            # 全解像度を取得
            urls = self.generate_image_urls(image_id)
            for url, filename, resolution in urls:
                # 一時ファイル名（解像度付き）
                temp_filename = f"{image_id}_{resolution}.JPG"
                filepath = os.path.join(base_dir, temp_filename)
                download_tasks.append((url, filepath, image_id, resolution))
        
        if self.debug:
            print(f"🚀 並列ダウンロード開始: {len(download_tasks)} ファイル ({self.max_workers} 並列)")
            print(f"📁 ベースディレクトリ: {base_dir}")
        
        # 統計情報をリセット
        self.download_stats = {
            'successful': 0,
            'failed': 0,
            'total_size': 0,
            'start_time': time.time(),
            'end_time': None,
            'completed': 0,
            'total_tasks': len(download_tasks)
        }
        
        # 画像IDごとのダウンロード結果を格納
        image_downloads = {}
        
        # 並列ダウンロード実行
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # タスクを送信
            future_to_task = {
                executor.submit(self.download_single_image, url, filepath, image_id, resolution): (url, filepath, image_id, resolution)
                for url, filepath, image_id, resolution in download_tasks
            }
            
            # 完了したタスクを処理
            for future in as_completed(future_to_task):
                url, filepath, image_id, resolution = future_to_task[future]
                try:
                    success, message, info = future.result()
                    
                    if success:
                        # 画像IDごとに結果を格納
                        if image_id not in image_downloads:
                            image_downloads[image_id] = []
                        
                        image_downloads[image_id].append({
                            'image_id': image_id,
                            'resolution': resolution,
                            'filepath': filepath,
                            'message': message,
                            'info': info,
                            'file_size': info.get('file_size', 0)
                        })
                    else:
                        # 失敗した場合も記録
                        if image_id not in image_downloads:
                            image_downloads[image_id] = []
                        
                        image_downloads[image_id].append({
                            'image_id': image_id,
                            'resolution': resolution,
                            'filepath': filepath,
                            'error': message,
                            'file_size': 0
                        })
                    
                    # 進捗表示
                    self.print_progress()
                        
                except Exception as e:
                    # 例外の場合も記録
                    if image_id not in image_downloads:
                        image_downloads[image_id] = []
                    
                    image_downloads[image_id].append({
                        'image_id': image_id,
                        'resolution': resolution,
                        'filepath': filepath,
                        'error': f"例外エラー: {e}",
                        'file_size': 0
                    })
                    
                    # 例外の場合も進捗を更新
                    with self.lock:
                        self.download_stats['completed'] += 1
                    self.print_progress()
        
        # 各画像IDについて2番目に解像度の高い画像を選択
        results = {
            'successful': [],
            'failed': [],
            'total_tasks': len(download_tasks)
        }
        
        for image_id, downloads in image_downloads.items():
            # 成功したダウンロードのみをフィルタ
            successful_downloads = [d for d in downloads if 'error' not in d and d.get('file_size', 0) > 0]
            
            if successful_downloads:
                # 2番目に解像度の高い画像を選択
                second_best_download = self.select_second_best_image(image_id, successful_downloads)
                if second_best_download:
                    # 最終的なファイル名にリネーム
                    final_filename = f"{image_id}.JPG"
                    final_filepath = os.path.join(base_dir, final_filename)
                    
                    try:
                        # ファイルをリネーム
                        os.rename(second_best_download['filepath'], final_filepath)
                        
                        # 他の解像度のファイルを削除
                        for download in downloads:
                            if download['filepath'] != second_best_download['filepath'] and os.path.exists(download['filepath']):
                                os.remove(download['filepath'])
                        
                        results['successful'].append({
                            'image_id': image_id,
                            'resolution': second_best_download['resolution'],
                            'filepath': final_filepath,
                            'message': f"2番目解像度選択: {second_best_download['resolution']}",
                            'info': second_best_download['info']
                        })
                        
                    except Exception as e:
                        results['failed'].append({
                            'image_id': image_id,
                            'resolution': 'unknown',
                            'filepath': final_filepath,
                            'error': f"ファイル処理エラー: {e}"
                        })
            else:
                # 全ての解像度で失敗
                results['failed'].append({
                    'image_id': image_id,
                    'resolution': 'all',
                    'filepath': f"{base_dir}/{image_id}.JPG",
                    'error': "全ての解像度でダウンロード失敗"
                })
        
        # 統計情報を更新
        self.download_stats['end_time'] = time.time()
        results['stats'] = self.download_stats.copy()
        
        return results
    
    def print_summary(self, results: Dict):
        """ダウンロード結果のサマリーを表示"""
        stats = results.get('stats', {})
        total_time = stats.get('end_time', 0) - stats.get('start_time', 0)
        
        print("\n" + "=" * 60)
        print("📊 ダウンロード完了サマリー")
        print("=" * 60)
        print(f"📄 総タスク数: {results.get('total_tasks', 0)}")
        print(f"✅ 成功: {len(results.get('successful', []))} ファイル")
        print(f"❌ 失敗: {len(results.get('failed', []))} ファイル")
        print(f"📏 総ダウンロードサイズ: {stats.get('total_size', 0):,} バイト")
        print(f"⏱️  総実行時間: {total_time:.2f}秒")
        print(f"🚀 並列数: {self.max_workers}")
        
        if total_time > 0:
            avg_speed = stats.get('total_size', 0) / total_time / 1024 / 1024  # MB/s
            print(f"📈 平均速度: {avg_speed:.2f} MB/s")
        
        # 失敗したファイルがあれば表示
        if results.get('failed'):
            print(f"\n❌ 失敗したファイル:")
            for failed in results['failed'][:10]:  # 最初の10件のみ表示
                print(f"   - {failed['image_id']} ({failed['resolution']}): {failed['error']}")
            if len(results['failed']) > 10:
                print(f"   ... 他 {len(results['failed']) - 10} 件")


def main():
    """メイン関数"""
    print("🚀 並列画像ダウンローダー")
    print("=" * 60)
    
    # ダウンローダーを初期化（20並列、デバッグモード有効）
    downloader = ParallelImageDownloader(max_workers=20, debug=True)
    
    # JSONファイルのパス
    json_file = "earth_observatory_ids.json"
    
    # 並列ダウンロード実行
    results = downloader.download_images_parallel(json_file, "downloads")
    
    # 結果を表示
    downloader.print_summary(results)
    
    # 成功したファイルの例を表示
    if results.get('successful'):
        print(f"\n✅ 成功例（最初の5件）:")
        for success in results['successful'][:5]:
            print(f"   - {success['image_id']} ({success['resolution']}): {success['filepath']}")


if __name__ == "__main__":
    main()
