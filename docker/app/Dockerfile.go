FROM golang:1.21-alpine AS builder

WORKDIR /app

# Установка зависимостей
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Копирование go.mod и go.sum для загрузки зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN CGO_ENABLED=1 GOOS=linux go build -o cocode-server .

# Финальный образ
FROM alpine:latest

WORKDIR /app

# Установка зависимостей для SQLite
RUN apk add --no-cache sqlite-libs ca-certificates

# Создание директории для БД
RUN mkdir -p /data

# Копирование бинарника из builder
COPY --from=builder /app/cocode-server .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/static ./static

# Экспорт портов
EXPOSE 8080

# Запуск приложения
CMD ["./cocode-server"]
