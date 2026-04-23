// Управление формой заявки и сохранение в localStorage
class RequestManager {
    constructor() {
        this.form = document.getElementById('requestForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.loadFormData();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            fam: document.getElementById('id_fam')?.value || '',
            im: document.getElementById('id_im')?.value || '',
            otch: document.getElementById('id_otch')?.value || '',
            byrthdate: document.getElementById('id_byrthdate')?.value || '',
            dolgn: document.getElementById('id_dolgn')?.value || '',
            tel: document.getElementById('id_tel')?.value || '',
            req_type: document.getElementById('id_req_type')?.value || '',
            snils: document.getElementById('id_snils')?.value || ''
        };

        // Валидация
        if (!formData.fam || !formData.im || !formData.dolgn) {
            this.showAlert('Пожалуйста, заполните обязательные поля (Фамилия, Имя, Должность)', 'danger');
            return;
        }

        // Сохраняем заявку
        this.saveRequest(formData);
        
        // Перенаправляем на страницу успеха
        window.location.href = 'sd_request_good.html';
    }

    saveRequest(requestData) {
        // Получаем существующие заявки
        let requests = JSON.parse(localStorage.getItem('tech_requests') || '[]');
        requests.push(requestData);
        localStorage.setItem('tech_requests', JSON.stringify(requests));
        
        // Также создаем файл для скачивания (имитация сохранения в папку)
        this.downloadRequestFile(requestData);
    }

    downloadRequestFile(requestData) {
        const dataStr = JSON.stringify(requestData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `request_${requestData.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    loadFormData() {
        // Автозаполнение из localStorage (для удобства)
        const savedUser = JSON.parse(localStorage.getItem('last_user') || '{}');
        if (savedUser.fam) {
            if (document.getElementById('id_fam')) document.getElementById('id_fam').value = savedUser.fam;
            if (document.getElementById('id_im')) document.getElementById('id_im').value = savedUser.im;
            if (document.getElementById('id_otch')) document.getElementById('id_otch').value = savedUser.otch;
        }
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.insertBefore(alertDiv, this.form.firstChild);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Админ-панель для просмотра заявок (скрытая)
class AdminPanel {
    constructor() {
        this.checkAdminAccess();
    }

    checkAdminAccess() {
        // Проверяем секретный ключ в URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            this.showAdminPanel();
        }
    }

    showAdminPanel() {
        const requests = JSON.parse(localStorage.getItem('tech_requests') || '[]');
        if (requests.length === 0) return;
        
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 1000;
            overflow: auto;
            padding: 15px;
        `;
        
        panel.innerHTML = `
            <h5>Заявки (${requests.length})</h5>
            <button onclick="this.parentElement.remove()" style="float: right;">✕</button>
            <hr>
            ${requests.map(req => `
                <div style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                    <strong>${req.fam} ${req.im} ${req.otch}</strong><br>
                    Должность: ${req.dolgn}<br>
                    Тип: ${req.req_type}<br>
                    <small>${new Date(req.timestamp).toLocaleString()}</small>
                </div>
            `).join('')}
            <button onclick="localStorage.removeItem('tech_requests'); location.reload();" class="btn btn-danger btn-sm w-100">
                Очистить все
            </button>
        `;
        
        document.body.appendChild(panel);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new RequestManager();
    new AdminPanel();
});