# Plan and thoughts and reasoning

### DDD
We'll use clean architecture for a few reasons:
1. It provides a clear separation of business logic from presentation logic. Since the task is ambiguous - we'd like to keep our implementation options as open as possible.
2. It works pretty good with AI (Once you have an entire layer of business logic - AI can generate implementations for you, while keeping code clean and maintainable)

### Next JS & JWT auth
1. NextJS is chosen for speed and ease of initial infrastructure setup (Hosting and maintenance of separate api/frontend servers would take more time and effort than a single nextjs server)
2. JWT auth is chosen because there's a chance this may grow into a separate API/microservices app and have multiple clients (e.g. web, mobile, desktop). Using cookies for auth would make us struggle with our own auth if that will be the case.
