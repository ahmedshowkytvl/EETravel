import React from 'react';
import { PackageCreatorForm as SimpleForm, PackageCreatorFormProps } from './SimplePackageForm';

export type { PackageCreatorFormProps };

export function PackageCreatorForm(props: PackageCreatorFormProps) {
  return <SimpleForm {...props} />;
}