import cv2
from PIL import Image, ImageDraw, ImageFont
import os
import shutil
import numpy as np
import torch
# 폴더 생성 및 초기화 함수
def setup_folder(folder_path):
    # 이미 폴더가 있으면 내용을 삭제
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
    # 폴더 생성
    try:
        os.makedirs(folder_path)
        full_path = os.path.abspath(folder_path)
        # print(f"폴더 생성 및 초기화: {full_path}")
    except Exception as e:
        print(f"폴더 생성 및 초기화 실패: {e}")
        raise
# 마우스 콜백 함수
def take_picture(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        img_name = "images/1.png"  # 이미지 이름을 "1.png"로 고정
        cv2.imwrite(img_name, param)
        # print(f"이미지 저장: {img_name}")
        process_image(img_name)
# 이미지 처리 함수
def process_image(image_path):
    try:
        result = model(image_path)
        if len(result.xyxy[0]) < 2:  # 검출된 객체가 2개 미만인 경우
            raise ValueError("객체 인식 실패")
        direction = result.names[int(result.xyxy[0][0][5])]
        number = result.names[int(result.xyxy[0][1][5])]
        print(f"{direction}, {number}")
    except Exception as e:
        print(f"인식 오류, 다시 찍어주세요: {e}")
        # 인식 실패 시, 오류 메시지 출력하고 함수 종료
        return
# YOLO 모델 로드
path = "../simple_yolo/best.pt"
model = torch.hub.load('ultralytics/yolov5', 'custom', path, force_reload=False)
# 한글 폰트 설정
font_path = 'C:/Windows/Fonts/malgun.ttf'  # 폰트 파일 경로
font = ImageFont.truetype(font_path, 20)
# 이미지 폴더 설정 및 초기화
images_folder = 'images'
setup_folder(images_folder)
# 카메라 속성 설정
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
# 이미지 카운터
image_counter = 1
# 마우스 콜백 함수를 설정할 윈도우 생성
cv2.namedWindow('Mirrored Webcam')
while True:
    # 웹캠으로부터 영상 읽기
    ret, frame = cap.read()
    if not ret:
        print("웹캠으로부터 영상을 가져올 수 없습니다.")
        break
    # 한글 텍스트를 추가하기 위해 PIL 이미지로 변환
    frame_pil = Image.fromarray(frame)
    # OpenCV 형태로 다시 변환
    frame = np.array(frame_pil)
    # 영상 보여주기
    cv2.imshow('Mirrored Webcam', frame)
    # 마우스 콜백 함수에 현재 프레임을 전달
    cv2.setMouseCallback('Mirrored Webcam', take_picture, frame)
    # 'q'를 누르면 게임 종료 및 폴더 초기화
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
# 자원 해제
cap.release()
cv2.destroyAllWindows()