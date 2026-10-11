.PHONY: help setup dev migrate seed test docker mobile-setup mobile

help: ## عرض الأوامر المتاحة
	@echo "EduTech Single-Tenant Starter Pack - Commands:"
	@echo "  make setup        - تجهيز وإعداد بيئة العمل محلياً (Backend & Web)"
	@echo "  make dev          - تشغيل السيرفرات (Laravel Backend & React Frontend)"
	@echo "  make migrate      - تشغيل ترحيلات قاعدة البيانات"
	@echo "  make seed         - تعبئة البيانات الافتراضية والدورات والمستخدمين"
	@echo "  make test         - تشغيل حزمة الاختبارات الآلية (Feature Tests)"
	@echo "  make docker       - تشغيل المشروع عبر Docker Compose"
	@echo "  make mobile-setup - إعداد بيئة FVM وتثبيت إصدار Flutter وحزم Riverpod"
	@echo "  make mobile       - تشغيل تطبيق الفلاتر عبر FVM (fvm flutter run)"

setup: ## إعداد المشروع محلياً
	cd backend && cp -n .env.example .env || true
	cd backend && php artisan key:generate
	cd backend && touch database/database.sqlite
	cd backend && php artisan migrate --force
	cd backend && php artisan db:seed --force
	cd backend && php artisan storage:link || true
	npm install

dev: ## تشغيل السيرفر
	@echo "Starting Laravel Backend on http://localhost:8000 and Vite Frontend..."
	(cd backend && php artisan serve --port=8000) & npm run dev

migrate: ## ترحيل قاعدة البيانات
	cd backend && php artisan migrate

seed: ## تعبئة البيانات التجريبية
	cd backend && php artisan db:seed --force

test: ## تشغيل الاختبارات الآلية
	cd backend && php artisan test

docker: ## تشغيل عبر Docker
	docker-compose up -d --build

mobile-setup: ## إعداد بيئة FVM وحزم Flutter
	cd mobile && ./scripts/setup.sh

mobile: ## تشغيل تطبيق الفلاتر عبر FVM
	cd mobile && (fvm flutter run || flutter run)
