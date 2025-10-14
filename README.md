# � GamerHub - Steam API Integration

Projeto de integração com a Steam Web API para buscar informações de jogos, desenvolvido como estudo de APIs e versionamento de código.

## 📂 Estrutura do Projeto

```
GamerHub/
├── v1/                    # 🎯 Versão Piloto
│   ├── steam_api.py       # Script que gera arquivos JSON
│   └── README.md          # Documentação da V1
├── v2/                    # 🚀 Versão API REST
│   ├── api.py            # FastAPI moderna
│   └── README.md          # Documentação da V2
├── shared/               # 🔧 Utilitários compartilhados
├── tests/                # 🧪 Testes automatizados
├── requirements.txt      # 📦 Dependências
└── .env.example         # ⚙️ Exemplo de configuração
```

## 🎯 Versões Disponíveis

### [V1 - Versão Piloto](v1/)
**Script standalone que salva dados em arquivos JSON**
- ✅ Implementação inicial e estável
- ✅ Salva dados localmente (JsonSteam.json, JogosRecentes.json)
- ✅ Ideal para análise offline dos dados
- ✅ Base para desenvolvimento da V2

### [V2 - API REST](v2/)
**API moderna com FastAPI para integração com front-end**
- ✅ Endpoints REST organizados
- ✅ Dados em tempo real (sem arquivos)
- ✅ Documentação automática (Swagger)
- ✅ CORS habilitado para front-end
- ✅ Pronto para produção

## 🚀 Início Rápido

### 1. **Configuração**
```bash
# Clone o repositório
git clone https://github.com/IanJabriel/Requisicao_API_Steam.git
cd Requisicao_API_Steam

# Instale as dependências
pip install -r requirements.txt

# Configure as credenciais Steam
cp .env.example .env
# Edite o .env com suas credenciais
```

### 2. **Escolha sua versão**

**Para usar V1 (JSON):**
```bash
cd v1
python steam_api.py
```

**Para usar V2 (API):**
```bash
cd v2
python api.py
# Acesse: http://localhost:8000/docs
```

## 🔑 Configuração Steam API

1. **Obtenha sua Steam Web API Key:**
   - Acesse: [Steam Web API](https://steamcommunity.com/dev/apikey)
   - Registre sua aplicação

2. **Configure no .env:**
```env
id_steam=SEU_STEAM_ID
api_key=SUA_API_KEY_STEAM
```

## 🛠️ Tecnologias

- **Python 3.11+**
- **Requests** - Requisições HTTP
- **FastAPI** - Framework web moderno (V2)
- **Uvicorn** - Servidor ASGI (V2)
- **Pytest** - Testes automatizados
- **Python-dotenv** - Gerenciamento de variáveis

## 📊 Funcionalidades

- 📋 Lista completa de jogos da biblioteca Steam
- 🎯 Jogos jogados recentemente
- 📈 Estatísticas de tempo jogado
- 🔍 Busca por nome de jogos
- 🏆 Ranking dos jogos mais jogados
- 🖼️ URLs das imagens dos jogos

## 🧪 Testes

```bash
pytest -v
```

## 📈 Evolução do Projeto

Este projeto demonstra a **evolução natural de software**:

1. **V1** - Prototipação e validação do conceito
2. **V2** - Evolução para arquitetura moderna e escalável
3. **Estrutura modular** - Preparada para futuras expansões

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
