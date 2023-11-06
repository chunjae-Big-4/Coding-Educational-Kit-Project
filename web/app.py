from flask import Flask, request, jsonify, render_template  

app = Flask(__name__)

# 방향과 숫자 변수. 초기화 
current_direction = 'none'
current_number = 1 # 기본값 1 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/send-direction', methods=['POST'])
def receive_direction():
    global current_direction, current_number
    data = request.json
    direction = data.get('direction')
    number = data.get('number')  # 'number' 값을 받음
    current_direction = direction  # 받은 방향 저장
    current_number = number  # 받은 number 저장
    print(f"받은 방향: {direction}, 받은 숫자: {number}")
    return jsonify({'status': 'success', 'direction': direction, 'number': number})

@app.route('/get-direction', methods=['GET'])
def get_direction():
    global current_direction, current_number
    # 현재 방향과 number 반환
    direction = current_direction
    number = current_number
    current_direction = 'none'  # 초기화
    current_number = 'none'  # 초기화
    return jsonify({'direction': direction, 'number': number})


if __name__ == '__main__':
    app.run(debug=True)
