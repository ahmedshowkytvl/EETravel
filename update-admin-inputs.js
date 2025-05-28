#!/usr/bin/env node

/**
 * Script to add IDs and class names to all admin panel inputs
 * This will help with testing and styling consistency
 */

const fs = require('fs');
const path = require('path');

// Define input patterns and their replacements
const inputUpdates = [
  {
    pattern: /<Input\s+([^>]*?)(\{\.\.\.field\})\s*\/>/g,
    replacement: (match, props, field) => {
      const hasId = props.includes('id=');
      const hasClassName = props.includes('className=');
      
      let newProps = props;
      if (!hasId) {
        newProps += ' id="admin-input" ';
      }
      if (!hasClassName) {
        newProps += ' className="admin-input" ';
      }
      
      return `<Input ${newProps.trim()} ${field} />`;
    }
  },
  {
    pattern: /<Textarea\s+([^>]*?)(\{\.\.\.field\})\s*\/>/g,
    replacement: (match, props, field) => {
      const hasId = props.includes('id=');
      const hasClassName = props.includes('className=');
      
      let newProps = props;
      if (!hasId) {
        newProps += ' id="admin-textarea" ';
      }
      if (!hasClassName) {
        newProps += ' className="admin-textarea" ';
      }
      
      return `<Textarea ${newProps.trim()} ${field} />`;
    }
  }
];

// Get all admin page files
const adminDir = path.join(__dirname, 'client/src/pages/admin');
console.log('🔧 Adding IDs and class names to admin panel inputs...');
console.log('📁 Scanning admin directory:', adminDir);

// This script template shows the approach
// For now, let's manually update the key admin forms
console.log('✅ Script ready - proceeding with manual updates for better control');