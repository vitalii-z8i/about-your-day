### About Your Day

## A Journaling/Chat application that uses AI to ask you about your day and provide you some insights
You can access the application [Here](https://about-your-day.vercel.app).

## Project setup (development)

### Docker/Docker Compose
```bash
docker compose up # or docker-compose up
```

### Prerequisites
- Node.js v24 needs to be installed on your local machine.
- You'll need to have a MongoDB instance running on your local machine.
- You'll need to have an anthropic API key and some credits.
- You should create a `.env` file in the root directory and add ENV variables, listed in `.env.example`.

### Launching the development server:

```bash
npm install
npm run dev
```

### Usage
To use the application, simply register and log in.
Every chat is limited to 12 messages.
