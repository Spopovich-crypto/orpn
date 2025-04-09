from tauri import command


@command
def import_sensor_data(payload: dict) -> str:
    print("Pythonが受け取ったよ：", payload)
    return "Python側処理完了"
