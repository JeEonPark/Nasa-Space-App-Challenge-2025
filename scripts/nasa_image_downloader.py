#!/usr/bin/env python3
"""
NASA画像ダウンローダー
curlコマンドを使用してNASAの画像を効率的にダウンロード
"""

import subprocess
import time
import os
from typing import Optional, Tuple, Dict
from pathlib import Path

class NasaImageDownloader:
    """NASA画像ダウンローダークラス"""
    
    def __init__(self, debug: bool = False):
        """
        初期化
        
        Args:
            debug (bool): デバッグモードの有効/無効
        """
        self.debug = debug
        self.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    
    def download_image(self, url: str, filename: str, show_progress: bool = False) -> Tuple[bool, str, Dict]:
        """
        画像をダウンロード
        
        Args:
            url (str): ダウンロードする画像のURL
            filename (str): 保存するファイル名
            show_progress (bool): プログレスバーを表示するか
            
        Returns:
            Tuple[bool, str, Dict]: (成功フラグ, メッセージ, 画像情報)
        """
        try:
            if self.debug:
                print(f"🚀 画像ダウンロード開始: {url}")
                print(f"📁 保存先: {filename}")
            
            start_time = time.time()
            
            # ディレクトリが存在しない場合は作成
            file_path = Path(filename)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # curlコマンドを構築
            curl_cmd = [
                'curl', '-s', '-L',           # サイレントモード、リダイレクトに従う
                '-o', filename,               # 出力ファイル名
                '-H', f'User-Agent: {self.user_agent}',
                '--connect-timeout', '30',    # 接続タイムアウト
                '--max-time', '120',          # 最大実行時間
                '--write-out', 'HTTP_CODE:%{http_code}|SIZE:%{size_download}|TIME:%{time_total}',
                url
            ]
            
            # プログレス表示が必要な場合は-#オプションを追加
            if show_progress:
                curl_cmd.insert(2, '-#')
            
            # curlコマンドを実行
            result = subprocess.run(curl_cmd, capture_output=True, text=True, timeout=150)
            
            end_time = time.time()
            execution_time = end_time - start_time
            
            # 結果を解析
            if result.returncode == 0:
                # ファイルサイズを確認
                if os.path.exists(filename):
                    file_size = os.path.getsize(filename)
                    
                    # 出力から情報を抽出
                    info = self._parse_curl_output(result.stdout)
                    info['file_size'] = file_size
                    info['execution_time'] = execution_time
                    
                    success_msg = f"画像ダウンロード成功: {file_size:,} バイト ({execution_time:.2f}秒)"
                    
                    if self.debug:
                        print(f"✅ {success_msg}")
                        print(f"📊 HTTPステータス: {info.get('http_code', 'N/A')}")
                        print(f"📄 ファイルサイズ: {file_size:,} バイト")
                        print(f"⏱️  実行時間: {execution_time:.2f}秒")
                    
                    return True, success_msg, info
                else:
                    error_msg = "ファイルが作成されませんでした"
                    if self.debug:
                        print(f"❌ {error_msg}")
                    return False, error_msg, {}
            else:
                error_msg = f"curlエラー: {result.stderr}"
                if self.debug:
                    print(f"❌ {error_msg}")
                return False, error_msg, {}
                
        except subprocess.TimeoutExpired:
            error_msg = "ダウンロード: タイムアウト"
            if self.debug:
                print(f"❌ {error_msg}")
            return False, error_msg, {}
        except Exception as e:
            error_msg = f"ダウンロード: エラー - {e}"
            if self.debug:
                print(f"❌ {error_msg}")
            return False, error_msg, {}
    
    def get_image_info(self, url: str) -> Tuple[bool, Dict]:
        """
        画像の情報を取得（ダウンロードせずにヘッダー情報のみ）
        
        Args:
            url (str): 画像のURL
            
        Returns:
            Tuple[bool, Dict]: (成功フラグ, 画像情報辞書)
        """
        try:
            if self.debug:
                print(f"🔍 画像情報取得: {url}")
            
            start_time = time.time()
            
            # HEADリクエストで画像情報を取得
            curl_cmd = [
                'curl', '-s', '-I',     # サイレントモード、HEADリクエスト
                '-L',                   # リダイレクトに従う
                '-H', f'User-Agent: {self.user_agent}',
                '--connect-timeout', '30',
                '--max-time', '60',
                url
            ]
            
            result = subprocess.run(curl_cmd, capture_output=True, text=True, timeout=90)
            
            end_time = time.time()
            execution_time = end_time - start_time
            
            if result.returncode == 0:
                headers = {}
                for line in result.stdout.split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        headers[key.strip().lower()] = value.strip()
                
                info = {
                    'headers': headers,
                    'execution_time': execution_time,
                    'content_type': headers.get('content-type', 'N/A'),
                    'content_length': headers.get('content-length', 'N/A'),
                    'status': headers.get('http/1.1', 'N/A')
                }
                
                if self.debug:
                    print(f"✅ 画像情報取得成功: {execution_time:.2f}秒")
                    print(f"📊 ステータス: {info['status']}")
                    print(f"📄 Content-Type: {info['content_type']}")
                    print(f"📏 Content-Length: {info['content_length']}")
                
                return True, info
            else:
                error_msg = f"画像情報取得エラー: {result.stderr}"
                if self.debug:
                    print(f"❌ {error_msg}")
                return False, {}
                
        except subprocess.TimeoutExpired:
            error_msg = "画像情報取得: タイムアウト"
            if self.debug:
                print(f"❌ {error_msg}")
            return False, {}
        except Exception as e:
            error_msg = f"画像情報取得: エラー - {e}"
            if self.debug:
                print(f"❌ {error_msg}")
            return False, {}
    
    def _parse_curl_output(self, output: str) -> Dict:
        """
        curlの出力から情報を抽出
        
        Args:
            output (str): curlの出力
            
        Returns:
            Dict: 抽出された情報
        """
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
    
    def download_multiple_images(self, url_filename_pairs: list, show_progress: bool = False) -> Dict:
        """
        複数の画像をダウンロード
        
        Args:
            url_filename_pairs (list): [(url, filename), ...] のリスト
            show_progress (bool): プログレスバーを表示するか
            
        Returns:
            Dict: ダウンロード結果の辞書
        """
        results = {
            'successful': [],
            'failed': [],
            'total_time': 0,
            'total_size': 0
        }
        
        start_time = time.time()
        
        for i, (url, filename) in enumerate(url_filename_pairs, 1):
            if self.debug:
                print(f"\n📋 画像 {i}/{len(url_filename_pairs)}: {filename}")
            
            success, message, info = self.download_image(url, filename, show_progress)
            
            if success:
                results['successful'].append({
                    'url': url,
                    'filename': filename,
                    'message': message,
                    'info': info
                })
                results['total_size'] += info.get('file_size', 0)
            else:
                results['failed'].append({
                    'url': url,
                    'filename': filename,
                    'error': message
                })
        
        end_time = time.time()
        results['total_time'] = end_time - start_time
        
        if self.debug:
            print(f"\n📊 ダウンロード完了:")
            print(f"   ✅ 成功: {len(results['successful'])} ファイル")
            print(f"   ❌ 失敗: {len(results['failed'])} ファイル")
            print(f"   📄 総サイズ: {results['total_size']:,} バイト")
            print(f"   ⏱️  総時間: {results['total_time']:.2f}秒")
        
        return results


