document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: DOM 로드 완료');
    initializePage();
    initializeDefaultTasks(); // 최초 방문 시 기본 일정 추가
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

    categorizeDelayedTasks(); // 미뤄진 일정 분류
    switchTab(activeTab);
    loadTasks();
}

// 최초 방문 시 기본 일정 데이터 초기화 함수
function initializeDefaultTasks() {
    const isFirstVisit = !localStorage.getItem('firstVisit'); // 첫 방문 여부 확인

    if (isFirstVisit) {
        const defaultTasks = [
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), // 어제 날짜
                completed: false,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), // 어제 날짜
                completed: false,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 2))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 3))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), // 어제 날짜
                completed: false,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 6))), // 어제 날짜
                completed: false,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 5))), // 어제 날짜
                completed: true,
                delayed: true,
            },
            {
                id: generateId(),
                name: "영상용 테스트",
                description: "어제 완료된 일정",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 5))), // 어제 날짜
                completed: false,
                delayed: true,
            },



            {
                id: generateId(),
                name: "! 어제 미완료된 일정입니다",
                description: "어제 미완료된 일정은 하루동안 오늘 탭에 표시됩니다.",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() - 1))), // 어제 날짜
                completed: false,
                delayed: true,
            },
            {
                id: generateId(),
                name: "+ 새로운 일정을 추가해보세요",
                description: "상단의 + 버튼을 눌러 새 일정을 만들어보세요.",
                date: formatDate(new Date()), // 오늘 날짜
                completed: false,
                delayed: false
            },
            {
                id: generateId(),
                name: "✔  할 일을 체크해보세요",
                description: "체크박스를 눌러 완료 상태로 바꿔보세요.",
                date: formatDate(new Date()), // 오늘 날짜
                completed: false,
                delayed: false
            },
            {
                id: generateId(),
                name: "↕ 길게 눌러 순서를 바꿔보세요",
                description: "일정을 길게 눌러 위아래로 이동해보세요.",
                date: formatDate(new Date()), // 오늘 날짜
                completed: false,
                delayed: false
            },
            {
                id: generateId(),
                name: "📅 내일의 계획을 미리 세워보세요",
                description: "내일 할 일을 미리 작성해 준비하세요.",
                date: formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), // 내일 날짜
                completed: false,
                delayed: false
            },
        ];

        // 로컬 스토리지에 기본 일정 저장
        localStorage.setItem('tasks', JSON.stringify(defaultTasks));
        localStorage.setItem('firstVisit', 'true'); // 플래그 설정하여 다시 추가되지 않도록 방지
    }
}

// 미뤄진 일정 분류 및 7일 이상 지난 일정 삭제
function categorizeDelayedTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    tasks = tasks.filter(task => {
        const taskDate = new Date(task.date);

        // 7일 이상 지난 일정 삭제
        const timeDifference = todayDateOnly - taskDate; // 시간 차이 계산
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // 일 단위로 변환
        if (daysDifference > 7) {
            console.log(`삭제된 일정: ${task.name}`); // 삭제된 일정 로그 출력
            return false; // 삭제 대상
        }

        // 과거 일정이고 완료되지 않았다면 delayed = true
        if (taskDate < todayDateOnly && !task.completed) {
            task.delayed = true;
        } else {
            task.delayed = false;
        }
        return true; // 삭제되지 않은 일정 유지
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}



// [스와이프 관련 로직]
//  기본 브라우저 스와이프 비활성화
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
const swipeThreshold = 50;  // 가로 스와이프 최소 거리
const refreshThreshold = 100;  // 새로고침 최소 세로 드래그 거리

// 터치 시작 시 X, Y 좌표 저장
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// 터치 이동 시 수직 및 수평 방향에 따라 동작 결정
document.addEventListener('touchmove', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const horizontalDistance = Math.abs(touchEndX - touchStartX);
    const verticalDistance = Math.abs(touchEndY - touchStartY);

    if (horizontalDistance > verticalDistance) {
        // 가로로 스와이프할 때는 기본 스크롤 방지
        e.preventDefault();
    }
}, { passive: false });

