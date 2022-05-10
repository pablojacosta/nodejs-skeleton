.PHONY: run test

run:
	docker-compose up

test:
	docker-compose -f docker-compose.yml -f docker-compose.api-test.yml up --exit-code-from app
