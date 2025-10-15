# Steam API V2 - API REST

Versão evoluída com FastAPI para integração com front-end.

## Como executar

```bash
# Navegue para a pasta v2
cd v2

# Execute a API
python api.py
```

## Endpoints disponíveis

- **GET /games/owned** - Todos os jogos da biblioteca
- **GET /games/recent** - Jogos recentes
- **GET /games/top/{limit}** - Top N jogos mais jogados
- **GET /games/search/{game_name}** - Buscar jogos por nome
- **GET /stats** - Estatísticas gerais
- **GET /docs** - Documentação Swagger

## Acesso

- **API:** http://localhost:8000
- **Documentação:** http://localhost:8000/docs

## Configuração

Configure as variáveis de ambiente na pasta raiz:

```bash
# PowerShell
$env:id_steam="SEU_STEAM_ID"
$env:api_key="SUA_API_KEY_STEAM"
```

## Características

- API REST moderna
- Dados em tempo real
- CORS habilitado para front-end
- Documentação automática
