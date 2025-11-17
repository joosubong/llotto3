// UI 렌더링 로직
class UIManager {
    constructor(dataManager, scheduleManager) {
        this.dataManager = dataManager;
        this.scheduleManager = scheduleManager;
    }

    // 번호 카드 렌더링
    renderNumberCard(set, index) {
        const { numbers } = set;
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 relative';
        
        const numbersContainer = document.createElement('div');
        numbersContainer.className = 'flex flex-wrap items-center gap-1 justify-center';
        numbersContainer.id = `numbersContainer_${index}`;
        
        // 원본 색상 정보 저장
        const originalColors = [];
        
        numbers.forEach((num, numIndex) => {
            const numberBadge = this.createNumberBadge(num);
            numberBadge.dataset.originalColor = numberBadge.className;
            originalColors.push({
                element: numberBadge,
                originalColor: numberBadge.className
            });
            numbersContainer.appendChild(numberBadge);
        });
        
        // 확인 버튼 (번호 옆에 배치)
        const checkButton = document.createElement('button');
        checkButton.className = 'bg-white border border-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg hover:bg-gray-50 transition-all text-xs';
        checkButton.textContent = '확인';
        checkButton.dataset.checked = 'false';
        checkButton.dataset.index = index;
        
        // 원본 색상 정보를 클로저로 저장
        const originalColorsRef = originalColors;
        
        // 확인 버튼 클릭 이벤트
        checkButton.addEventListener('click', () => {
            const isChecked = checkButton.dataset.checked === 'true';
            const container = card.querySelector(`#numbersContainer_${index}`);
            const badges = container.querySelectorAll('span[data-original-color]');
            
            if (!isChecked) {
                // 회색으로 변경 및 복사
                badges.forEach((badge, badgeIndex) => {
                    badge.className = 'inline-flex items-center justify-center w-[30px] h-[30px] rounded-full font-bold text-xs border-2 bg-gray-200 text-gray-700 border-gray-300';
                });
                checkButton.dataset.checked = 'true';
                
                // 번호 복사
                const numbersText = numbers.join(' ');
                this.copyToClipboard(numbersText);
            } else {
                // 원래 색상으로 복원
                badges.forEach((badge, badgeIndex) => {
                    const originalColor = originalColorsRef[badgeIndex].originalColor;
                    badge.className = originalColor;
                });
                checkButton.dataset.checked = 'false';
            }
        });
        
        numbersContainer.appendChild(checkButton);
        card.appendChild(numbersContainer);
        
        return card;
    }