// 터치 종료 시 동작 결정 (새로고침 또는 스와이프)
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const horizontalDistance = touchEndX - touchStartX;
    const verticalDistance = touchEndY - touchStartY;

    if (Math.abs(horizontalDistance) > swipeThreshold && Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
        // 가로 스와이프 처리
        handleSwipeGesture(horizontalDistance);
    } else if (verticalDistance > refreshThreshold && verticalDistance > Math.abs(horizontalDistance)) {
        // 아래로 드래그 감지 (세로 방향)
        // pullToRefresh();
    }
});

// 스와이프 동작 처리
function handleSwipeGesture(horizontalDistance) {
    if (horizontalDistance > swipeThreshold) {
        // 오른쪽 스와이프 (오늘로 이동)
        switchTab('today');
    } else if (horizontalDistance < -swipeThreshold) {
        // 왼쪽 스와이프 (내일로 이동)
        switchTab('tomorrow');
    }
}

// 아래로 드래그 시 새로고침 기능
function pullToRefresh() { 
    loadTasks(); // 새로고침 시 일정 다시 로드
    console.log('새로고침 완료');
}



//날짜 포맷팅 관련
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 두 자리 수로 변환
    const day = String(date.getDate()).padStart(2, '0');         // 두 자리 수로 변환
    return `${year}-${month}-${day}`;
}

