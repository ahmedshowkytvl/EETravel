# Sahara Journeys - Laravel Backend API

## مشكلة Artisan محلولة ✅

تم إنشاء مشروع Laravel كامل مع جميع الملفات المطلوبة، بما في ذلك ملف `artisan` المفقود.

## حل مشكلة vendor المفقود

```bash
# الحل السريع - تثبيت التبعيات
composer install

# أو استخدم السكريبت التلقائي
./install-dependencies.sh
```

## التشغيل السريع

```bash
# 1. تثبيت التبعيات (مطلوب أولاً)
composer install

# 2. اختبار أن كل شيء يعمل
./test-setup.sh

# 3. تشغيل السكريبت الأساسي
./deploy-simple.sh

# 4. تشغيل الخادم
php artisan serve --host=0.0.0.0 --port=8000
```

## إذا لم يكن Composer مثبت

```bash
# تحميل وتثبيت Composer محلياً
curl -sS https://getcomposer.org/installer | php
php composer.phar install

# أو على Windows
php composer.phar install
```

## معلومات الدخول الافتراضية

- **المشرف**: admin@saharajourneys.com / password123
- **المستخدم**: user@example.com / password123

## API Endpoints المتاحة

### المصادقة
- `POST /api/auth/register` - إنشاء حساب
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/user` - معلومات المستخدم

### الوجهات السياحية
- `GET /api/destinations` - قائمة الوجهات
- `POST /api/destinations` - إضافة وجهة جديدة
- `GET /api/destinations/{id}` - تفاصيل وجهة
- `PUT /api/destinations/{id}` - تحديث وجهة
- `DELETE /api/destinations/{id}` - حذف وجهة

### الجولات السياحية
- `GET /api/tours` - قائمة الجولات
- `POST /api/tours` - إضافة جولة جديدة
- `GET /api/tours/{id}` - تفاصيل جولة
- `PUT /api/tours/{id}` - تحديث جولة
- `DELETE /api/tours/{id}` - حذف جولة

### الحزم السياحية
- `GET /api/packages` - قائمة الحزم
- `POST /api/packages` - إضافة حزمة جديدة
- `GET /api/packages/{id}` - تفاصيل حزمة
- `PUT /api/packages/{id}` - تحديث حزمة
- `DELETE /api/packages/{id}` - حذف حزمة

### الحجوزات
- `GET /api/bookings` - قائمة الحجوزات
- `POST /api/bookings` - إنشاء حجز جديد
- `GET /api/bookings/{id}` - تفاصيل حجز
- `PUT /api/bookings/{id}` - تحديث حجز
- `DELETE /api/bookings/{id}` - إلغاء حجز

### المدفوعات
- `POST /api/payments/stripe` - دفع عبر Stripe
- `POST /api/payments/paypal` - دفع عبر PayPal
- `POST /api/payments/webhook/stripe` - Stripe webhook
- `POST /api/payments/webhook/paypal` - PayPal webhook

### لوحة الإدارة (تحتاج صلاحيات admin)
- `GET /api/admin/dashboard` - إحصائيات لوحة الإدارة
- `GET /api/admin/users` - إدارة المستخدمين
- `GET /api/admin/bookings` - إدارة الحجوزات
- `GET /api/admin/analytics` - التحليلات والتقارير

## الملفات الأساسية

```
laravel-backend/
├── artisan ✅              # ملف الأوامر الأساسي
├── app/
│   ├── Models/            # نماذج البيانات
│   ├── Http/Controllers/  # المتحكمات
│   └── Http/Middleware/   # الوسطاء
├── database/
│   ├── migrations/        # ملفات الهجرة
│   └── seeders/          # بيانات الاختبار
├── routes/
│   ├── api.php           # مسارات API
│   └── web.php           # المسارات الأساسية
└── config/               # ملفات التكوين
```

## متطلبات النظام

- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Laravel 10

## حل مشكلة Artisan

تم إنشاء جميع الملفات المطلوبة:
- ✅ `artisan` - ملف الأوامر الأساسي
- ✅ `bootstrap/app.php` - تطبيق Laravel
- ✅ `app/Http/Kernel.php` - نواة HTTP
- ✅ `app/Console/Kernel.php` - نواة الأوامر
- ✅ `app/Providers/` - مزودي الخدمة
- ✅ `config/` - ملفات التكوين
- ✅ `routes/` - المسارات

الآن يمكنك تشغيل أي أمر artisan بدون مشاكل!