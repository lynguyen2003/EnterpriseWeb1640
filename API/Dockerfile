FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY ./EnpterpriseWebApi/EnpterpriseWebApi.csproj ./EnpterpriseWebApi/
COPY ./DataServices/DataServices.csproj ./DataServices/
COPY ./Models/Models.csproj ./Models/

COPY . ./
RUN dotnet publish ./EnpterpriseWebApi/EnpterpriseWebApi.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/sdk:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "EnpterpriseWebApi.dll"]