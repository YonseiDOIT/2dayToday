document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: DOM 로드 완료');
    initializePage();
});

window.addEventListener('load', () => {
    console.log('load: 모든 리소스 로드 완료');
    loadTasks();
});

// 전역 변수 설정
let activeTab = localStorage.getItem('activeTab') || 'today';

// 페이지 초기화
function initializePage() {
    const today = new Date();
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일"];

    document.getElementById('date').textContent = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    document.getElementById('day').textContent = dayNames[today.getDay()];

    switchTab(activeTab); 
    loadTasks();
}

// [스와이프 관련 로직]
//  기본 브라우저 스와이프 비활성화
let touchStartX = 0;
let touchEndX = 0;

// 터치 시작 시 X 좌표 저장 및 기본 동작 방지
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

// 터치 이동 시 브라우저 기본 스와이프 동작 방지
document.addEventListener('touchmove', (e) => {
    e.preventDefault(); // 기본 스와이프 동작 방지
}, { passive: false });

// 터치 종료 시 X 좌표 저장 및 스와이프 방향 확인
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

// 스와이프 동작 처리
function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    const scheduleContainer = document.getElementById('schedule-container');

    if (swipeDistance > 50) {
        // 오른쪽 스와이프 (오늘로 이동)
        scheduleContainer.classList.add('swipe-right');
        setTimeout(() => {
            switchTab('today');
            scheduleContainer.classList.remove('swipe-right');
        }, 300);
    } else if (swipeDistance < -50) {
        // 왼쪽 스와이프 (내일로 이동)
        scheduleContainer.classList.add('swipe-left');
        setTimeout(() => {
            switchTab('tomorrow');
            scheduleContainer.classList.remove('swipe-left');
        }, 300);
    }
}

//날짜 포맷팅 관련
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 두 자리 수로 변환
    const day = String(date.getDate()).padStart(2, '0');         // 두 자리 수로 변환
    return `${year}-${month}-${day}`;
}
// 일정 로드
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // ✅ formatDate로 한국 시간 기준 날짜 생성
    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    const filteredTasks = tasks.filter(task => {
        const taskDate = task.date;
        if (activeTab === 'today' && taskDate === todayDate) return true;
        if (activeTab === 'tomorrow' && taskDate === tomorrowDate) return true;
        if (activeTab === 'today' && new Date(taskDate) < today && !task.completed) return true;
        return false;
    });

    // ✅ 전체 li 클릭 시 ID 기반으로 편집 페이지 이동
    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.onclick = () => editTask(task.id);  // ID로 연결

        const checkbox = document.createElement('div');
        checkbox.className = `custom-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.onclick = (e) => {
            e.stopPropagation();
            toggleCompletion(task.id, !task.completed);  // ID 기반 완료 처리
        };
        li.appendChild(checkbox);

        const taskText = document.createElement('span');
        taskText.textContent = `${task.name}`;
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        li.appendChild(taskText);

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.onclick = (e) => {
            e.stopPropagation();
            editTask(task.id);
        };

        const editIcon = document.createElement('img');
        editIcon.src = 'assets/images/more_vert.svg';
        editIcon.alt = 'Edit Icon';
        editIcon.className = 'edit-button-icon';

        editButton.appendChild(editIcon);
        li.appendChild(editButton);

        taskList.appendChild(li);
    });
}


// ✅ 완료 상태 변경
function toggleCompletion(id, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('전달된 ID:', id);  // ID 확인
    console.log('현재 tasks:', tasks);  // 저장된 tasks 확인

    const task = tasks.find(t => t.id === id);  // ID로 찾기

    if (task) {
        console.log('찾은 Task:', task);  // task 확인
        task.completed = isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    } else {
        console.error('일치를 찾지 못했습니다.');
    }
}


// 일정 수정
function editTask(id) {
    localStorage.setItem('editId', id);
    window.location.href = './tasks.html';
}

// 탭 전환
function switchTab(tab) {
    activeTab = tab;
    localStorage.setItem('activeTab', tab);
    loadTasks();

    const todayButton = document.querySelector('.top-today-button');
    const tomorrowButton = document.querySelector('.top-tomorrow-button');

    if (tab === 'today') {
        todayButton.classList.add('active');
        tomorrowButton.classList.remove('active');

        todayButton.classList.remove('disabled'); // 오늘 버튼 활성화
        tomorrowButton.classList.add('disabled'); // 내일 버튼 비활성화
    } else if (tab === 'tomorrow') {
        tomorrowButton.classList.add('active');
        todayButton.classList.remove('active');

        tomorrowButton.classList.remove('disabled'); // 내일 버튼 활성화
        todayButton.classList.add('disabled'); // 오늘 버튼 비활성화
    }
}

//id 생성
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}


function addTaskAndRedirect() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // ✅ 현재 활성화된 탭에 따라 날짜 설정
    let taskDate;
    if (activeTab === 'today') {
        taskDate = formatDate(new Date());  // 오늘 날짜
    } else if (activeTab === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        taskDate = formatDate(tomorrow);    // 내일 날짜
    }

    const randomTask = {
        id: generateId(),
        name: '새 일정',
        description: '',
        date: taskDate,  // ✅ 활성화된 탭에 따라 날짜 설정
        completed: false
    };

    tasks.push(randomTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('editId', randomTask.id);
    window.location.href = './tasks.html';
}
