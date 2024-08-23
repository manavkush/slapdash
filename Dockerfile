FROM golang:1.22-alpine as base
# Install system dependencies including 'make'
RUN apk update && apk add --no-cache gcc libc-dev make

FROM base as builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN make build


FROM alpine
RUN apk add ca-certificates
COPY --from=builder /app/main /app/main
EXPOSE 3000

CMD ["/app/main"]