// 일정 로드 (과거 일정 색상 변경)
function loadTasks() {
    localStorage.setItem('isNewTask', 'false');  // 새 일정 추가 플래그 설정

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);
    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    const filteredTasks = tasks.filter(task => {
        const taskDate = task.date;
        if (activeTab === 'today' && taskDate === todayDate) return true;
        if (activeTab === 'tomorrow' && taskDate === tomorrowDate) return true;
        if (activeTab === 'today' && isOneDayPast(taskDate, today) && !task.completed) return true; //미뤄진 일정은 하루 까지만 표시
        return false;
    });
    let draggedItem = null;
    let longPressTimer;

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id); // data-id 속성 추가
    
        const taskDateObj = new Date(task.date);
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
        if (taskDateObj < todayDateOnly && !task.completed) {
            li.style.backgroundColor = '#FF9500';
        }
    
        if (task.completed) li.classList.add('completed');
    
        li.onclick = () => editTask(task.id);
    
    
        li.onclick = () => editTask(task.id);
    
        const checkbox = document.createElement('div');
        checkbox.className = `custom-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.onclick = (e) => {
            e.stopPropagation();
            toggleCompletion(task.id, !task.completed);
        };
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
    
        // 드래그 앤 드롭 이벤트 리스너 추가
        li.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                draggedItem = li;
                li.style.opacity = '0.5';
                li.classList.add('dragging'); // 드래그 시각적 효과 (선택 사항)
            }, 500); // 0.5초 이상 누르면 드래그 시작
        }, { passive: true });
        li.addEventListener('touchmove', (e) => {
            // 스크롤하거나 터치가 이동하면 길게 누르기 취소
            clearTimeout(longPressTimer);  // ✅ 길게 누르기 취소
        });
        li.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            if (draggedItem) {
                draggedItem.style.opacity = '1';
                draggedItem.classList.remove('dragging'); // 시각적 효과 제거 (선택 사항)
                draggedItem = null;
            }
        }, { passive: true });
        
        li.addEventListener('touchmove', (e) => {
            if (draggedItem) {
                e.preventDefault();  // 기본 동작 방지
        
                const touch = e.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
                if (target && target.tagName === 'LI' && target !== draggedItem) {
                    // ✅ 대상 항목의 위치 정보 가져오기
                    const targetRect = target.getBoundingClientRect();
                    const targetCenterY = targetRect.top + targetRect.height / 2 ;  // 세로 중앙 좌표
        
                    // ✅ 터치 위치가 대상 항목의 세로 중앙을 넘었는지 확인
                    if (touch.clientY >= targetCenterY) {
                        swapTasks(taskList, draggedItem, target);  // 순서 교체
                        updateTaskOrder();  // 로컬 스토리지 업데이트
                    }
                }
            }
        }, { passive: false });



        taskList.appendChild(li);
    });
}
//하루 지난 일정만 반환
function isOneDayPast(taskDate, today) {
    const taskDateOnly = new Date(new Date(taskDate).setHours(0, 0, 0, 0));  // 시간 초기화
    const todayDateOnly = new Date(today.setHours(0, 0, 0, 0));  // 오늘 날짜 시간 초기화

    const timeDifference = todayDateOnly - taskDateOnly;  // 두 날짜의 차이 계산
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);  // 일 단위로 변환

    return daysDifference === 1;  // 정확히 하루 차이일 때만 true 반환
}

// 드래그 순서 바꾸기 수정
function swapTasks(taskList, item1, item2) {
    const items = Array.from(taskList.children);
    const index1 = items.indexOf(item1);
    const index2 = items.indexOf(item2);

    if (index1 < index2) {
        taskList.insertBefore(item2, item1);
    } else {
        taskList.insertBefore(item1, item2);
    }

    // 순서만 갱신하고 날짜 변경 로직은 없음
    updateTaskOrder();
}
 

// LocalStorage 순서 및 날짜 업데이트
function updateTaskOrder() {
    const updatedTasks = [];
    const taskListItems = document.querySelectorAll('#task-list li');  // 현재 탭의 모든 항목 가져오기
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];  // 모든 일정 가져오기

    // 현재 탭의 일정만 먼저 업데이트된 순서로 추가
    taskListItems.forEach((li) => {
        const taskId = li.getAttribute('data-id');
        const task = allTasks.find(t => t.id === taskId);

        if (task) {
            updatedTasks.push(task);  // 현재 탭에 있는 일정 추가
        }
    });

    // 다른 탭의 일정 추가 (현재 화면에 표시되지 않은 일정)
    allTasks.forEach((task) => {
        // 현재 탭의 일정에 추가되지 않은 경우만 추가
        if (!updatedTasks.some(updatedTask => updatedTask.id === task.id)) {
            updatedTasks.push(task);  // 나머지 일정 추가
        }
    });
    
    // 로컬 저장소에 최종 정렬된 일정 저장
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}




// 완료 상태 변경
function toggleCompletion(id, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === id);  // ID로 일정의 인덱스 찾기

    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        task.completed = isCompleted;

        if (isCompleted) {
            // 완료된 일정의 순서를 제일 아래로 이동
            tasks.splice(taskIndex, 1); // 기존 위치에서 제거
            tasks.push(task); // 제일 아래로 추가
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    } else {
        console.error('일치를 찾지 못했습니다.');
    }
}




// 일정 수정
function editTask(id) {
    localStorage.setItem('editId', id);
function editTask(id) {
    localStorage.setItem('editId', id);
    window.location.href = './tasks.html';
}

// 탭 전환
function switchTab(tab) {
    activeTab = tab;
    localStorage.setItem('activeTab', tab);
    loadTasks();  // 탭에 따라 새로운 일정 로드

    const todayButton = document.querySelector('.top-today-button');
    const tomorrowButton = document.querySelector('.top-tomorrow-button');

    if (tab === 'today') {
        todayButton.classList.add('active');
        tomorrowButton.classList.remove('active');
        todayButton.classList.remove('disabled');
        tomorrowButton.classList.add('disabled');
    } else if (tab === 'tomorrow') {
        tomorrowButton.classList.add('active');
        todayButton.classList.remove('active');
        tomorrowButton.classList.remove('disabled');
        todayButton.classList.add('disabled');
    }
}

//id 생성
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}


function addTask() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 현재 활성화된 탭에 따라 날짜 설정
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
        id: generateId(),
        name: '새 일정',
        description: '',
        date: taskDate,  // 활성화된 탭에 따라 날짜 설정
        completed: false,
        delayed: false,
    };

    // 최상단부터 검사하며 delayed: false를 찾음
    let insertIndex = 0; // 기본적으로 맨 위에 추가
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].delayed) {
            insertIndex = i;
            break; // 첫 번째 delayed: false를 발견하면 종료
        }
    }

    // 해당 위치에 새 일정을 추가
    tasks.splice(insertIndex, 0, randomTask);

    // 로컬 저장소에 업데이트된 일정 저장
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('editId', randomTask.id);  // 추가된 일정의 ID 저장
    localStorage.setItem('isNewTask', 'true');  // 새 일정 추가 플래그 설정

    // tasks.html 페이지로 리디렉트
    window.location.href = './tasks.html';
}