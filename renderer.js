// 随机消息数组
const messages = [
  "主人你在摸鱼吗？",
  "好困哦~",
  "代码写完啦？",
  "今天天气真好！",
  "一起加油吧！",
  "我饿了...",
  "主人陪我玩嘛！",
  "睡觉时间到了~",
  "编程真有趣！",
  "明天会更好！"
];

// 获取元素
const slime = document.getElementById('slime');
const petElement = slime; // 史莱姆主元素

// 鼠标拖拽相关变量
let isDragging = false;
let startX = 0, startY = 0;

// 显示气泡消息
function showBubble(message) {
  // 先移除旧气泡
  const oldBubble = document.querySelector('.bubble');
  if (oldBubble) {
    oldBubble.remove();
  }
  
  // 创建新气泡
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = message;
  
  // 添加到容器中
  const container = document.getElementById('pet-container');
  container.appendChild(bubble);
  
  // 显示气泡
  bubble.classList.add('show');
  
  // 3秒后移除气泡
  setTimeout(() => {
    bubble.remove();
  }, 3000);
}

// 鼠标按下事件
petElement.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // 只响应左键
  isDragging = false;
  startX = e.clientX;
  startY = e.clientY;
});

// 鼠标移动事件
petElement.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // 左键一直按下的状态
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > 3 || dy > 3) { // 超过 3px 容差才算拖拽
      isDragging = true;
      window.electronAPI.dragWindow(e.movementX, e.movementY);
    }
  }
});

// 鼠标释放事件
petElement.addEventListener('mouseup', (e) => {
  if (e.button !== 0) return;
  if (!isDragging) {
    // 鼠标没有发生实质性移动，这就是一个纯粹的点击！
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showBubble(randomMessage);
  }
  isDragging = false;
});

// 监听右键菜单事件
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  // 发送消息给主进程显示右键菜单
  window.electronAPI.showContextMenu();
});

// 监听主进程发送的菜单操作事件
window.electronAPI.onMenuAction((event, action) => {
  if (action === 'feed') {
    showBubble("谢谢主人！");
  } else if (action === 'pet') {
    showBubble("好舒服呀！");
  }
});
