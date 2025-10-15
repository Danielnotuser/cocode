FROM golang:1.24-alpine AS builder

# Устанавливаем необходимые пакеты для компиляции C-кода (для SQLite)
RUN apk add --no-cache gcc musl-dev

WORKDIR /app

# Копируем исходный код
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Собираем приложение
RUN CGO_ENABLED=1 GOOS=linux go build -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Копируем собранное приложение
COPY --from=builder /app/main .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/static ./static

# Создаем папку для общей базы данных
RUN mkdir -p /shared_data

# Указываем переменные окружения
# ENV JWT_SECRET=production_secret_key_here
ENV DB_PATH=/shared_data/cocode.db

EXPOSE 8080

CMD ["./main"]
