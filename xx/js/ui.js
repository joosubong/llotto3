// UI 렌더링 로직
class UIManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
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
}

// 전역 인스턴스
const uiManager = new UIManager(dataManager);

