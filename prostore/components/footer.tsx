import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t  py-4 text-center text-sm text-gray-500">
      &copy; {currentYear} {APP_NAME}. All rights reserved.
    </footer>
  );
}
