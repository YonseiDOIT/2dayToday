// DOM 요소 가져오기
const nameInput = document.getElementById('task-name');
const descInput = document.getElementById('task-desc');
const editButton = document.getElementById('edit-button');
const deleteButton = document.getElementById('delete-button');
const cancelButton = document.getElementById('cancel-button');

let isEditing = false;

// 입력값을 임시 저장
function saveInputToTempStorage() {
    localStorage.setItem('tempName', nameInput.value);
    localStorage.setItem('tempDesc', descInput.value);
}

// 임시 저장된 입력값 불러오기
function loadInputFromTempStorage() {
    const tempName = localStorage.getItem('tempName');
    const tempDesc = localStorage.getItem('tempDesc');
    if (tempName !== null) nameInput.value = tempName;
    if (tempDesc !== null) descInput.value = tempDesc;
}

//한국 날짜 설정 관련
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // 두 자리 수로 변환
    const day = String(date.getDate()).padStart(2, '0');         // 두 자리 수로 변환
    return `${year}-${month}-${day}`;
}
// 초기 활성 탭 설정 (ID 기반)
window.onload = () => {
    const editId = localStorage.getItem('editId');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskTitle = document.getElementById('task-title');
    const todayTab = document.getElementById('today-tab');
    const tomorrowTab = document.getElementById('tomorrow-tab');

    if (editId !== null) {
        const task = tasks.find(t => t.id === editId);

        if (task) {
            nameInput.value = task.name || '';
            descInput.value = task.description || '';
            taskTitle.textContent = task.name || '일정 수정';

            //tempName, tempDesc 현재 일정 내용으로 불러오기
            localStorage.setItem('tempName', task.name || '');
            localStorage.setItem('tempDesc', task.description || '');

            const isNewTask = localStorage.getItem('isNewTask') === 'true'; 
            if(isNewTask){
                localStorage.setItem('tempName', '');
            }

            // 날짜 비교 수정
            const taskDate = task.date;
            const todayDate = formatDate(new Date());
            const tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);
            const tomorrowDate = formatDate(tomorrow);

            // delayed 일정일 때 스타일 변경
            if (task.delayed) {
                todayTab.style.backgroundColor = '#FF9500';  // 오늘 탭 색상 변경
                document.querySelector('label[for="task-name"]').style.color = '#FF9500';  // 일정명 레이블 색상 변경
                document.querySelector('label[for="task-desc"]').style.color = '#FF9500';  // 설명 레이블 색상 변경
                tomorrowTab.disabled = true;  // 내일 탭 비활성화
                tomorrowTab.style.opacity = '0.5';  // 비활성화 표시
                tomorrowTab.style.cursor = 'not-allowed';
            }

            // 탭 활성화 설정
            if (taskDate === todayDate) {
                todayTab.classList.add('active');
                tomorrowTab.classList.remove('active');
            } else if (taskDate === tomorrowDate) {
                tomorrowTab.classList.add('active');
                todayTab.classList.remove('active');
            }
        }
    } else {
        switchTab(localStorage.getItem('newTaskTab') || 'today');
        taskTitle.textContent = '새 일정 추가';
    }

    loadInputFromTempStorage();
};


// 날짜별 일정 불러오기 (ID 기반) - 수정
function loadTasksForDate(tab) {
    const editId = localStorage.getItem('editId');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (editId !== null) {
        const task = tasks.find(t => t.id === editId);
        if (task) {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const todayDate = formatDate(today);       // formatDate로 변경 (KST 기준)
            const tomorrowDate = formatDate(tomorrow); // formatDate로 변경 (KST 기준)
            
            if (tab === 'today' && task.date !== todayDate) {
                task.date = todayDate;  // 한국 시간 기준으로 저장
            } else if (tab === 'tomorrow' && task.date !== tomorrowDate) {
                task.date = tomorrowDate;
            }
        }
    }
}
// 이전 페이지로 이동
function goBack() {
    const isNewTask = localStorage.getItem('isNewTask') === 'true'; 
    if(isNewTask){
        const editId = localStorage.getItem('editId'); 
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (editId !== null) {
            tasks = tasks.filter(task => task.id !== editId);  // ID로 삭제
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.removeItem('editId');
            window.location.href = '/';
        }
    }
    window.history.back();
}

function deleteNewTask() { //최초 일정 추가 페이지 -> 일정 삭제용
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTaskId = localStorage.getItem('newTaskId');

    if (newTaskId) {
        const updatedTasks = tasks.filter(task => task.id !== newTaskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // 플래그 값 초기화
    localStorage.removeItem('newTaskId');
}

// 탭 전환
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

// 취소 버튼 동작
cancelButton.onclick = () => {
    goBack();
};

// 저장 기능 (ID 기반) - 수정
editButton.onclick = () => {
    const editId = localStorage.getItem('editId');  // editIndex → editId
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todayTab = document.getElementById('today-tab');
    
    if (editId !== null) {

        
        const taskIndex = tasks.findIndex(t => t.id === editId);  // ID로 인덱스 찾기

        if (taskIndex !== -1) {

            // Name 값이 빈 문자열이거나 null이면 기본값 설정
            const taskName = nameInput.value.trim() === '' ? '새 일정' : nameInput.value;

            tasks[taskIndex] = {
                ...tasks[taskIndex],
                name: taskName,
                description: descInput.value
            };

            // 선택된 탭에 따라 날짜 업데이트 (formatDate 적용)
            const today = formatDate(new Date());
            const tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);

            tasks[taskIndex].date = todayTab.classList.contains('active') 
                ? today 
                : formatDate(tomorrow);  // formatDate로 수정

            localStorage.removeItem('tempName');
            localStorage.removeItem('tempDesc');
            localStorage.setItem('tasks', JSON.stringify(tasks));
            window.location.href = '/';
        }
    }
}


// 모달 삭제 버튼 동작 관련
deleteButton.onclick = () => {
    document.querySelector('.modal').classList.add('on');
};
// 삭제 기능 (ID 기반)
document.querySelector('.deletion-btn').onclick = () => {
    const editId = localStorage.getItem('editId'); 
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (editId !== null) {
        tasks = tasks.filter(task => task.id !== editId);  // ID로 삭제
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.removeItem('editId');
        window.location.href = '/';
    }
};

document.querySelector('.cancel-btn').onclick = () => {
    document.querySelector('.modal').classList.remove('on');
};
