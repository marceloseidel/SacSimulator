# Dockerfile para a API SAC Simulator

# Usar imagem oficial do .NET 8 SDK para build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto e restaurar dependências
COPY ["SacSimulator.Api/SacSimulator.Api.csproj", "SacSimulator.Api/"]
COPY ["SacSimulator.Core/SacSimulator.Core.csproj", "SacSimulator.Core/"]
RUN dotnet restore "SacSimulator.Api/SacSimulator.Api.csproj"

# Copiar código fonte e fazer build
COPY . .
WORKDIR "/src/SacSimulator.Api"
RUN dotnet build "SacSimulator.Api.csproj" -c Release -o /app/build

# Publicar aplicação
FROM build AS publish
RUN dotnet publish "SacSimulator.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Usar imagem runtime do .NET 8 para execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Criar usuário não-root para segurança
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

# Copiar arquivos publicados
COPY --from=publish /app/publish .

# Configurar variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

# Expor porta
EXPOSE 5000

# Comando de inicialização
ENTRYPOINT ["dotnet", "SacSimulator.Api.dll"]