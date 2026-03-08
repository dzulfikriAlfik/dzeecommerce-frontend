export interface SelectOption {
  label: string;
  value: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}