    // 클립보드에 복사
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                // 복사 성공 (옵션: 알림 표시)
                console.log('복사 완료:', text);
            }).catch(err => {
                console.error('복사 실패:', err);
            });
        } else {
            // 폴백 방법 (구형 브라우저)
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                console.log('복사 완료:', text);
            } catch (err) {
                console.error('복사 실패:', err);
            }
            document.body.removeChild(textArea);
        }
    }

    // 등수 계산 함수
    calculateRank(numbers) {
        // 1197회차 당첨번호 (6개 번호 + 보너스)
        const winningNumbers = [1, 5, 7, 26, 28, 43];
        const bonusNumber = 30;
        
        // 맞춘 번호 개수 계산
        let matchCount = 0;
        let hasBonus = false;
        
        numbers.forEach(num => {
            if (winningNumbers.includes(num)) {
                matchCount++;
            }
            if (num === bonusNumber) {
                hasBonus = true;
            }
        });
        
        // 등수 판정 (로또 규칙)
        // 1등: 6개 모두 맞춤 (현재 당첨번호가 5개라서 불가능하지만 로직은 유지)
        // 2등: 5개 + 보너스
        // 3등: 5개
        // 4등: 4개
        // 5등: 3개
        if (matchCount === 6) {
            return 1; // 1등: 6개 모두 맞춤
        } else if (matchCount === 5 && hasBonus) {
            return 2; // 2등: 5개 + 보너스
        } else if (matchCount === 5) {
            return 3; // 3등: 5개
        } else if (matchCount === 4) {
            return 4; // 4등: 4개
        } else if (matchCount === 3) {
            return 5; // 5등: 3개
        } else {
            return 0; // 당첨 안됨
        }
    }

    // 등수 버튼 생성
    createRankButton(rank) {
        const button = document.createElement('button');
        
        if (rank === 0) {
            // 실패: 흰색 테두리 버튼
            button.className = 'bg-white border border-gray-300 text-gray-700 font-bold py-1 px-2 rounded-lg shadow-md hover:bg-gray-50 transition-all text-xs';
            button.textContent = '실패';
        } else {
            // 1~5등: 빨간색 버튼
            button.className = 'bg-red-600 text-white font-bold py-1 px-2 rounded-lg shadow-md hover:bg-red-700 transition-all text-xs';
            button.textContent = `${rank}등`;
        }
        
        return button;
    }

    // 번호 카드 렌더링 (모달용 - 등수 포함)
    renderNumberCardWithRank(set, index) {
        const { numbers } = set;
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-4 border-2 border-gray-200';
        
        // 번호 컨테이너
        const numbersContainer = document.createElement('div');
        numbersContainer.className = 'flex flex-wrap items-center gap-2 justify-center';
        
        numbers.forEach(num => {
            const numberBadge = this.createNumberBadge(num);
            numbersContainer.appendChild(numberBadge);
        });
        
        // 등수 버튼 (번호 옆에 배치)
        const rank = this.calculateRank(numbers);
        const rankButton = this.createRankButton(rank);
        numbersContainer.appendChild(rankButton);
        
        card.appendChild(numbersContainer);
        
        return card;
    }

    // 번호 배지 생성
    createNumberBadge(number, isBonus = false) {
        const badge = document.createElement('span');
        const range = this.dataManager.getRange(number);
        const colorClass = this.dataManager.getRangeColor(range);
        
        badge.className = `inline-flex items-center justify-center w-[30px] h-[30px] rounded-full font-bold text-xs border-2 ${colorClass}`;
        if (isBonus) {
            badge.className += ' ring-2 ring-yellow-400 ring-offset-1';
        }
        badge.textContent = number;
        
        return badge;
    }

    // 당첨번호 배지 생성 (진한 색 배경, 흰색 숫자)
    createWinningNumberBadge(number) {
        const badge = document.createElement('span');
        const range = this.dataManager.getRange(number);
        
        // 구간별 진한 색상 클래스
        const darkColors = {
            '1-10': 'bg-red-600 text-white border-red-700',
            '11-20': 'bg-orange-600 text-white border-orange-700',
            '21-30': 'bg-yellow-600 text-white border-yellow-700',
            '31-40': 'bg-green-600 text-white border-green-700',
            '41-45': 'bg-blue-600 text-white border-blue-700'
        };
        
        const colorClass = darkColors[range] || 'bg-gray-600 text-white border-gray-700';
        
        badge.className = `inline-flex items-center justify-center w-[30px] h-[30px] rounded-full font-bold text-xs border-2 ${colorClass}`;
        badge.textContent = number;
        
        return badge;
    }

    // 결과 목록 렌더링
    renderResults(results, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!results || results.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <p>아직 생성된 번호가 없습니다.</p>
                </div>
            `;
            return;
        }
        
        // 하나의 박스로 통합
        const box = document.createElement('div');
        box.className = 'bg-white rounded-lg shadow-md p-4 border-2 border-gray-200';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = 'flex flex-col gap-4';
        
        results.forEach((set, index) => {
            const numbersContainer = document.createElement('div');
            numbersContainer.className = 'flex flex-wrap items-center gap-1 justify-center';
            numbersContainer.id = `numbersContainer_${index}`;
            
            // 원본 색상 정보 저장
            const originalColors = [];
            
            set.numbers.forEach((num, numIndex) => {
                const numberBadge = this.createNumberBadge(num);
                numberBadge.dataset.originalColor = numberBadge.className;
                originalColors.push({
                    element: numberBadge,
                    originalColor: numberBadge.className
                });
                numbersContainer.appendChild(numberBadge);
            });
            
            // 확인 버튼 (번호 옆에 배치)
            const checkButton = document.createElement('button');
            checkButton.className = 'bg-white border border-gray-300 text-gray-700 font-medium py-1 px-2 rounded-lg hover:bg-gray-50 transition-all text-xs';
            checkButton.textContent = '확인';
            checkButton.dataset.checked = 'false';
            checkButton.dataset.index = index;
            
            // 원본 색상 정보를 클로저로 저장
            const originalColorsRef = originalColors;
            
            // 확인 버튼 클릭 이벤트
            checkButton.addEventListener('click', () => {
                const isChecked = checkButton.dataset.checked === 'true';
                const containerDiv = document.querySelector(`#numbersContainer_${index}`);
                const badges = containerDiv.querySelectorAll('span[data-original-color]');
                
                if (!isChecked) {
                    // 회색으로 변경 및 복사
                    badges.forEach((badge, badgeIndex) => {
                        badge.className = 'inline-flex items-center justify-center w-[30px] h-[30px] rounded-full font-bold text-xs border-2 bg-gray-200 text-gray-700 border-gray-300';
                    });
                    checkButton.dataset.checked = 'true';
                    
                    // 번호 복사
                    const numbersText = set.numbers.join(' ');
                    this.copyToClipboard(numbersText);
                } else {
                    // 원래 색상으로 복원
                    badges.forEach((badge, badgeIndex) => {
                        const originalColor = originalColorsRef[badgeIndex].originalColor;
                        badge.className = originalColor;
                    });
                    checkButton.dataset.checked = 'false';
                }
            });
            
            numbersContainer.appendChild(checkButton);
            innerContainer.appendChild(numbersContainer);
        });
        
        box.appendChild(innerContainer);
        container.appendChild(box);
    }

    // 카운트다운 렌더링
    renderCountdown(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const updateCountdown = (formatted, remaining) => {
            const [days, hours, minutes, seconds] = formatted.split(':');
            
            container.innerHTML = `
                <div class="text-center">
                    <div class="text-sm text-gray-600 mb-2">다음 갱신까지</div>
                    <div class="flex items-center justify-center gap-2">
                        <div class="bg-blue-500 text-white px-3 py-2 rounded-lg">
                            <div class="text-xs">일</div>
                            <div class="text-xl font-bold">${days}</div>
                        </div>
                        <span class="text-xl text-gray-400">:</span>
                        <div class="bg-blue-500 text-white px-3 py-2 rounded-lg">
                            <div class="text-xs">시</div>
                            <div class="text-xl font-bold">${hours}</div>
                        </div>
                        <span class="text-xl text-gray-400">:</span>
                        <div class="bg-blue-500 text-white px-3 py-2 rounded-lg">
                            <div class="text-xs">분</div>
                            <div class="text-xl font-bold">${minutes}</div>
                        </div>
                        <span class="text-xl text-gray-400">:</span>
                        <div class="bg-blue-500 text-white px-3 py-2 rounded-lg">
                            <div class="text-xs">초</div>
                            <div class="text-xl font-bold">${seconds}</div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${this.scheduleManager.getNextUpdateTimeString()} 예정
                    </div>
                </div>
            `;
        };
        
        this.scheduleManager.updateCountdown(updateCountdown);
    }

    // 통계 기준 날짜 렌더링
    renderStatsDate(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const data = this.dataManager.loadData();
        if (data && data.lastUpdated) {
            const date = new Date(data.lastUpdated);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            container.textContent = `통계 기준: ${year}.${month}.${day}`;
        } else {
            container.textContent = '통계 기준: 데이터 없음';
        }
    }

    // 당첨번호 렌더링
    renderWinningNumbers(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // 1198회차 (2025.11.15) 26 30 33 38 39 41 +21
        const winningNumbers = [26, 30, 33, 38, 39, 41];
        const bonusNumber = 21;
        const round = 1198;
        const date = '2025.11.15';
        
        container.innerHTML = '';
        
        // 회차 및 날짜 텍스트
        const textDiv = document.createElement('div');
        textDiv.className = 'text-sm text-gray-600 mr-2';
        textDiv.textContent = `${round}회차 (${date})`;
        container.appendChild(textDiv);
        
        // 번호 컨테이너 (간격 조정용)
        const numbersDiv = document.createElement('div');
        numbersDiv.className = 'flex flex-wrap items-center gap-1';
        
        // 당첨번호 표시 (진한 색상)
        winningNumbers.forEach(num => {
            const badge = this.createWinningNumberBadge(num);
            numbersDiv.appendChild(badge);
        });
        
        // 보너스 번호 표시
        const plusSpan = document.createElement('span');
        plusSpan.className = 'text-gray-600 mx-1';
        plusSpan.textContent = '+';
        numbersDiv.appendChild(plusSpan);
        
        const bonusBadge = this.createWinningNumberBadge(bonusNumber);
        numbersDiv.appendChild(bonusBadge);
        
        container.appendChild(numbersDiv);
    }

    // 지난 주 결과 모달 렌더링
    renderLastWeekModal() {
        // 고정된 로또 번호 조합 (10개) - 생성된 로또 번호와 동일
        const fixedLottoNumbers = [
            { numbers: [2, 4, 18, 21, 23, 45] },
            { numbers: [2, 13, 22, 26, 28, 36] },
            { numbers: [1, 2, 8, 22, 26, 40] },
            { numbers: [4, 6, 23, 31, 32, 36] },
            { numbers: [1, 14, 21, 24, 27, 29] },
            { numbers: [2, 15, 18, 25, 39, 43] },
            { numbers: [2, 8, 13, 19, 32, 38] },
            { numbers: [1, 2, 6, 15, 23, 32] },
            { numbers: [4, 16, 39, 41, 44, 45] },
            { numbers: [13, 19, 25, 37, 38, 41] }
        ];
        
        // 고정된 번호를 지난 주 결과로 사용
        const lastWeekResults = { results: fixedLottoNumbers };
        
        // 모달 생성
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-center items-center mb-4 relative">
                        <h2 class="text-2xl font-bold text-gray-800 text-center">지난 주 결과</h2>
                        <button id="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl absolute right-0">&times;</button>
                    </div>
                    <div id="modalWinningNumbers" class="mb-4 text-center"></div>
                    <div id="lastWeekResults" class="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 당첨번호 표시
        const winningNumbersContainer = modal.querySelector('#modalWinningNumbers');
        if (winningNumbersContainer) {
            const winningNumbers = [26, 30, 33, 38, 39, 41];
            const bonusNumber = 21;
            const round = 1198;
            const date = '2025.11.15';
            
            winningNumbersContainer.innerHTML = '';
            
            // 회차 및 날짜 텍스트
            const textDiv = document.createElement('div');
            textDiv.className = 'text-sm text-gray-600 mb-2 text-center';
            textDiv.textContent = `${round}회차 (${date})`;
            winningNumbersContainer.appendChild(textDiv);
            
            // 당첨번호 표시
            const numbersDiv = document.createElement('div');
            numbersDiv.className = 'flex flex-wrap items-center justify-center gap-2';
            
            winningNumbers.forEach(num => {
                const badge = this.createWinningNumberBadge(num);
                numbersDiv.appendChild(badge);
            });
            
            // 보너스 번호 표시
            const plusSpan = document.createElement('span');
            plusSpan.className = 'text-gray-600 mx-1';
            plusSpan.textContent = '+';
            numbersDiv.appendChild(plusSpan);
            
            const bonusBadge = this.createWinningNumberBadge(bonusNumber);
            numbersDiv.appendChild(bonusBadge);
            
            winningNumbersContainer.appendChild(numbersDiv);
        }
        
        // 결과 렌더링 (모달 내부 컨테이너 직접 사용)
        const resultsContainer = modal.querySelector('#lastWeekResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            
            // 모든 번호 조합을 하나의 박스 안에 배치
            const innerContainer = document.createElement('div');
            innerContainer.className = 'flex flex-col gap-4';
            
            lastWeekResults.results.forEach((set, index) => {
                const numbersContainer = document.createElement('div');
                numbersContainer.className = 'flex flex-wrap items-center gap-1 justify-center';
                
                set.numbers.forEach(num => {
                    const numberBadge = this.createNumberBadge(num);
                    numbersContainer.appendChild(numberBadge);
                });
                
                // 등수 버튼 (번호 옆에 배치)
                const rank = this.calculateRank(set.numbers);
                const rankButton = this.createRankButton(rank);
                numbersContainer.appendChild(rankButton);
                
                innerContainer.appendChild(numbersContainer);
            });
            
            resultsContainer.appendChild(innerContainer);
        }
        
        // 닫기 버튼 이벤트
        const closeBtn = modal.querySelector('#closeModal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // 배경 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 초기화
    init() {
        // 결과 업데이트 이벤트 리스너
        window.addEventListener('resultsUpdated', (e) => {
            const results = e.detail.results;
            this.renderResults(results, 'resultsContainer');
        });
    }
}

// 전역 인스턴스
const uiManager = new UIManager(dataManager, scheduleManager);

