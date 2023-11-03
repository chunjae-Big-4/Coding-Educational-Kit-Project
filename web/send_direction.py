# send_direction.py
import requests

server_url = "http://127.0.0.1:5000/send-direction"

while True:
    direction = input('Enter direction (up, down, left, right): ')
    number = input('Enter number (1, 2, 3): ')
    try:
        response = requests.post(server_url, json={'direction': direction, 'number': number})
        if response.status_code == 200:
            print('successfully!')
        else:
            print(f'Failed to send direction: {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f'HTTP Request failed: {e}')
