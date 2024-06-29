FROM golang:1.22-alpine
WORKDIR /app

RUN apk --no-cache add gcc g++ make git

COPY ./go.mod ./go.sum ./

RUN go mod tidy

COPY . .

RUN make build

RUN chmod +x main

EXPOSE 3000

CMD ["./main"]

