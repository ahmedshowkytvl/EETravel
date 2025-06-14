<?php

return [
    'auth' => [
        'login_success' => 'Login successful',
        'logout_success' => 'Logged out successfully',
        'register_success' => 'User registered successfully',
        'invalid_credentials' => 'Invalid credentials',
        'account_deactivated' => 'Account is deactivated',
        'unauthorized' => 'Unauthorized',
        'insufficient_permissions' => 'Insufficient permissions',
        'profile_updated' => 'Profile updated successfully',
        'password_changed' => 'Password changed successfully',
        'current_password_incorrect' => 'Current password is incorrect',
    ],
    
    'booking' => [
        'created' => 'Booking created successfully',
        'updated' => 'Booking updated successfully',
        'cancelled' => 'Booking cancelled successfully',
        'confirmed' => 'Booking confirmed successfully',
        'cannot_modify' => 'Cannot modify confirmed or cancelled booking',
        'already_cancelled' => 'Booking is already cancelled',
        'creation_failed' => 'Booking creation failed',
    ],
    
    'tour' => [
        'created' => 'Tour created successfully',
        'updated' => 'Tour updated successfully',
        'deleted' => 'Tour deleted successfully',
        'cannot_delete_with_bookings' => 'Cannot delete tour with existing bookings',
    ],
    
    'destination' => [
        'created' => 'Destination created successfully',
        'updated' => 'Destination updated successfully',
        'deleted' => 'Destination deleted successfully',
    ],
    
    'package' => [
        'created' => 'Package created successfully',
        'updated' => 'Package updated successfully',
        'deleted' => 'Package deleted successfully',
    ],
    
    'hotel' => [
        'created' => 'Hotel created successfully',
        'updated' => 'Hotel updated successfully',
        'deleted' => 'Hotel deleted successfully',
    ],
    
    'review' => [
        'created' => 'Review submitted successfully',
        'updated' => 'Review updated successfully',
        'deleted' => 'Review deleted successfully',
    ],
    
    'admin' => [
        'status_updated' => 'Status updated successfully',
        'export_initiated' => 'Export initiated',
        'user_status_updated' => 'User status updated successfully',
        'user_role_updated' => 'User role updated successfully',
    ],
    
    'validation' => [
        'error' => 'Validation error',
        'required' => 'This field is required',
        'email' => 'Please enter a valid email address',
        'min' => 'This field must be at least :min characters',
        'max' => 'This field cannot exceed :max characters',
        'unique' => 'This value is already taken',
    ],
    
    'general' => [
        'success' => 'Operation completed successfully',
        'error' => 'An error occurred',
        'not_found' => 'Resource not found',
        'forbidden' => 'Access forbidden',
        'internal_error' => 'Internal server error',
    ],
];