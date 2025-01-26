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

// ✅ 일정 로드 (과거 일정 색상 변경)
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    const filteredTasks = tasks.filter(task => {
        const taskDate = task.date;
        if (activeTab === 'today' && taskDate === todayDate) return true;
        if (activeTab === 'tomorrow' && taskDate === tomorrowDate) return true;
        if (activeTab === 'today' && new Date(taskDate) < today && !task.completed) return true;
        return false;
    });

    let draggedItem = null;
    let longPressTimer;

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.setAttribute('draggable', true); // ✅ 드래그 활성화

        const taskDateObj = new Date(task.date);
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (taskDateObj < todayDateOnly && !task.completed) {
            li.style.backgroundColor = '#FF9500';
        }

        if (task.completed) li.classList.add('completed');

        li.onclick = () => editTask(task.id);

        const checkbox = document.createElement('div');
        checkbox.className = `custom-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.onclick = (e) => {
            e.stopPropagation();
            toggleCompletion(task.id, !task.completed);
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

        // ✅ PC용 드래그 앤 드롭
        li.addEventListener('dragstart', (e) => {
            draggedItem = li;
            setTimeout(() => li.style.opacity = '0.5', 0);
        });

        li.addEventListener('dragend', () => {
            li.style.opacity = '1';
            draggedItem = null;
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem !== li) {
                swapTasks(taskList, draggedItem, li);
                updateTaskOrder();
            }
        });

        // ✅ 모바일용 길게 누르기 드래그
        li.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                draggedItem = li;
                li.style.opacity = '0.5';
            }, 500); // 0.5초 이상 누르면 활성화
        });

        li.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            if (draggedItem) {
                draggedItem.style.opacity = '1';
                draggedItem = null;
            }
        });

        li.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            if (draggedItem && target && target.tagName === 'LI' && target !== draggedItem) {
                swapTasks(taskList, draggedItem, target);
                updateTaskOrder();
            }
        });

        taskList.appendChild(li);
    });
}
// ✅ 드래그 순서 바꾸기
function swapTasks(taskList, item1, item2) {
    const items = Array.from(taskList.children);
    const index1 = items.indexOf(item1);
    const index2 = items.indexOf(item2);

    if (index1 < index2) {
        taskList.insertBefore(item2, item1);
    } else {
        taskList.insertBefore(item1, item2);
    }
}

// ✅ LocalStorage 순서 업데이트
function updateTaskOrder() {
    const updatedTasks = [];
    const taskListItems = document.querySelectorAll('#task-list li');

    taskListItems.forEach((li) => {
        // ✅ data-id 속성으로 ID를 안전하게 가져오기
        const taskId = li.getAttribute('data-id');  

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updatedTasks.push(task);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}



// ✅ 완료 상태 변경
function toggleCompletion(id, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);  // ID로 찾기

    if (task) {
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
