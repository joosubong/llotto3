// 통계 데이터 저장 및 관리
class DataManager {
    constructor() {
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





