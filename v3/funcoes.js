const API_URL = 'http://localhost:8000';

async function fetchAPI(endpoint){
    try{
        const response =  await fetch(`${API_URL}/${endpoint}`);
        if(!response.ok){
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        return null;
    }
};

async function loadAllGames(){
    const data = await fetchAPI('games/owned');
    const gamesContainer = document.getElementById('all-games-container');
    if(data && data.games){
        gamesContainer.innerHTML = data.games.map(game => `
            <div class="game-card">
                <img src="${game.img_icon_url}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${game.name}</h3>
                <div class="hours">${game.playtime_hours}h</div>
            </div>
        `).join('');
    }
}
document.getElementById('load-all-games-button').addEventListener('click', loadAllGames);

async function loadRecentGames(){
    const data = await fetchAPI('games/recent');
    const recentContainer = document.getElementById('recent-games-container');
    console.log(data);
    console.log(data.games);
    if (data && data.games && data.games.length > 0) {
        recentContainer.innerHTML = data.games.map(game => `
            <div class="game-item">
                <img src="${game.img_icon_url}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <span class="name">${game.nome}</span>
                <div>
                    <span class="hours">${game.horas_2_semanas}h</span> nas últimas 2 semanas
                    <br>
                    <small style="color: #999;">Total: ${game.horas_totais}h</small>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="loading">Nenhum jogo jogado recentemente</p>';
    }
}
document.getElementById('load-recent-games-button').addEventListener('click', loadRecentGames);

async function loadStats() {
    const data = await fetchAPI('stats');
    const statsContainer = document.getElementById('stats-container');
    console.log(data.stats);
    if (data && data.stats) {
        statsContainer.innerHTML = `
            <p><strong>Total de Jogos:</strong> ${data.stats.total_games}</p>
            <p><strong>Total de Horas Jogadas:</strong> ${data.stats.total_hours_played}h</p>
            <p><strong>Média de Horas por Jogo:</strong> ${data.stats.average_hours_per_game}h</p>
            <p><strong>Jogo Mais Jogado:</strong> ${data.stats.most_played_game.name}</p>
            <img src="${data.stats.most_played_game.img_icon_url}" alt="${data.stats.most_played_game.name}" width="100">
        `;
    } else {
        console.error("Dados de stats não encontrados.");
    }
}
document.getElementById('load-stats-games-button').addEventListener('click', loadStats);