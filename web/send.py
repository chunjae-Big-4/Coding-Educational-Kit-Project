# send.py
import requests
import subprocess
import ast

server_url = "http://127.0.0.1:5000/send-direction"

while True:
    subprocess.run('python ../yolov5/camera.py')
    result = subprocess.run('python ../simple_yolo/detect.py --weights ./best.pt --source ./test.png',
                            stdout=subprocess.PIPE,
                            text=True)

    output_list = ast.literal_eval(result.stdout.strip())

    direction = output_list[1]
    number = output_list[0]

    try:
        response = requests.post(server_url, json={'direction': direction, 'number': number})
        if response.status_code == 200:
            print('successfully!')
        else:
            print(f'Failed to send direction: {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f'HTTP Request failed: {e}')