# send.py
import requests
import subprocess
import ast


server_url = "http://127.0.0.1:5000/send-direction"

while True:     
    result = subprocess.run('python ../simple_yolo/predict.py',
                            stdout=subprocess.PIPE,
                            text=True)
    output_list = result.stdout.strip().split(', ')
    direction = output_list[0]
    number = output_list[1]
    try:
        response = requests.post(server_url, json={'direction': direction, 'number': number})
        if response.status_code == 200:
            print('successfully!')
        else:
            print(f'Failed to send direction: {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f'HTTP Request failed: {e}')


# 카메라 없을때 테스트 용 
# server_url = "http://127.0.0.1:5000/send-direction"
# while True:
#     direction = input('Enter direction (up, down, left, right): ')
#     number = input('Enter number (1, 2, 3): ')
#     try:
#         response = requests.post(server_url, json={'direction': direction, 'number': number})
#         if response.status_code == 200:
#             print('successfully!')
#         else:
#             print(f'Failed to send direction: {response.status_code}')
#     except requests.exceptions.RequestException as e:
#         print(f'HTTP Request failed: {e}')