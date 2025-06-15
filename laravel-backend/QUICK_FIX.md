# حل سريع لمشكلة vendor المفقود

## المشكلة
```
Failed to open stream: No such file or directory in artisan on line 18
```

## الحل السريع

### الطريقة 1: تثبيت Composer (المفضلة)
```bash
# تثبيت التبعيات
composer install

# تشغيل الاختبار مرة أخرى
./test-setup.sh
```

### الطريقة 2: إذا لم يكن Composer مثبت
```bash
# تحميل Composer
curl -sS https://getcomposer.org/installer | php

# تثبيت التبعيات
php composer.phar install

# أو على Windows
php composer.phar install
```

### الطريقة 3: تشغيل السكريبت الكامل مباشرة
```bash
# يقوم بتثبيت كل شيء تلقائياً
./deploy-simple.sh
```

## بعد حل المشكلة
بمجرد تثبيت vendor، ستعمل جميع الأوامر:
- `php artisan --version`
- `php artisan serve`
- `php artisan migrate`

## ملاحظة مهمة
مجلد vendor يحتوي على جميع مكتبات Laravel وهو ضروري لتشغيل أي مشروع Laravel.