document.getElementsByClassName('startinput')[0].focus();
let ws = null;
let username = null;
const id = new Date().getTime().toString();
const music = new Audio('カーソル移動1.mp3');
const text = document.getElementsByClassName('text')[0];
const chatscroll = document.getElementsByClassName('chatscroll')[0];
let editopen = false;
const editnamelist = ['ヽ(ﾟ∀｡)ﾉｳｪ🍡', '全部消す', 'リンク', 'スクラッチキャット', 'live', 'たぼわ'];
const editscroll = document.createElement('div');
editscroll.className = 'editscroll';
editscroll.setAttribute('tabindex','-1');
for(let i = 0;i < editnamelist.length; i++) {
    const editelement = document.createElement('p');
    editelement.textContent = editnamelist[i];
    editscroll.appendChild(editelement);
}
function addchat (usernamevalue, messagevalue) {
    let newelement = document.createElement('div');
    newelement.innerHTML = `${usernamevalue}：${messagevalue}`;
    chatscroll.appendChild(newelement);
    chatscroll.scrollTo(0, chatscroll.scrollHeight);
}
function connect(){
    ws = new WebSocket("wss://cloud.achex.ca/Pascha");
    ws.addEventListener('open',function(e) {
        console.log('open');
        ws.send(JSON.stringify({'auth': 'Pascha', 'password': 'pass'}));
    });
    ws.addEventListener('message',function(e) {
        const obj = JSON.parse(e.data);
        if(obj.auth == 'OK'){
            return;
        }
        if(obj.id === id) {
            return;
        }
        addchat(obj.username, obj.message);
        music.play();
        
    });
    ws.addEventListener('close',function(e) {
        setTimeout(function(){
            connect();
        },3000);  
    });
}
function send(){
    if(text.value !== '') {
        ws.send(JSON.stringify({'to': 'Pascha', 'message': text.value, 'username': username, 'id': id}));
        addchat(username, text.value);
    }
    text.value = '';
}
document.getElementsByClassName('send')[0].addEventListener('click', function(){
    send();
});
text.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        send();
    }
});
document.getElementsByClassName('startbutton')[0].addEventListener('click', function(){
    username = document.getElementsByClassName('startinput')[0].value;
    document.getElementsByClassName('start')[0].remove();
    connect();
});
document.addEventListener('click', function(e) {
    if (editopen === true) {
        if (e.target.parentElement.className === 'editscroll') {
            const editname = editnamelist.indexOf(e.target.textContent);
            if (editname === 0) {
                text.value += 'ー<font color="pink">ヽ(ﾟ∀｡)ﾉ<font color="black">ヽ(ﾟ∀｡)ﾉ<font color="#a2ffa2">ヽ(ﾟ∀｡)ﾉ</font>ーーー';
                text.focus();
            }
            if (editname === 1) {
                if (confirm('本当にやるんだな？')) {
                    chatscroll.innerHTML = '';
                }
            }
            if (editname === 2) {
                const inputurl = prompt('urlを入力');
                text.value += `<button onclick = "window.open('${inputurl}')">${inputurl}</button>`;
                text.focus();
            }
            if (editname === 3) {
                text.value += '<img src="cat.svg" width="24px" height="24px">';
                text.focus();
            }
            if (editname === 4) {
                if (confirm('本当にやるんだな？')) {
                    const bodyelement = document.getElementsByTagName('body')[0];
                    const video = document.createElement('video');
                    video.autoplay = true;
                    video.style = 'display:none;';
                    bodyelement.appendChild(video);
                    const canvas = document.createElement('canvas');
                    canvas.style = 'display:none;';
                    bodyelement.appendChild(canvas);
                    canvascontext = canvas.getContext('2d');
                    navigator.mediaDevices.getDisplayMedia({
                        audio: false,
                        video: true,
                        preferCurrentTab: true
                    }).then(function(stream) {
                        video.srcObject = stream;
                    });
                    function canvasset() {
                        canvascontext.drawImage(video, 0, 0, canvas.width, canvas.height);
                        requestAnimationFrame(canvasset);
                    }
                    canvasset();
                    const socket = new WebSocket('wss://cloud.achex.ca/Pastalive');
                    socket.addEventListener('open', function(e) {
                        socket.send(JSON.stringify({'auth': 'Pastalive', 'password': 'pass'}));
                        const interval = setInterval(function() {
                            socket.send(JSON.stringify({'to': 'Pastalive', 'message': canvas.toDataURL('image/jpeg')}));
                        }, 100);
                        socket.addEventListener('close', function(e) {
                            clearInterval(interval);
                        });
                    });
                    text.value += `<button onclick = "const chatscroll = document.getElementsByClassName('chatscroll')[0];
                    const canvas = document.createElement('canvas');
                    canvas.style = 'position: sticky;top: 0;';
                    chatscroll.appendChild(canvas);
                    const canvascontext = canvas.getContext('2d');
                    const image = new Image();
                    const socket = new WebSocket('wss://cloud.achex.ca/Pastalive');
                    socket.addEventListener('open', function(e) {
                        socket.send(JSON.stringify({'auth': 'Pastalive', 'password': 'pass'}));
                        socket.addEventListener('message', function(e) {
                            const obj = JSON.parse(e.data);
                            if(obj.auth == 'OK'){
                                return;
                            }
                            image.src = obj.message;
                            image.onload = function() {
                                canvascontext.clearRect(0, 0, canvas.width, canvas.height);
                                canvascontext.drawImage(image, 0, 0, canvas.width, canvas.width / 2);
                            };
                        });
                    });">live</button>`;
                }
            }
            if (editname === 5) {
                const inputurl = prompt('プロジェクトidを入力');
                let newelement = document.createElement('div');
                newelement.innerHTML = `<iframe src="https://turbowarp.org/${inputurl}/embed" width="499" height="416" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen style="position: absolute;top: 0px;left:0px;"></iframe>`;
                chatscroll.appendChild(newelement);
                
            }
        }
        editscroll.remove();
        editopen = false;
    }else if (e.target === document.getElementsByClassName('edit')[0]){
        document.getElementsByClassName('main')[0].appendChild(editscroll);
        editopen = true;
    }
});
