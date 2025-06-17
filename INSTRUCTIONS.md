# كيفية تشغيل منصة رحلات الصحراء

## الطريقة الصحيحة للتشغيل

### 1. لا تستخدم `npm run dev` - استخدم هذه الأوامر بدلاً من ذلك:

```bash
# للتشغيل العادي
./start.sh

# أو للتشغيل على Linux
./start-linux.sh

# أو للإنتاج
./start-production.sh
```

### 2. للتشغيل على المنفذ 8080 (الأفضل للينكس):

```bash
# الطريقة المُوصى بها
./start-port8080.sh

# أو التشغيل المباشر
PORT=8080 NODE_ENV=production npx tsx server/index.ts
```

### 3. حل مشكلة cross-env:

```bash
# تثبيت cross-env إذا كنت تريد استخدام npm run dev
npm install cross-env

# أو استخدم البدائل المباشرة
NODE_ENV=development npx tsx server/index.ts
```

## الوصول للمنصة

### الخادم يعمل على المنفذ 8080 (الأفضل للينكس):
- الموقع الرئيسي: http://74.179.85.9:8080
- لوحة الإدارة: http://74.179.85.9:8080/admin
- واجهات API: http://74.179.85.9:8080/api/admin/users

### للحصول على المنفذ 80 (اختياري):
```bash
# إعداد إعادة التوجيه من المنفذ 80 إلى 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

## ملفات مهمة

- `server.pid` - رقم العملية الحالية
- `sahara-server.log` - سجل الخادم
- `.env` - متغيرات البيئة
- `README-PORT80.md` - حلول المنفذ 80

## حالة قاعدة البيانات

المنصة متصلة بقاعدة بيانات Neon PostgreSQL مع:
- جميع الجداول (52+ جدول)
- البيانات الأساسية محملة
- أسعار بالجنيه المصري
- دعم اللغة العربية والإنجليزية

## إذا واجهت مشاكل

1. تحقق من العملية الحالية: `cat server.pid && ps -p $(cat server.pid)`
2. تحقق من السجل: `tail -f sahara-server.log`
3. أوقف العمليات: `pkill -f "tsx server"`
4. أعد التشغيل: `./start-linux.sh`