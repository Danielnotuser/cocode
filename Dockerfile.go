FROM golang:1.21-alpine AS builder

WORKDIR /app

# Копируем исходный код
COPY . .

# Устанавливаем зависимости и собираем приложение
RUN go mod tidy
RUN go build -o cocode-server .

# Финальный образ
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR ~/cocode-app

# Копируем собранный бинарник
COPY --from=builder /app/cocode-server .

EXPOSE 8080

CMD ["./cocode-server"]
