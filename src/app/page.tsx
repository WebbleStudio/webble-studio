import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/locales";

/**
 * The root path "/" redirects to the default locale.
 * This is the only redirect in the project — locale-prefixed URLs
 * are never automatically redirected between each other.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
