# 🎮 Steam API V1 - Versão Piloto

Versão original que salva dados de jogos Steam em arquivos JSON.

## 🚀 Como executar

```bash
# Navegue para a pasta v1
cd v1

# Execute o script
python steam_api.py
```

## 📂 Arquivos gerados

- `JsonSteam.json` - Lista completa de jogos ordenados por tempo jogado
- `JogosRecentes.json` - Jogos jogados recentemente

## ⚙️ Configuração

Configure as variáveis de ambiente na pasta raiz:

```bash
$env:id_steam="SEU_STEAM_ID"
$env:api_key="SUA_API_KEY_STEAM"
```

## 📋 Características

- ✅ Script standalone
- ✅ Salva dados localmente
- ✅ Versão estável e testada