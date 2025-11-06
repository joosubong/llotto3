// 통계 데이터 저장 및 관리
class DataManager {
    constructor() {
        this.STORAGE_KEY = 'luckystat_data';
        this.SCHEDULE_KEY = 'luckystat_schedule';
        this.RESULTS_KEY = 'luckystat_results';
        this.LAST_WEEK_KEY = 'luckystat_last_week';
    }

    // 초기 데이터 구조 반환
    getInitialData() {
        return {
            numberStats: this.getInitialNumberStats(),
            rangeStats: this.getInitialRangeStats(),
            missingNumbers: this.getInitialMissingNumbers(),
            lastUpdated: new Date().toISOString()
        };
    }

    // 번호별 출현 통계 초기화 (1-45)
    getInitialNumberStats() {
        const stats = {};
        for (let i = 1; i <= 45; i++) {
            stats[i] = 0;
        }
        return stats;
    }

    // 구간별 출현률 초기화
    getInitialRangeStats() {
        return {
            '1-5': { percent: 0, count: 0 },
            '6-10': { percent: 0, count: 0 },
            '11-15': { percent: 0, count: 0 },
            '16-20': { percent: 0, count: 0 },
            '21-25': { percent: 0, count: 0 },
            '26-30': { percent: 0, count: 0 },
            '31-35': { percent: 0, count: 0 },
            '36-40': { percent: 0, count: 0 },
            '41-45': { percent: 0, count: 0 }
        };
    }

    // 미출현 번호 초기화
    getInitialMissingNumbers() {
        return {
            '1-10': [],
            '11-20': [],
            '21-30': [],
            '31-40': [],
            '41-45': []
        };
    }

    // 데이터 로드 (공용 데이터 동기화 포함)
    // 비동기 지원과 동기 지원 모두 제공
    async loadData() {
        // 먼저 로컬 데이터 로드
        const stored = localStorage.getItem(this.STORAGE_KEY);
        let localData = null;
        
        if (stored) {
            try {
                localData = JSON.parse(stored);
            } catch (e) {
                console.error('로컬 데이터 파싱 오류:', e);
            }
        }

        // 로컬 데이터 또는 초기 데이터 반환
        return localData || this.getInitialData();
    }

    // 동기 버전 (하위 호환성)
    loadDataSync() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('데이터 파싱 오류:', e);
                return this.getInitialData();
            }
        }
        return this.getInitialData();
    }

    // 데이터 저장 (로컬)
    async saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            
            // 로컬 저장
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            
            return true;
        } catch (e) {
            console.error('데이터 저장 오류:', e);
            return false;
        }
    }

    // 결과 저장 (주차 정보 포함)
    saveResults(results, weekInfo = null) {
        try {
            const data = {
                results: results,
                generatedAt: new Date().toISOString(),
                weekInfo: weekInfo // 주차 정보 저장
            };
            localStorage.setItem(this.RESULTS_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('결과 저장 오류:', e);
            return false;
        }
    }

    // 결과 로드
    loadResults() {
        const stored = localStorage.getItem(this.RESULTS_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // 지난 주 결과 저장
    saveLastWeekResults(results) {
        try {
            const data = {
                results: results,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(this.LAST_WEEK_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('지난 주 결과 저장 오류:', e);
            return false;
        }
    }

    // 지난 주 결과 로드
    loadLastWeekResults() {
        const stored = localStorage.getItem(this.LAST_WEEK_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // 데이터 내보내기
    exportData() {
        const data = this.loadData();
        const results = this.loadResults();
        const lastWeek = this.loadLastWeekResults();
        
        return {
            data: data,
            currentResults: results,
            lastWeekResults: lastWeek,
            exportedAt: new Date().toISOString()
        };
    }

    // 데이터 가져오기
    importData(jsonData) {
        try {
            if (jsonData.data) {
                this.saveData(jsonData.data);
            }
            if (jsonData.currentResults) {
                localStorage.setItem(this.RESULTS_KEY, JSON.stringify(jsonData.currentResults));
            }
            if (jsonData.lastWeekResults) {
                localStorage.setItem(this.LAST_WEEK_KEY, JSON.stringify(jsonData.lastWeekResults));
            }
            return true;
        } catch (e) {
            console.error('데이터 가져오기 오류:', e);
            return false;
        }
    }

    // 번호가 속한 구간 반환
    getRange(number) {
        if (number >= 1 && number <= 10) return '1-10';
        if (number >= 11 && number <= 20) return '11-20';
        if (number >= 21 && number <= 30) return '21-30';
        if (number >= 31 && number <= 40) return '31-40';
        if (number >= 41 && number <= 45) return '41-45';
        return null;
    }

    // 구간별 색상 반환
    getRangeColor(range) {
        const colors = {
            '1-10': 'bg-red-100 text-red-800 border-red-300',
            '11-20': 'bg-orange-100 text-orange-800 border-orange-300',
            '21-30': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            '31-40': 'bg-green-100 text-green-800 border-green-300',
            '41-45': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return colors[range] || 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

// 전역 인스턴스
const dataManager = new DataManager();






