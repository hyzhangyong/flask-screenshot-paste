from flask import Flask,render_template,jsonify
import base64
import os
import time

app = Flask(__name__)

@app.route('/updateImg',methods=['GET','POST']
def updateImg():
  base64img = request.form.get('scr')
  strs = re.match('^data:imge/(jped|png|gif);base64,',base64img)
  base64img = base64img.replace(strs.group(),'')
  imgdata = base64.b64decode(base64img)
  a,b = str(time.time()).split('.')
  path = os.path.join('/picserver',a + '.png')
  with open(path,'wb') as file:
    file.write(imgdata)
  return jsonify({'success':200,'imgsrc':path})
