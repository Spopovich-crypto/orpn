// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Tauriアプリの本体を起動するコード
fn main() {
    tauri::Builder::default()
        // lib.rs にあるコマンド関数をここに登録
        .invoke_handler(tauri::generate_handler![run_csv_to_bokeh])
        .run(tauri::generate_context!())
        .expect("Tauriアプリの起動に失敗しました");
}

// ↑ このファイルでは「何を起動するか」しか書かない
// ロジックは全部 lib.rs に追い出す方が整理しやすい