def main():
    """メイン関数"""
    print("🚀 NASA画像ダウンローダー")
    print("=" * 50)
    
    # ダウンローダーを初期化
    downloader = NasaImageDownloader(debug=True)
    
    # テスト用の画像URL
    test_url = "https://eol.jsc.nasa.gov/DatabaseImages/EFS/highres/ISS023/ISS023-E-57948.JPG"
    test_filename = "downloads/nasa_iss_image.jpg"
    
    # 1. 画像情報を取得
    print("\n📋 ステップ1: 画像情報取得")
    print("-" * 30)
    success, info = downloader.get_image_info(test_url)
    
    if success:
        # 2. 画像をダウンロード
        print("\n📋 ステップ2: 画像ダウンロード")
        print("-" * 30)
        success, message, download_info = downloader.download_image(test_url, test_filename, show_progress=True)
        
        if success:
            print(f"✅ {message}")
            
            # 3. 複数画像のダウンロードテスト
            print("\n📋 ステップ3: 複数画像ダウンロードテスト")
            print("-" * 30)
            
            # 異なる解像度の画像をテスト
            test_images = [
                ("https://eol.jsc.nasa.gov/DatabaseImages/ESC/small/ISS023/ISS023-E-57948.JPG", "downloads/small_image.jpg"),
                ("https://eol.jsc.nasa.gov/DatabaseImages/ESC/large/ISS023/ISS023-E-57948.JPG", "downloads/large_image.jpg")
            ]
            
            results = downloader.download_multiple_images(test_images, show_progress=False)
            
            print(f"\n📊 複数画像ダウンロード結果:")
            print(f"   ✅ 成功: {len(results['successful'])} ファイル")
            print(f"   ❌ 失敗: {len(results['failed'])} ファイル")
            print(f"   📄 総サイズ: {results['total_size']:,} バイト")
            print(f"   ⏱️  総時間: {results['total_time']:.2f}秒")
        else:
            print(f"❌ {message}")
    else:
        print("❌ 画像情報取得に失敗したため、ダウンロードをスキップします")
    
    print("\n" + "=" * 50)
    print("✅ テスト完了")


if __name__ == "__main__":
    main()

