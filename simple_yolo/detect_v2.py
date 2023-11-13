import torch
# 훈련된 모델 불러오기
path = './best.pt'
model = torch.hub.load('ultralytics/yolov5', 'custom', path, force_reload=True)
# 이미지 경로
image_path = './data/test2.png'
result = model(image_path)
# 변수에 라벨값 저장
direction = result.names[int(result.xyxy[0][0][5])]
number = result.names[int(result.xyxy[0][1][5])]
