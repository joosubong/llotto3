// 자동 갱신 스케줄 관리
class ScheduleManager {
    constructor(dataManager, numberGenerator) {
        this.dataManager = dataManager;
        this.numberGenerator = numberGenerator;
        this.updateInterval = null;
        this.countdownInterval = null;
    }

    // 다음 목요일 오후 4시 30분 계산
    getNextUpdateTime() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0(일) ~ 6(토), 목요일은 4
        const updateHour = 16; // 오후 4시
        const updateMinutes = 30; // 30분
        
        // 목요일까지 남은 일수 계산
        let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
        
        // 오늘이 목요일이고 오후 4시 30분 이전이면 오늘, 아니면 다음 목요일
        if (dayOfWeek === 4 && (now.getHours() < updateHour || (now.getHours() === updateHour && now.getMinutes() < updateMinutes))) {
            daysUntilThursday = 0;
        } else if (daysUntilThursday === 0) {
            daysUntilThursday = 7; // 다음 주 목요일
        }

        const nextThursday = new Date(now);
        nextThursday.setDate(now.getDate() + daysUntilThursday);
        nextThursday.setHours(updateHour, updateMinutes, 0, 0); // 오후 4시 30분 00초
        
        return nextThursday;
    }

    // 남은 시간 계산 (밀리초)
    getTimeUntilUpdate() {
        const nextUpdate = this.getNextUpdateTime();
        const now = new Date();
        return nextUpdate.getTime() - now.getTime();
    }

    // 남은 시간 포맷팅
    formatTimeRemaining(ms) {
        if (ms <= 0) return '00:00:00:00';
        
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // 카운트다운 업데이트
    updateCountdown(updateCallback) {
        const update = () => {
            const remaining = this.getTimeUntilUpdate();
            const formatted = this.formatTimeRemaining(remaining);
            
            if (updateCallback) {
                updateCallback(formatted, remaining);
            }
            
            // 갱신 시간이 되었으면 자동 갱신
            if (remaining <= 0) {
                this.triggerUpdate();
            }
        };
        
        // 즉시 실행
        update();
        
        // 1초마다 업데이트
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(update, 1000);
    }

    // 자동 갱신 실행
    triggerUpdate() {
        console.log('자동 갱신 시작:', new Date().toISOString());
        
        // 기존 결과를 지난 주 결과로 저장
        const currentResults = this.dataManager.loadResults();
        if (currentResults && currentResults.results) {
            this.dataManager.saveLastWeekResults(currentResults.results);
        }
        
        // 새 번호 생성
        const data = this.dataManager.loadData();
        const newResults = this.numberGenerator.generate(data);
        
        // 현재 주차 정보 가져오기
        const weekInfo = this.numberGenerator.getCurrentWeekNumber();
        
        // 결과 저장 (주차 정보 포함)
        this.dataManager.saveResults(newResults, weekInfo);
        
        // 페이지 새로고침 또는 결과 업데이트
        if (typeof window !== 'undefined' && window.location) {
            // UI 업데이트 이벤트 발생
            window.dispatchEvent(new CustomEvent('resultsUpdated', { 
                detail: { results: newResults } 
            }));
        }
        
        // 카운트다운 재시작
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    // 스케줄 시작
    start(updateCallback) {
        this.updateCountdown(updateCallback);
        
        // 갱신 시간까지 남은 시간 계산하여 타이머 설정
        const remaining = this.getTimeUntilUpdate();
        
        if (this.updateInterval) {
            clearTimeout(this.updateInterval);
        }
        
        // 갱신 시간에 실행
        this.updateInterval = setTimeout(() => {
            this.triggerUpdate();
            // 다음 주를 위해 재시작
            this.start(updateCallback);
        }, remaining);
    }

    // 스케줄 중지
    stop() {
        if (this.updateInterval) {
            clearTimeout(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    // 다음 갱신 시간 문자열 반환
    getNextUpdateTimeString() {
        const nextUpdate = this.getNextUpdateTime();
        const year = nextUpdate.getFullYear();
        const month = String(nextUpdate.getMonth() + 1).padStart(2, '0');
        const date = String(nextUpdate.getDate()).padStart(2, '0');
        const hours = String(nextUpdate.getHours()).padStart(2, '0');
        const minutes = String(nextUpdate.getMinutes()).padStart(2, '0');
        
        return `${year}.${month}.${date} ${hours}:${minutes}`;
    }
}

// 전역 인스턴스
const scheduleManager = new ScheduleManager(dataManager, numberGenerator);

