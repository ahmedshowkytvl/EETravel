<?php

return [
    'auth' => [
        'login_success' => 'تم تسجيل الدخول بنجاح',
        'logout_success' => 'تم تسجيل الخروج بنجاح',
        'register_success' => 'تم تسجيل المستخدم بنجاح',
        'invalid_credentials' => 'بيانات الاعتماد غير صحيحة',
        'account_deactivated' => 'الحساب غير مفعل',
        'unauthorized' => 'غير مخول',
        'insufficient_permissions' => 'صلاحيات غير كافية',
        'profile_updated' => 'تم تحديث الملف الشخصي بنجاح',
        'password_changed' => 'تم تغيير كلمة المرور بنجاح',
        'current_password_incorrect' => 'كلمة المرور الحالية غير صحيحة',
    ],
    
    'booking' => [
        'created' => 'تم إنشاء الحجز بنجاح',
        'updated' => 'تم تحديث الحجز بنجاح',
        'cancelled' => 'تم إلغاء الحجز بنجاح',
        'confirmed' => 'تم تأكيد الحجز بنجاح',
        'cannot_modify' => 'لا يمكن تعديل الحجز المؤكد أو الملغي',
        'already_cancelled' => 'الحجز ملغي بالفعل',
        'creation_failed' => 'فشل في إنشاء الحجز',
    ],
    
    'tour' => [
        'created' => 'تم إنشاء الجولة بنجاح',
        'updated' => 'تم تحديث الجولة بنجاح',
        'deleted' => 'تم حذف الجولة بنجاح',
        'cannot_delete_with_bookings' => 'لا يمكن حذف الجولة التي تحتوي على حجوزات',
    ],
    
    'destination' => [
        'created' => 'تم إنشاء الوجهة بنجاح',
        'updated' => 'تم تحديث الوجهة بنجاح',
        'deleted' => 'تم حذف الوجهة بنجاح',
    ],
    
    'package' => [
        'created' => 'تم إنشاء الباقة بنجاح',
        'updated' => 'تم تحديث الباقة بنجاح',
        'deleted' => 'تم حذف الباقة بنجاح',
    ],
    
    'hotel' => [
        'created' => 'تم إنشاء الفندق بنجاح',
        'updated' => 'تم تحديث الفندق بنجاح',
        'deleted' => 'تم حذف الفندق بنجاح',
    ],
    
    'review' => [
        'created' => 'تم إرسال التقييم بنجاح',
        'updated' => 'تم تحديث التقييم بنجاح',
        'deleted' => 'تم حذف التقييم بنجاح',
    ],
    
    'admin' => [
        'status_updated' => 'تم تحديث الحالة بنجاح',
        'export_initiated' => 'تم بدء التصدير',
        'user_status_updated' => 'تم تحديث حالة المستخدم بنجاح',
        'user_role_updated' => 'تم تحديث دور المستخدم بنجاح',
    ],
    
    'validation' => [
        'error' => 'خطأ في التحقق',
        'required' => 'هذا الحقل مطلوب',
        'email' => 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        'min' => 'يجب أن يكون هذا الحقل :min أحرف على الأقل',
        'max' => 'لا يمكن أن يتجاوز هذا الحقل :max حرف',
        'unique' => 'هذه القيمة مستخدمة بالفعل',
    ],
    
    'general' => [
        'success' => 'تمت العملية بنجاح',
        'error' => 'حدث خطأ',
        'not_found' => 'المورد غير موجود',
        'forbidden' => 'الوصول محظور',
        'internal_error' => 'خطأ داخلي في الخادم',
    ],
];