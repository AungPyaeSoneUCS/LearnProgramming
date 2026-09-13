"use client";

export interface TabItemProps {
  label: string;
  children?: React.ReactNode;
}

export default function TabItem({ children }: TabItemProps) {
  return <div role="tabpanel">{children}</div>;
}