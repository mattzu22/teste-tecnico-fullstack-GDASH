
FROM golang:1.21-alpine AS builder


RUN apk update && apk add --no-cache git

WORKDIR /app


COPY go.mod go.sum ./

ENV GOPROXY=direct

RUN go mod download


COPY . .

RUN go build -o /worker ./cmd/worker

FROM alpine:latest

COPY --from=builder /worker /worker

CMD ["/worker"]