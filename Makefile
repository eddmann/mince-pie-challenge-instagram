generate:
	docker run --shm-size 1G --rm -v $(PWD):/app alekzonder/puppeteer:latest node index.js

test:
	docker run --shm-size 1G --rm -v $(PWD):/app alekzonder/puppeteer:latest npm test

install:
	docker run --shm-size 1G --rm -v $(PWD):/app alekzonder/puppeteer:latest npm install
