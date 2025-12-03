# Stage 1: Build the Go application
FROM golang:1.21-alpine AS builder

# Install git
RUN apk update && apk add --no-cache git

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
# Set GOPROXY to direct to avoid proxy issues and download all dependencies.
ENV GOPROXY=direct
# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o /worker ./cmd/worker

# Stage 2: Create the final, small image
FROM alpine:latest

# Copy the pre-built binary from the builder stage
COPY --from=builder /worker /worker


# Command to run the executable
CMD ["/worker"]