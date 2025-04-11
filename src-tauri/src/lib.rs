// src-tauri/src/lib.rs

// Commandや標準出力、スレッド、IO関連を使うためのimport
use std::process::{Command, Stdio};
use std::io::{BufReader, BufRead};
use std::thread;

// Tauriが提供する型やイベント送信のためのtrait
use tauri::{Window, Manager};

// Reactから呼び出すために tauri::command マクロをつける
#[tauri::command]
pub fn run_csv_to_bokeh(
    window: Window,        // UIウィンドウ（emitするのに必要）
    py_path: String,       // Pythonの実行ファイルパス（例："python"）
    args: Vec<String>      // Pythonに渡す引数（["src-python/gen_bokeh.py"] など）
) -> Result<String, String> {
    
    // Pythonを subprocess として起動
    let mut child = Command::new(py_path)
        .args(args)
        .stdout(Stdio::piped())    // stdout を読み取れるように
        .spawn()
        .map_err(|e| format!("Python実行エラー: {}", e))?;

    // stdout を取得
    let stdout = child.stdout.take().ok_or("stdoutを取得できません")?;

    // UIにログを送るため、window をクローン（moveできないので clone する）
    let window_clone = window.clone();

    // スレッドを作って、stdout を1行ずつ読み取る
    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(log_line) = line {
                // React側へ "log-update" というイベント名で送信
                window_clone.emit("log-update", log_line).ok();
            }
        }
    });

    // Pythonが終了するまで wait（blocking）
    let status = child.wait().map_err(|e| format!("wait失敗: {}", e))?;

    // 成功したかどうかを確認して結果を返す
    if status.success() {
        Ok("処理完了".to_string())
    } else {
        Err("Pythonスクリプトが異常終了しました".to_string())
    }
}
