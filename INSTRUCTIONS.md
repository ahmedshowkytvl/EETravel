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

### 2. إذا كنت تريد التشغيل المباشر:

```bash
# تشغيل مباشر على المنفذ 3000
PORT=3000 NODE_ENV=production npx tsx server/index.ts

# أو للمنفذ 80 (يتطلب sudo)
sudo PORT=80 NODE_ENV=production npx tsx server/index.ts
```

### 3. حل مشكلة cross-env:

```bash
# تثبيت cross-env إذا كنت تريد استخدام npm run dev
npm install cross-env

# أو استخدم البدائل المباشرة
NODE_ENV=development npx tsx server/index.ts
```

## الوصول للمنصة

### إذا كان الخادم يعمل على المنفذ 3000:
- الموقع الرئيسي: http://74.179.85.9:3000
- لوحة الإدارة: http://74.179.85.9:3000/admin
- واجهات API: http://74.179.85.9:3000/api/admin/users

### للحصول على المنفذ 80:
```bash
# إعداد إعادة التوجيه (مُوصى به)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
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