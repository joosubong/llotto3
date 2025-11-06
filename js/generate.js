// 로또 번호 생성 로직
class NumberGenerator {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.seed = this.getCurrentSeed();
        this.seedRandom = this.seedRandomGenerator(this.seed);
    }

    // 한국 표준시(KST, UTC+9) 기준 현재 시간 가져오기
    getKSTDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const kst = new Date(utc + (9 * 60 * 60 * 1000)); // UTC+9
        return kst;
    }

    // 현재 주차 기반 시드 생성 (목요일 16시 30분 한국 시간 기준)
    getCurrentSeed() {
        const kst = this.getKSTDate();
        const dayOfWeek = kst.getDay(); // 0(일) ~ 6(토), 목요일은 4
        const updateHour = 16; // 오후 4시
        const updateMinutes = 30; // 30분
        const updateDay = 4; // 목요일
        
        // 마지막 목요일 16시 30분(한국 시간) 찾기
        // 목요일 16시 30분 이전이면 이전 주차, 16시 30분 이후면 현재 주차
        let daysUntilLastThursday = 0;
        
        if (dayOfWeek === updateDay) {
            // 오늘이 목요일
            if (kst.getHours() < updateHour || (kst.getHours() === updateHour && kst.getMinutes() < updateMinutes)) {
                // 16시 30분 이전이면 이전 주 목요일
                daysUntilLastThursday = 7;
            } else {
                // 16시 30분 이후면 현재 주차
                daysUntilLastThursday = 0;
            }
        } else {
            // 오늘이 목요일이 아님
            // 목요일까지의 거리 계산
            if (dayOfWeek < updateDay) {
                // 일요일(0) ~ 수요일(3)
                daysUntilLastThursday = dayOfWeek + (7 - updateDay);
            } else {
                // 금요일(5) ~ 토요일(6)
                daysUntilLastThursday = dayOfWeek - updateDay;
            }
        }
        
        const lastThursday = new Date(kst);
        lastThursday.setDate(kst.getDate() - daysUntilLastThursday);
        lastThursday.setHours(updateHour, updateMinutes, 0, 0); // 목요일 16시 30분 00초
        
        // 1970-01-01 16:30 (한국 시간 기준)을 기준으로 주차 수 계산
        // 한국 시간은 UTC+9이므로, UTC 1970-01-01 07:30가 한국 시간 1970-01-01 16:30
        const base = new Date(1970, 0, 1, 7, 30, 0); // UTC 1970-01-01 07:30 = KST 1970-01-01 16:30
        
        // lastThursday는 이미 KST이므로 UTC로 변환 필요
        const lastThursdayUTC = new Date(lastThursday.getTime() - (9 * 60 * 60 * 1000));
        
        const diffMs = lastThursdayUTC.getTime() - base.getTime();
        const weekNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        
        // 시드 생성: "LuckyStat" + 연도 + 주차를 숫자로 변환
        const seedString = `LuckyStat${lastThursday.getFullYear()}_week${weekNumber}`;
        const numericSeed = this.stringToSeed(seedString);
        
        return numericSeed;
    }

    // 문자열을 숫자 시드로 변환 (간단한 해시 함수)
    stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        // 양수로 변환 (2147483647 미만)
        return Math.abs(hash) % 2147483647;
    }

    // 현재 주차 번호 반환 (목요일 16시 30분 한국 시간 기준)
    getCurrentWeekNumber() {
        const kst = this.getKSTDate();
        const dayOfWeek = kst.getDay(); // 0(일) ~ 6(토), 목요일은 4
        const updateHour = 16; // 오후 4시
        const updateMinutes = 30; // 30분
        const updateDay = 4; // 목요일
        
        // 마지막 목요일 16시 30분(한국 시간) 찾기
        let daysUntilLastThursday = 0;
        
        if (dayOfWeek === updateDay) {
            // 오늘이 목요일
            if (kst.getHours() < updateHour || (kst.getHours() === updateHour && kst.getMinutes() < updateMinutes)) {
                // 16시 30분 이전이면 이전 주 목요일
                daysUntilLastThursday = 7;
            } else {
                // 16시 30분 이후면 현재 주차
                daysUntilLastThursday = 0;
            }
        } else {
            // 오늘이 목요일이 아님
            if (dayOfWeek < updateDay) {
                // 일요일(0) ~ 수요일(3)
                daysUntilLastThursday = dayOfWeek + (7 - updateDay);
            } else {
                // 금요일(5) ~ 토요일(6)
                daysUntilLastThursday = dayOfWeek - updateDay;
            }
        }
        
        const lastThursday = new Date(kst);
        lastThursday.setDate(kst.getDate() - daysUntilLastThursday);
        lastThursday.setHours(updateHour, updateMinutes, 0, 0); // 목요일 16시 30분 00초
        
        // 1970-01-01 16:30 (한국 시간 기준)을 기준으로 주차 수 계산
        // 한국 시간은 UTC+9이므로, UTC 1970-01-01 07:30가 한국 시간 1970-01-01 16:30
        const base = new Date(1970, 0, 1, 7, 30, 0); // UTC 1970-01-01 07:30 = KST 1970-01-01 16:30
        
        // lastThursday는 이미 KST이므로 UTC로 변환 필요
        const lastThursdayUTC = new Date(lastThursday.getTime() - (9 * 60 * 60 * 1000));
        
        const diffMs = lastThursdayUTC.getTime() - base.getTime();
        const weekNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        
        return {
            weekNumber: weekNumber,
            year: lastThursday.getFullYear(),
            thursday: lastThursday.toISOString()
        };
    }

    // 시드 기반 랜덤 생성기 (Linear Congruential Generator)
    seedRandomGenerator(seed) {
        let currentSeed = seed;
        return {
            next: () => {
                // LCG: (a * seed + c) % m
                // a = 1664525, c = 1013904223, m = 2^32
                currentSeed = (currentSeed * 1664525 + 1013904223) % 2147483647;
                return currentSeed / 2147483647; // 0~1 사이 값 반환
            },
            reset: (newSeed) => {
                currentSeed = newSeed;
            }
        };
    }

    // 1-45 범위의 랜덤 번호 생성 (시드 기반)
    randomNumber(min = 1, max = 45) {
        return Math.floor(this.seedRandom.next() * (max - min + 1)) + min;
    }

    // 중복 제거된 번호 배열 생성 (시드 기반)
    generateUniqueNumbers(count, exclude = []) {
        const numbers = new Set();
        const available = Array.from({ length: 45 }, (_, i) => i + 1)
            .filter(n => !exclude.includes(n));
        
        while (numbers.size < count && available.length > 0) {
            const randomIndex = Math.floor(this.seedRandom.next() * available.length);
            numbers.add(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // 통계 기반 가중치 랜덤 생성
    generateWeightedNumbers(count, numberStats, exclude = []) {
        // 출현 횟수 계산
        const total = Object.values(numberStats).reduce((sum, count) => sum + count, 0);
        
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
            let random = this.seedRandom.next() * weightSum;
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
                    selected.add(remaining[Math.floor(this.seedRandom.next() * remaining.length)]);
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

    // 연속 번호 쌍 포함하여 생성
    generateWithConsecutive(count, exclude = []) {
        let attempts = 0;
        const maxAttempts = 1000;
        
        while (attempts < maxAttempts) {
            const numbers = this.generateUniqueNumbers(count, exclude);
            if (this.hasConsecutivePair(numbers)) {
                return numbers;
            }
            attempts++;
        }
        
        // 실패 시 일반 생성
        return this.generateUniqueNumbers(count, exclude);
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

    // 하위 10개 번호 제외 리스트 생성
    getBottomNumbers(numberStats, count = 10) {
        const sorted = Object.entries(numberStats)
            .map(([num, count]) => ({ num: parseInt(num), count }))
            .sort((a, b) => a.count - b.count);
        
        return sorted.slice(0, count).map(item => item.num);
    }

    // 보너스 번호 생성 (기존 번호 제외)
    generateBonus(mainNumbers) {
        const exclude = [...mainNumbers];
        
        // 제외되지 않은 번호 목록 생성
        const available = Array.from({ length: 45 }, (_, i) => i + 1)
            .filter(n => !exclude.includes(n));
        
        if (available.length === 0) {
            // 모든 번호가 제외되었으면 랜덤 반환 (이론적으로는 불가능하지만 안전장치)
            return this.randomNumber(1, 45);
        }
        
        // 사용 가능한 번호 중 랜덤 선택 (시드 기반)
        const randomIndex = Math.floor(this.seedRandom.next() * available.length);
        return available[randomIndex];
    }

    // STEP 1: 18개 임시 번호 세트 생성
    generateTemporarySets(data) {
        const { numberStats } = data;
        const sets = [];

        // 1. 무작위 랜덤: 2개
        for (let i = 0; i < 2; i++) {
            const numbers = this.generateUniqueNumbers(6);
            sets.push({ numbers, type: 'random' });
        }

        // 2. 통계 기반: 4개
        for (let i = 0; i < 4; i++) {
            const numbers = this.generateWeightedNumbers(6, numberStats);
            sets.push({ numbers, type: 'weighted' });
        }

        // 3. 연속 2자리 포함: 4개
        for (let i = 0; i < 4; i++) {
            const numbers = this.generateWithConsecutive(6);
            sets.push({ numbers, type: 'consecutive' });
        }

        // 4. 통계 + 연속: 4개
        for (let i = 0; i < 4; i++) {
            const numbers = this.generateWeightedWithConsecutive(6, numberStats);
            sets.push({ numbers, type: 'weighted_consecutive' });
        }

        // 5. 통계 하위 10개 제외: 4개
        const bottomNumbers = this.getBottomNumbers(numberStats, 10);
        for (let i = 0; i < 4; i++) {
            const numbers = this.generateWeightedNumbers(6, numberStats, bottomNumbers);
            sets.push({ numbers, type: 'exclude_bottom' });
        }

        return sets;
    }

    // STEP 2: 18개 세트에서 10개 조합 선택
    selectFinalSets(temporarySets) {
        // 각 번호의 출현 횟수 계산
        const numberCount = {};
        temporarySets.forEach(set => {
            set.numbers.forEach(num => {
                numberCount[num] = (numberCount[num] || 0) + 1;
            });
        });

        // 번호별 가중치 계산 (출현 횟수가 많을수록 높은 가중치)
        const weights = {};
        temporarySets.forEach((set, index) => {
            let weight = 0;
            set.numbers.forEach(num => {
                weight += numberCount[num] || 0;
            });
            weights[index] = weight;
        });

        // 가중치 기준으로 정렬
        const sortedIndices = Object.keys(weights)
            .map(index => ({ index: parseInt(index), weight: weights[index] }))
            .sort((a, b) => b.weight - a.weight);

        // 상위 10개 선택
        const selectedIndices = sortedIndices.slice(0, 10).map(item => item.index);
        
        // 선택된 세트 반환
        const finalSets = selectedIndices.map(index => {
            const set = temporarySets[index];
            return {
                numbers: [...set.numbers],
                type: set.type
            };
        });

        // 연속 번호 쌍 포함 여부 확인 및 보정
        const correctedSets = finalSets.map(set => {
            if (!this.hasConsecutivePair(set.numbers)) {
                // 연속 쌍이 없으면 1개 추가 시도
                const attempts = 10;
                for (let i = 0; i < attempts; i++) {
                    const newNumbers = this.generateWithConsecutive(6);
                    if (this.hasConsecutivePair(newNumbers)) {
                        set.numbers = newNumbers;
                        break;
                    }
                }
            }
            return set;
        });

        return correctedSets;
    }

    // 전체 생성 프로세스
    generate(data) {
        // 시드 재설정 (같은 주차 내 동일한 결과 보장)
        this.seed = this.getCurrentSeed();
        this.seedRandom.reset(this.seed);
        
        // STEP 1: 18개 임시 세트 생성
        const temporarySets = this.generateTemporarySets(data);
        
        // STEP 2: 10개 최종 조합 선택
        const finalSets = this.selectFinalSets(temporarySets);
        
        return finalSets;
    }
}

// 전역 인스턴스
const numberGenerator = new NumberGenerator(dataManager);

