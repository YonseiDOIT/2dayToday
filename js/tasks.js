// ✅ 이전 페이지로 이동
function goBack() {
    window.history.back();
}

// ✅ DOM 요소 가져오기
const nameInput = document.getElementById('task-name');
const descInput = document.getElementById('task-desc');
const editButton = document.getElementById('edit-button');
const deleteButton = document.getElementById('delete-button');
const cancelButton = document.getElementById('cancel-button');

let isEditing = false;

// ✅ 입력값을 임시 저장
function saveInputToTempStorage() {
    localStorage.setItem('tempName', nameInput.value);
    localStorage.setItem('tempDesc', descInput.value);
}

// ✅ 임시 저장된 입력값 불러오기
function loadInputFromTempStorage() {
    const tempName = localStorage.getItem('tempName');
    const tempDesc = localStorage.getItem('tempDesc');
    if (tempName !== null) nameInput.value = tempName;
    if (tempDesc !== null) descInput.value = tempDesc;
}

// ✅ 초기 활성 탭 설정
window.onload = () => {
    const editIndex = localStorage.getItem('editIndex');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskTitle = document.getElementById('task-title');

    if (editIndex !== null && tasks[editIndex]) {
        const task = tasks[editIndex];
        nameInput.value = task.name || '';
        descInput.value = task.description || '';
        taskTitle.textContent = task.name || '일정 수정';

        // 기존 일정의 날짜에 따라 탭 활성화
        const taskDate = task.date.split('T')[0];
        const todayDate = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];

        if (taskDate === todayDate) {
            switchTab('today');
        } else if (taskDate === tomorrowDate) {
            switchTab('tomorrow');
        }
    } else {
        // ✅ 새 일정 추가 시 탭 활성화
        const newTaskTab = localStorage.getItem('newTaskTab');
        if (newTaskTab === 'today') {
            switchTab('today');
        } else if (newTaskTab === 'tomorrow') {
            switchTab('tomorrow');
        } else {
            switchTab('today'); // 기본값은 '오늘'
        }
        taskTitle.textContent = '새 일정 추가';
    }
    
    // 임시 저장된 입력값 복원
    loadInputFromTempStorage();
};

// ✅ 날짜별 일정 불러오기
function loadTasksForDate(tab) {
    const editIndex = localStorage.getItem('editIndex');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (editIndex !== null) {
        const task = tasks[editIndex];
        if (task) {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const todayDate = today.toISOString().split('T')[0];
            const tomorrowDate = tomorrow.toISOString().split('T')[0];

            if (tab === 'today' && task.date.split('T')[0] !== todayDate) {
                task.date = todayDate;
            } else if (tab === 'tomorrow' && task.date.split('T')[0] !== tomorrowDate) {
                task.date = tomorrowDate;
            }

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}

// ✅ 탭 전환
function switchTab(tab) {
    saveInputToTempStorage(); // 현재 입력값 저장

    const todayTab = document.getElementById('today-tab');
    const tomorrowTab = document.getElementById('tomorrow-tab');

    if (tab === 'today') {
        todayTab.classList.add('active');
        tomorrowTab.classList.remove('active');
        loadTasksForDate('today');
    } else if (tab === 'tomorrow') {
        tomorrowTab.classList.add('active');
        todayTab.classList.remove('active');
        loadTasksForDate('tomorrow');
    }

    loadInputFromTempStorage(); // 입력값 복원
}

// ✅ 취소 버튼 동작
cancelButton.onclick = () => {
    window.history.back(); // 이전 페이지로 이동
};

// ✅ 저장 기능
editButton.onclick = () => {
    const editIndex = localStorage.getItem('editIndex');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todayTab = document.getElementById('today-tab');

    if (editIndex !== null) {
        const task = tasks[editIndex];

        tasks[editIndex] = {
            name: nameInput.value,
            description: descInput.value,
            date: task.date, // 기존 날짜 유지
            completed: task.completed || false
        };

        // 현재 선택된 탭에 따라 날짜 업데이트
        if (todayTab.classList.contains('active')) {
            const today = new Date().toISOString().split('T')[0];
            tasks[editIndex].date = today; // '오늘' 탭 선택 시 오늘 날짜로 설정
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);
            tasks[editIndex].date = tomorrow.toISOString().split('T')[0]; // '내일' 탭 선택 시 내일 날짜로 설정
        }

        localStorage.removeItem('tempName');
        localStorage.removeItem('tempDesc');
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.location.href = 'index.html';
    }
};

// 모달 삭제 버튼 동작 관련
deleteButton.onclick = () => {
    document.querySelector('.modal').classList.add('on');
};
document.querySelector('.deletion-btn').onclick = () => {
    const editIndex = localStorage.getItem('editIndex');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (editIndex !== null) {
        tasks.splice(editIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.removeItem('editIndex');
        window.location.href = 'index.html';
    }
};
document.querySelector('.cancel-btn').onclick = () => {
    document.querySelector('.modal').classList.remove('on');
};
