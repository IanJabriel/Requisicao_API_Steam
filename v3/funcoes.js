const API_URL = 'http://localhost:8000';

async function fetchAPI(endpoint){
    try{
        const response = await fetch(`${API_URL}/${endpoint}`);
        if(!response.ok){
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
}

function showLoading(containerId, message = 'Carregando...') {
    document.getElementById(containerId).innerHTML = `<p class="loading">${message}</p>`;
}

function showError(containerId, message = 'Erro ao carregar dados') {
    document.getElementById(containerId).innerHTML = `<p class="error">${message}</p>`;
}

function showToggleButton(contentId) {
    const content = document.getElementById(contentId);
    const section = content.closest('section');
    const toggleButton = section.querySelector('.toggle-button');
    if (toggleButton) {
        toggleButton.classList.add('visible');
    }
}

function createGameCard(game) {
    return `
        <div class="game-card">
            <img src="${game.img_icon_url}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <h3>${game.name}</h3>
            <div class="hours">${game.playtime_hours}h</div>
        </div>
    `;
}

function createRecentGameItem(game) {
    return `
        <div class="game-item">
            <img src="${game.img_icon_url}" alt="${game.nome}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <span class="name">${game.nome}</span>
            <div>
                <span class="hours">${game.horas_2_semanas}h</span> nas últimas 2 semanas
                <br>
                <small style="color: #999;">Total: ${game.horas_totais}h</small>
            </div>
        </div>
    `;
}

function createGameItem(game) {
    return `
        <div class="game-item">
            <img src="${game.img_icon_url}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <span class="name">${game.name}</span>
            <div>
                <span class="hours">${game.playtime_hours}h</span> jogadas
            </div>
        </div>
    `;
}

async function loadAllGames(){
    const containerId = 'all-games-container';
    showLoading(containerId, 'Carregando jogos...');
    
    const data = await fetchAPI('games/owned');
    
    if(data && data.games && data.games.length > 0){
        document.getElementById(containerId).innerHTML = data.games.map(createGameItem).join('');
        showToggleButton('all-games-content');
    } else {
        showError(containerId, 'Nenhum jogo encontrado');
    }
}

async function loadRecentGames(){
    const containerId = 'recent-games-container';
    showLoading(containerId, 'Carregando jogos recentes...');
    
    const data = await fetchAPI('games/recent');
    
    if (data && data.games && data.games.length > 0) {
        document.getElementById(containerId).innerHTML = data.games.map(createRecentGameItem).join('');
        showToggleButton('recent-games-content');
    } else {
        showError(containerId, 'Nenhum jogo jogado recentemente');
    }
}

async function loadStats() {
    const containerId = 'stats-container';
    showLoading(containerId, 'Carregando estatísticas...');
    
    const data = await fetchAPI('stats');
    
    if (data && data.stats) {
        const stats = data.stats;
        document.getElementById(containerId).innerHTML = `
            <p><strong>Total de Jogos:</strong> ${stats.total_games}</p>
            <p><strong>Total de Horas Jogadas:</strong> ${stats.total_hours_played}h</p>
            <p><strong>Média de Horas por Jogo:</strong> ${stats.average_hours_per_game}h</p>
            <p><strong>Jogo Mais Jogado:</strong> ${stats.most_played_game.name}</p>
            <img src="${stats.most_played_game.img_icon_url}" alt="${stats.most_played_game.name}" width="100">
        `;
        showToggleButton('stats-content');
    } else {
        showError(containerId, 'Erro ao carregar estatísticas');
    }
}

async function loadTopGames() {
    const containerId = 'top-games';
    showLoading(containerId, 'Carregando top 10...');
    
    const data = await fetchAPI('games/top/10');
    
    if (data && data.games && data.games.length > 0) {
        document.getElementById(containerId).innerHTML = data.games.map(createGameItem).join('');
        showToggleButton('top-games-content');
    } else {
        showError(containerId, 'Nenhum jogo encontrado');
    }
}

async function searchGames() {
    const query = document.getElementById('search-input').value.trim();
    const containerId = 'search-results';

    if (query.length < 2) {
        showError(containerId, 'Digite pelo menos 2 caracteres');
        return;
    }

    showLoading(containerId, 'Buscando...');
    
    const data = await fetchAPI(`games/search/${encodeURIComponent(query)}`);

    if (data && data.games && data.games.length > 0) {
        document.getElementById(containerId).innerHTML = `
            <div class="games-grid">
                ${data.games.map(createGameCard).join('')}
            </div>
        `;
        showToggleButton('search-content');
    } else {
        showError(containerId, 'Nenhum jogo encontrado');
    }
}

function init() {
    document.getElementById('load-all-games-button').addEventListener('click', loadAllGames);
    document.getElementById('load-recent-games-button').addEventListener('click', loadRecentGames);
    document.getElementById('load-stats-games-button').addEventListener('click', loadStats);
    document.getElementById('load-top-games-button').addEventListener('click', loadTopGames);
    document.getElementById('search-button').addEventListener('click', searchGames);
    
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            
            content.classList.toggle('hidden');
            this.classList.toggle('collapsed');
            
            if (content.classList.contains('hidden')) {
                this.textContent = '►';
            } else {
                this.textContent = '▼';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', init);