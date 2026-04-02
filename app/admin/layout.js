import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Hotel Admin Portal'
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      redirect("/"); // not strictly authorized, go home
    }
  } catch (error) {
    // Token valid but might be expired or malformed
    redirect("/login");
  }

  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  );
}
