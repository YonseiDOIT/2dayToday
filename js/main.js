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

// ✅ 스와이프 기능 추가 
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


// ✅ 일정 로드
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = today.toISOString().split('T')[0];
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const filteredTasks = tasks.map((task, index) => ({
        ...task,
        originalIndex: index,
    })).filter(task => {
        const taskDate = task.date.split('T')[0];

        // ✅ 오늘 일정
        if (activeTab === 'today' && taskDate === todayDate) {
            return true;
        }

        // ✅ 내일 일정
        if (activeTab === 'tomorrow' && taskDate === tomorrowDate) {
            return true;
        }

        // ✅ 과거의 완료되지 않은 일정
        if (activeTab === 'today' && new Date(taskDate) < today && !task.completed) {
            return true;
        }

        return false;
    });

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const checkbox = document.createElement('div');
        checkbox.className = `custom-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.onclick = () => toggleCompletion(task.originalIndex, !task.completed);
        li.appendChild(checkbox);

        const taskText = document.createElement('span');
        taskText.textContent = `${task.name}`;
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        li.appendChild(taskText);

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.onclick = () => editTask(task.originalIndex);

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
function toggleCompletion(index, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = isCompleted;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}


// 일정 수정
function editTask(originalIndex) {
    localStorage.setItem('editIndex', originalIndex);
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
// 일정 추가 페이지로 이동
function addTaskAndRedirect() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const randomTask = {
        name: '새 일정',
        description: '',
        date: new Date().toISOString().split('T')[0],
        completed: false
    };

    tasks.push(randomTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('editIndex', tasks.length - 1);
    window.location.href = './tasks.html';
}
