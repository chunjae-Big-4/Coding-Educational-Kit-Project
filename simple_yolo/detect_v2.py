import torch
path = './best.pt'
model = torch.hub.load('ultralytics/yolov5', 'custom', path, force_reload=True)
image_path = './data/test2.png'
result = model(image_path)
direction = result.names[int(result.xyxy[0][0][5])]
number = result.names[int(result.xyxy[0][1][5])]
