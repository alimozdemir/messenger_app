FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
# /app directory is the where the binary files are will be present
WORKDIR /app
# Output port for the ASP.NET Core
EXPOSE 80

# Start to build
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
 
# Copy all source files to /src folder
# This is necessary for solutions. (Multiple projects, also you can define this by specifying projects)
COPY ./ /src
WORKDIR /src

RUN dotnet restore "messenger_api/messenger_api.csproj" /p:EnableDefaultItems=false
RUN dotnet build "messenger_api/messenger_api.csproj" -c Release -o /app

RUN chmod +x ./messenger_api/entrypoint.sh
CMD /bin/bash ./messenger_api/entrypoint.sh

# Rename the image as publish
FROM build AS publish
RUN dotnet publish "messenger_api/messenger_api.csproj" -c Release -o /out

# Building the project is done. We need the runtime image.
FROM base

# Go back to /app
WORKDIR /app

# Copy all published files into /app folder
COPY --from=publish /out .
ENTRYPOINT ["dotnet", "messenger_api.dll"]