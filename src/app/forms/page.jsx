'use client';
import { redirect } from 'next/navigation';
// Index redirects to the dynamic route which handles the grid
export default function FormsIndex() {
  return redirect('/forms/index');
}
