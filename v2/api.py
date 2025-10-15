from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import math

app = FastAPI(
    title="Steam Games API V2", 
    description="API REST para acessar dados de jogos Steam - Versão 2.0",
    version="2.0.0"
)

# Configuração CORS para o front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def minutos_para_horas(minutos: int) -> int:
    """Converte minutos em horas (arredondado para cima)"""
    return math.ceil(minutos / 60)

def get_steam_credentials():
    """Obtém credenciais Steam do ambiente"""
    id_steam = os.getenv("id_steam")    
    key_steam = os.getenv("api_key")
    
    if not id_steam or not key_steam:
        raise HTTPException(
            status_code=500, 
            detail="Credenciais Steam não configuradas. Configure as variáveis de ambiente 'id_steam' e 'api_key'"
        )
    
    return id_steam, key_steam

@app.get("/games/owned")
async def get_owned_games():
    try:
        id_steam, key_steam = get_steam_credentials()
        
        url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/"
        params = {
            "key": key_steam, 
            "steamid": id_steam, 
            "include_appinfo": 1, 
            "format": "json"
        }

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            game_list = data.get("response", {}).get("games", [])
            
            game_list_sorted = sorted(
                game_list, 
                key=lambda g: g.get("playtime_forever", 0), 
                reverse=True
            )

            games_filtered = [
                {
                    "appid": g["appid"],
                    "name": g["name"],
                    "playtime_hours": round(minutos_para_horas(g.get("playtime_forever", 0)), 1),
                    "img_icon_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{g['appid']}/{g['img_icon_url']}.jpg" if g.get("img_icon_url") else None
                }
                for g in game_list_sorted
            ]
            
            return {
                "success": True,
                "games": games_filtered, 
                "total": len(games_filtered),
                "version": "2.0.0"
            }
        else:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Erro na Steam API: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/games/recent")
async def get_recent_games(count: int = 50):
    try:
        id_steam, key_steam = get_steam_credentials()
        
        url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/"
        params = {
            "key": key_steam,
            "steamid": id_steam,
            "format": "json",
            "count": min(count, 100)  # Limita a 100 jogos máximo
        }

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            games = data.get("response", {}).get("games", [])

            games_sorted = sorted(
                games, 
                key=lambda g: g.get("playtime_2weeks", 0), 
                reverse=True
            )

            recent_games_filtered = [
                {
                    "appid": g["appid"],
                    "nome": g.get("name", ""),
                    "horas_totais": minutos_para_horas(g.get("playtime_forever", 0)),
                    "horas_2_semanas": minutos_para_horas(g.get("playtime_2weeks", 0)),
                    "img_icon_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{g['appid']}/{g['img_icon_url']}.jpg" if g.get("img_icon_url") else None
                }
                for g in games_sorted
            ]

            return {
                "success": True,
                "games": recent_games_filtered, 
                "total": len(recent_games_filtered),
                "version": "2.0.0"
            }
        else:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Erro na Steam API: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/games/top/{limit}")
async def get_top_games(limit: int):
    if limit <= 0 or limit > 100:
        raise HTTPException(
            status_code=400, 
            detail="Limite deve estar entre 1 e 100"
        )
    
    try:
        games_data = await get_owned_games()
        top_games = games_data["games"][:limit]
        
        return {
            "success": True,
            "games": top_games, 
            "total": len(top_games),
            "limit": limit,
            "version": "2.0.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/games/search/{game_name}")
async def search_games(game_name: str):
    try:
        games_data = await get_owned_games()
        
        filtered_games = [
            game for game in games_data["games"] 
            if game_name.lower() in game["name"].lower()
        ]
        
        return {
            "success": True,
            "games": filtered_games,
            "total": len(filtered_games),
            "search_term": game_name,
            "version": "2.0.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/stats")
async def get_stats():
    try:
        games_data = await get_owned_games()
        recent_data = await get_recent_games()
        
        games = games_data["games"]
        
        if not games:
            return {
                "success": True,
                "message": "Nenhum jogo encontrado",
                "stats": {},
                "version": "2.0.0"
            }
        
        total_hours = sum(game["playtime_hours"] for game in games)
        games_with_playtime = [g for g in games if g["playtime_hours"] > 0]
        
        stats = {
            "total_games": len(games),
            "games_played": len(games_with_playtime),
            "games_never_played": len(games) - len(games_with_playtime),
            "total_hours_played": round(total_hours, 1),
            "average_hours_per_game": round(total_hours / len(games_with_playtime), 1) if games_with_playtime else 0,
            "most_played_game": games[0] if games else None,
            "recent_games_count": len(recent_data["games"])
        }
        
        return {
            "success": True,
            "stats": stats,
            "version": "2.0.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    from dotenv import load_dotenv
    
    load_dotenv()
    
    print("🚀 Iniciando Steam Games API V2.0...")
    print("📖 Documentação disponível em: http://localhost:8000/docs")
    print("🌐 API disponível em: http://localhost:8000")
    print("💡 Versão 2.0 - API REST independente")
    
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)