// ✅ 공통 함수: 날짜 포맷
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ✅ 공통 함수: 탭 전환 및 일정 로드
function switchTab(tab) {
    activeTab = tab;
    localStorage.setItem('activeTab', tab);
    loadTasks();

    const todayButton = document.querySelector('.top-today-button');
    const tomorrowButton = document.querySelector('.top-tomorrow-button');

    if (tab === 'today') {
        todayButton.classList.add('active');
        tomorrowButton.classList.remove('active');
    } else if (tab === 'tomorrow') {
        tomorrowButton.classList.add('active');
        todayButton.classList.remove('active');
    }
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