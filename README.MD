# SAC Simulator

Um simulador completo do Sistema de Amortização Constante (SAC) desenvolvido em C# com ASP.NET Core para a API e front-end web responsivo.

## 🚀 Funcionalidades

- **Cálculo SAC**: Simulação completa do Sistema de Amortização Constante
- **API REST**: Backend em ASP.NET Core 8 com documentação Swagger
- **Interface Web**: Front-end responsivo com Bootstrap 5
- **Containerização**: Docker e Docker Compose para facilitar o deployment
- **Exportação**: Download da simulação em formato CSV

## 🏗️ Arquitetura

```
SacSimulator/
├── SacSimulator.Core/           # Biblioteca de classes com lógica de negócio
├── SacSimulator.Api/            # API REST em ASP.NET Core
├── SacSimulator.Web/            # Front-end em HTML/CSS/JavaScript
└── docker-compose.yml          # Orquestração dos containers
```

## 📋 Pré-requisitos

- **.NET 8 SDK** (para desenvolvimento local)
- **Docker** e **Docker Compose** (para execução em containers)

## 🛠️ Executando com Docker (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd SacSimulator
   ```

2. **Execute com Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações:**
   - **Front-end**: http://localhost:8080
   - **API**: http://localhost:5000
   - **Swagger**: http://localhost:5000/swagger

## 🔧 Executando Localmente (Desenvolvimento)

### API

```bash
cd SacSimulator.Api
dotnet restore
dotnet run
```

A API estará disponível em: `http://localhost:5000`

### Front-end

Sirva os arquivos da pasta `SacSimulator.Web` usando um servidor HTTP local:

```bash
cd SacSimulator.Web
# Usando Python
python -m http.server 8080

# Usando Node.js (http-server)
npx http-server -p 8080
```

O front-end estará disponível em: `http://localhost:8080`

## 📱 Como Usar

1. **Acesse o simulador** em http://localhost:8080
2. **Preencha os parâmetros:**
   - Valor Financiado (R$)
   - Taxa de Juros Anual (%)
   - Número de Parcelas (meses)
3. **Clique em "Simular"**
4. **Visualize os resultados:**
   - Resumo da simulação
   - Tabela detalhada de parcelas
5. **Exporte os dados** em CSV se necessário

## 🔍 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/sac/simulate` | Calcula simulação SAC |
| `GET` | `/api/sac/health` | Verifica saúde da API |

### Exemplo de Requisição

```json
POST /api/sac/simulate
{
  "valorFinanciado": 100000.00,
  "taxaJurosAnual": 12.5,
  "numeroParcelas": 120
}
```

### Exemplo de Resposta

```json
{
  "valorFinanciado": 100000.00,
  "taxaJurosAnual": 12.5,
  "taxaJurosMensal": 0.0104167,
  "numeroParcelas": 120,
  "valorAmortizacao": 833.33,
  "valorTotalJuros": 63020.83,
  "valorTotalAPagar": 163020.83,
  "parcelas": [
    {
      "numero": 1,
      "valorAmortizacao": 833.33,
      "valorJuros": 1041.67,
      "valorParcela": 1875.00,
      "saldoDevedor": 99166.67,
      "jurosAcumulados": 1041.67,
      "amortizacaoAcumulada": 833.33
    }
    // ... demais parcelas
  ]
}
```

## 🧪 Testes

Para executar os testes (quando implementados):

```bash
dotnet test
```

## 📦 Docker

### Construir imagens individuais

**API:**
```bash
cd SacSimulator.Api
docker build -t sac-simulator-api .
```

**Web:**
```bash
cd SacSimulator.Web
docker build -t sac-simulator-web .
```

### Executar containers individuais

**API:**
```bash
docker run -p 5000:5000 sac-simulator-api
```

**Web:**
```bash
docker run -p 8080:80 sac-simulator-web
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuPerfil](https://github.com/seuperfil)

## 📚 Recursos Adicionais

- [Documentação ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- [Docker Documentation](https://docs.docker.com/)
- [Sistema de Amortização Constante - Wikipedia](https://pt.wikipedia.org/wiki/Sistema_de_amortiza%C3%A7%C3%A3o_constante)