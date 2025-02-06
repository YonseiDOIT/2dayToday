document.addEventListener("DOMContentLoaded", () => {
    displayWeeklyProgress();
    displayWeeklyOverallProgress(); // 일주일 전체 성공률 표시
    updateWeeklyBar();
});

// 주간 달성 바 업데이트
function updateWeeklyBar() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();
    const last7Days = getLast7Days(today);

    const totalTasks = last7Days.reduce((total, date) => {
        const formattedDate = formatDate(date);
        return total + tasks.filter(task => task.date === formattedDate).length;
    }, 0);

    const completedTasks = last7Days.reduce((completed, date) => {
        const formattedDate = formatDate(date);
        return completed + tasks.filter(task => task.date === formattedDate && task.completed).length;
    }, 0);

    const weeklyBarAchieved = document.querySelector(".weekly-bar-achieved");
    const weeklyRateText = document.querySelector(".this-week-rate");

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    weeklyBarAchieved.style.width = `${percentage}%`;
    weeklyRateText.textContent = `${completedTasks}/${totalTasks}`; 
}


// 근 7일 달성도 계산 및 그래프 표시
function displayWeeklyProgress() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();
    const last7Days = getLast7Days(today);

    const barChartContainer = document.querySelector(".bar-chart");
    barChartContainer.innerHTML = ""; // 기존 내용을 초기화

    last7Days.forEach((date) => {
        const formattedDate = formatDate(date); // 데이터 필터링용 (YYYY-MM-DD)
        const displayDate = formatDateForDisplay(date); // 화면 표시용 (MM/DD)
        const dailyTasks = tasks.filter(task => task.date === formattedDate);
        const completedTasks = dailyTasks.filter(task => task.completed);

        const totalTasks = dailyTasks.length;
        const completedPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

        // 그래프 요소 생성
        const bar = document.createElement("div");
        bar.className = "bar";

        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const barAchieved = document.createElement("div");
        barAchieved.className = "bar-achieved";
        barAchieved.style.width = `${completedPercentage}%`;

        // 날짜 텍스트
        const barDate = document.createElement("div");
        barDate.className = "bar-date";
        barDate.textContent = displayDate;

        // 퍼센트 텍스트
        const barPercentage = document.createElement("div");
        barPercentage.className = "bar-percentage";
        barPercentage.textContent = `${completedPercentage}%`;

        // 구조 조립
        barContainer.appendChild(barAchieved);
        barContainer.appendChild(barDate); // 날짜 추가
        barContainer.appendChild(barPercentage); // 퍼센트 추가
        bar.appendChild(barContainer);

        barChartContainer.appendChild(bar);
    });
}

// 일주일 전체 성공률 계산 및 표시
function displayWeeklyOverallProgress() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();
    const last7Days = getLast7Days(today);

    const totalTasks = last7Days.reduce((total, date) => {
        const formattedDate = formatDate(date);
        return total + tasks.filter(task => task.date === formattedDate).length;
    }, 0);

    const completedTasks = last7Days.reduce((completed, date) => {
        const formattedDate = formatDate(date);
        return completed + tasks.filter(task => task.date === formattedDate && task.completed).length;
    }, 0);

    const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 텍스트 영역 업데이트
    const overallTextElement = document.querySelector(".text-2");
    overallTextElement.textContent = `${overallPercentage}%`; // 일주일 성공률 텍스트 업데이트
}

// 오늘 기준 지난 7일 날짜 배열 생성
function getLast7Days(today) {
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last7Days.push(date);
    }
    return last7Days.reverse(); // 날짜를 오름차순으로 정렬
}

// 날짜 포맷팅 (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// 화면 표시용 날짜 포맷팅 (MM/DD)
function formatDateForDisplay(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
}
