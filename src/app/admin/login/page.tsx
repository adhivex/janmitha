import type { Metadata } from "next";
import { Suspense } from "react";
import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Field } from "@/components/admin/fields";
import { signIn } from "../actions";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

async function NotAdminNotice({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { error } = await searchParams;
  if (error !== "not-admin") return null;
  return (
    <p role="alert" className="mt-4 rounded-[14px] border border-[#F2B8A2]/40 px-4 py-3 text-[14px] text-[#F2B8A2]">
      That account is not on the admin list.
    </p>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] rounded-[32px] border border-gold-line-strong bg-ink-raised p-6 md:p-9">
        <p className="eyebrow">ADMIN</p>
        <h1 className="gold-shimmer mt-3 font-script text-[52px] leading-[1.15]">Welcome back</h1>
        <Suspense>
          <NotAdminNotice searchParams={searchParams} />
        </Suspense>
        <ActionForm action={signIn} className="mt-6 grid gap-5">
          <Field label="Email" name="email" type="email" required autoComplete="username" />
          <Field label="Password" name="password" type="password" required autoComplete="current-password" />
          <SubmitButton className="justify-center">Sign in</SubmitButton>
        </ActionForm>
      </div>
    </main>
  );
}
