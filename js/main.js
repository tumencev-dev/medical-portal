// Основной JavaScript для сайта

// Анимация появления элементов
document.addEventListener('DOMContentLoaded', () => {
    // Анимация для карточек
    const cards = document.querySelectorAll('.service-card, .news-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Поиск в телефонном справочнике
function searchPhonebook() {
    const input = document.getElementById('phonebookSearch');
    if (!input) return;
    
    const filter = input.value.toLowerCase();
    const table = document.querySelector('.phonebook-table tbody');
    if (!table) return;
    
    const rows = table.getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    }
}

// Экспорт телефонного справочника в CSV
function exportPhonebookToCSV() {
    const table = document.querySelector('.phonebook-table');
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let row of rows) {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => 
            `"${cell.textContent.replace(/"/g, '""')}"`
        ).join(',');
        csv.push(rowData);
    }
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phonebook.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Сохранение настроек темы
function setTheme(theme) {
    localStorage.setItem('site_theme', theme);
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Проверка сохраненной темы
const savedTheme = localStorage.getItem('site_theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}