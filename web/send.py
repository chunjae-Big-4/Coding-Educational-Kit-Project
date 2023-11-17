import cv2
import numpy as np
import requests
import threading
import torch

server_url = "http://127.0.0.1:5000/send-direction"  # 서버의 URL 주소

# YOLO 모델 로드
path = "../simple_yolo/best.pt"  # 모델 파일 경로
model = torch.hub.load('ultralytics/yolov5', 'custom', path, force_reload=False)  # YOLO 모델을 로드

# 이미지 캡처 및 인식 함수
def capture_and_recognize(frame):
    img_name = "images/1.png"  # 이미지 파일 이름 지정
    cv2.imwrite(img_name, frame)  # 웹캠 프레임을 이미지 파일로 저장

    try:
        result = model(img_name)  # YOLO 모델을 사용하여 이미지 인식
        if len(result.xyxy[0]) != 2:  # 인식된 객체가 2개 미만, 3개 이상인 경우 오류 발생
            raise ValueError("객체 인식 실패")

        # 첫 번째 객체가 방향 또는 숫자인지 확인
        if result.names[int(result.xyxy[0][0][5])] in ['right', 'left', 'up', 'down']:
            direction = result.names[int(result.xyxy[0][0][5])]
            number = result.names[int(result.xyxy[0][1][5])]
        elif result.names[int(result.xyxy[0][0][5])] in ['1', '2', '3']:
            direction = result.names[int(result.xyxy[0][1][5])]
            number = result.names[int(result.xyxy[0][0][5])]
        else:
            raise ValueError("인식된 객체가 유효하지 않습니다.")

        # 서버로 결과 전송
        send_to_server(direction, number)
    except Exception as e:
        print(f"인식 오류, 다시 찍어주세요: {e}")  # 인식 오류 시 메시지 출력
        return


# 서버로 결과 전송 함수
def send_to_server(direction, number):
    try:
        response = requests.post(server_url, json={'direction': direction, 'number': number})  # 서버로 HTTP POST 요청 전송
        if response.status_code == 200:
            print('Successfully sent data to server')  # 전송 성공 시 메시지 출력
        else:
            print(f'Failed to send data: {response.status_code}')  # 전송 실패 시 오류 메시지 출력
    except requests.exceptions.RequestException as e:
        print(f'HTTP Request failed: {e}')  # HTTP 요청 실패 시 메시지 출력

cap = cv2.VideoCapture(0)  # 웹캠으로부터 영상을 캡처하기 위한 객체 생성

while True:
    ret, frame = cap.read()  # 웹캠으로부터 프레임 읽기
    if not ret:
        print("Cannot retrieve image from webcam.")  # 프레임 읽기 실패 시 메시지 출력
        break

    cv2.imshow('Webcam View', frame)  # 읽은 프레임을 화면에 표시

    key = cv2.waitKey(1)  # 키보드 입력 대기
    if key & 0xFF == ord('q'):  # 'q' 키가 눌리면 반복문 탈출
        break
    elif key & 0xFF == ord(' '):  # 스페이스바가 눌리면 이미지 캡처 및 인식
        threading.Thread(target=capture_and_recognize, args=(frame,)).start()  # 새 스레드에서 이미지 캡처 및 인식 수행

cap.release()  # 웹캠 자원 해제
cv2.destroyAllWindows()  # 모든 OpenCV 창 닫기


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