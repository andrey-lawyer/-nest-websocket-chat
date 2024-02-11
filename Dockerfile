# Use the official Node.js image as a base image
# Используем официальный образ Node.js в качестве базового образа
FROM node:18.17.0-alpine AS builder

# Set the working directory
# Установка рабочей директории
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# Копирование package.json и package-lock.json в рабочую директорию
COPY ./package.json ./package-lock.json ./

# Install dependencies
# Установка зависимостей
RUN npm install

# Copy other application files
# Копирование остальных файлов приложения
COPY . .

# Build the application
# Сборка приложения
RUN npm run build

# Use the standard Node.js image to run the application
# Используем стандартный образ Node.js для запуска приложения
FROM node:18.17.0-alpine

# Set the working directory
# Установка рабочей директории
WORKDIR /app

# Copy the built application from the previous stage to the container
# Копирование собранного приложения из предыдущего этапа в контейнер
COPY --from=builder /app .

# Specify the port that the Nest.js backend will use
# Указываем порт, который будет использоваться бекендом Nest.js
EXPOSE 3000

# Run the application
# Запуск приложения
CMD ["npm", "run", "start:prod"]