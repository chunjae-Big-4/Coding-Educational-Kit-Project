import cv2
from PIL import Image, ImageDraw, ImageFont
import os
import shutil
import numpy as np

# 폴더 생성 및 초기화 함수
def setup_folder(folder_path):
    # 이미 폴더가 있으면 내용을 삭제
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
    # 폴더 생성
    try:
        os.makedirs(folder_path)
        full_path = os.path.abspath(folder_path)
        print(f"폴더 생성 및 초기화: {full_path}")
    except Exception as e:
        print(f"폴더 생성 및 초기화 실패: {e}")
        raise


    # 이미 폴더가 있으면 내용을 삭제
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
    # 폴더 생성
    try:
        os.makedirs(folder_path)
        print(f"폴더 생성 및 초기화: {folder_path}")
    except Exception as e:
        print(f"폴더 생성 및 초기화 실패: {e}")
        return False
    return True

# 마우스 콜백 함수
def take_picture(event, x, y, flags, param):
    global image_counter
    if event == cv2.EVENT_LBUTTONDOWN:
        img_name = f"images/1.png"
        cv2.imwrite(img_name, param)
        print(f"이미지 저장: {img_name}")

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
    
    # 프레임을 좌우 대칭으로 뒤집기
    flipped_frame = cv2.flip(frame, 1)

    # 한글 텍스트를 추가하기 위해 PIL 이미지로 변환
    frame_pil = Image.fromarray(flipped_frame)
    draw = ImageDraw.Draw(frame_pil)
    draw.text((100, 70), "방향표", font=font, fill=(0, 255, 0))
    draw.text((370, 70), "숫자", font=font, fill=(0, 255, 0))

    # OpenCV 형태로 다시 변환
    flipped_frame = np.array(frame_pil)

    # 첫 번째 프레임을 영상 위에 그리기
    cv2.rectangle(flipped_frame, (70, 110), (330, 400), (0, 255, 0), 2)
    # 두 번째 프레임을 영상 위에 그리기
    cv2.rectangle(flipped_frame, (370, 110), (620, 400), (0, 255, 0), 2)

    # 화면에 뒤집힌 영상 보여주기
    cv2.imshow('Mirrored Webcam', flipped_frame)

    # 마우스 콜백 함수에 현재 프레임을 전달
    cv2.setMouseCallback('Mirrored Webcam', take_picture, flipped_frame)

    # 'q'를 누르면 게임 종료 및 폴더 초기화
    if cv2.waitKey(1) & 0xFF == ord('q'):
        # setup_folder(images_folder)  # 이미지 저장 폴더를 초기화
        print(f"게임 종료: {images_folder} 폴더가 초기화되었습니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
