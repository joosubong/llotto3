// 로또 번호 생성 로직
class NumberGenerator {
    constructor(dataManager) {
        this.dataManager = dataManager;
        // 간단한 랜덤 생성기 (시드 없이)
        this.random = Math.random;
    }

    // 1-45 범위의 랜덤 번호 생성
    randomNumber(min = 1, max = 45) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    // 중복 제거된 번호 배열 생성
    generateUniqueNumbers(count, exclude = []) {
        const numbers = new Set();
        const available = Array.from({ length: 45 }, (_, i) => i + 1)
            .filter(n => !exclude.includes(n));
        
        while (numbers.size < count && available.length > 0) {
            const randomIndex = Math.floor(this.random() * available.length);
            numbers.add(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // 통계 기반 가중치 랜덤 생성
    generateWeightedNumbers(count, numberStats, exclude = []) {
        // 가중치 계산 (출현 횟수가 0이면 최소 가중치 부여)
        const weights = {};
        Object.keys(numberStats).forEach(num => {
            const numKey = parseInt(num);
            if (!exclude.includes(numKey)) {
                weights[numKey] = numberStats[num] > 0 ? numberStats[num] : 1;
            }
        });

        // 가중치 합계
        const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
        
        // 가중치 기반 랜덤 선택
        const selected = new Set();
        const available = Object.keys(weights).map(n => parseInt(n)).filter(n => !exclude.includes(n));
        
        while (selected.size < count && available.length > 0) {
            let random = this.random() * weightSum;
            let selectedNum = null;
            
            for (const num of available) {
                if (selected.has(num)) continue;
                random -= weights[num];
                if (random <= 0) {
                    selectedNum = num;
                    break;
                }
            }
            
            if (selectedNum) {
                selected.add(selectedNum);
            } else {
                // 폴백: 남은 번호 중 랜덤 선택
                const remaining = available.filter(n => !selected.has(n));
                if (remaining.length > 0) {
                    selected.add(remaining[Math.floor(this.random() * remaining.length)]);
                } else {
                    break;
                }
            }
        }
        
        return Array.from(selected).sort((a, b) => a - b);
    }

    // 연속 번호 쌍 포함 여부 확인
    hasConsecutivePair(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (Math.abs(sorted[i] - sorted[i + 1]) === 1) {
                return true;
            }
        }
        return false;
    }

    // 통계 기반 + 연속 번호 쌍 포함
    generateWeightedWithConsecutive(count, numberStats, exclude = []) {
        let attempts = 0;
        const maxAttempts = 1000;
        
        while (attempts < maxAttempts) {
            const numbers = this.generateWeightedNumbers(count, numberStats, exclude);
            if (this.hasConsecutivePair(numbers)) {
                return numbers;
            }
            attempts++;
        }
        
        // 실패 시 통계 기반만
        return this.generateWeightedNumbers(count, numberStats, exclude);
    }

    // 하위 번호 제외 리스트 생성
    getBottomNumbers(numberStats, count = 15) {
        const sorted = Object.entries(numberStats)
            .map(([num, count]) => ({ num: parseInt(num), count }))
            .sort((a, b) => a.count - b.count);
        
        return sorted.slice(0, count).map(item => item.num);
    }
}

// 전역 인스턴스
const numberGenerator = new NumberGenerator(dataManager);





