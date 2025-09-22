# Zoo Logo Generator Makefile
# @zooai/logo - TypeScript logo generator for the Zoo ecosystem

.PHONY: help install build clean dev test publish generate-icons preview lint format typecheck all

# Default target
all: install build

# Help target - displays available commands
help:
	@echo "Zoo Logo Generator - Make targets:"
	@echo ""
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build TypeScript files"
	@echo "  make clean        - Remove build artifacts and dependencies"
	@echo "  make dev          - Run in development mode with watch"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run ESLint"
	@echo "  make format       - Format code with Prettier"
	@echo "  make typecheck    - Run TypeScript type checking"
	@echo "  make generate     - Generate all logo variations and icons"
	@echo "  make preview      - Open preview of generated logos"
	@echo "  make publish      - Publish package to npm"
	@echo "  make all          - Install and build (default)"
	@echo ""

# Install dependencies
install:
	npm install

# Build TypeScript files
build:
	npm run build

# Clean build artifacts and dependencies
clean:
	rm -rf dist node_modules package-lock.json
	@echo "✓ Cleaned build artifacts and dependencies"

# Development mode with watch
dev:
	npm run dev

# Run tests
test:
	npm test

# Run linter
lint:
	npm run lint

# Format code
format:
	npm run format

# Type checking
typecheck:
	npm run typecheck

# Generate all logo variations and icons
generate: build
	npm run generate

# Preview generated logos (opens in default browser)
preview: generate
	@if [ -f "menu-bar-preview.html" ]; then \
		open menu-bar-preview.html; \
	else \
		echo "Generating preview..."; \
		npm run preview; \
		open menu-bar-preview.html; \
	fi

# Publish to npm
publish: clean install build test
	npm publish

# Watch for changes and rebuild
watch:
	npm run watch

# Install global CLI
install-cli:
	npm link

# Uninstall global CLI
uninstall-cli:
	npm unlink

# Check for updates
check-updates:
	npx npm-check-updates

# Update dependencies
update-deps:
	npx npm-check-updates -u
	npm install

# Generate documentation
docs:
	npx typedoc src/index.ts

# Docker build (for CI/CD)
docker-build:
	docker build -t zooai/logo .

# Run in Docker
docker-run:
	docker run --rm -v $(PWD)/dist:/app/dist zooai/logo