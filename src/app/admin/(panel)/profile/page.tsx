import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Field, FileField, Panel } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";
import { profile as fallback } from "@/lib/content";
import { toSiteHref } from "@/lib/supabase/config";
import { saveProfile } from "../../actions";

export default async function ProfileAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  const p = data ?? fallback;

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-[40px] leading-tight font-medium">Profile</h1>
      <ActionForm action={saveProfile} className="grid gap-5" resetOnSuccess shrinkFiles>
        <Panel title="Hero">
          <div className="grid gap-4">
            <Field label="Display name" name="display_name" defaultValue={p.display_name} required maxLength={60} />
            <Field label="Eyebrow" name="hero_eyebrow" defaultValue={p.hero_eyebrow} hint="Small line above your name." />
            <Field label="Intro" name="hero_intro" defaultValue={p.hero_intro} multiline />
            <Field
              label="Tagline"
              name="tagline"
              defaultValue={p.tagline}
              hint="Each sentence becomes a line, e.g. “Beauty. Intelligence. Impact.” Also used as the site description."
            />
            <Field label="City" name="city" defaultValue={p.city} />
          </div>
        </Panel>

        <Panel title="About">
          <div className="grid gap-4">
            <Field label="Bio" name="bio" defaultValue={p.bio} multiline rows={5} />
            <Field label="Beyond the frame" name="beyond_frame" defaultValue={p.beyond_frame} multiline />
          </div>
        </Panel>

        <Panel title="Philosophy">
          <div className="grid gap-4">
            <Field
              label="Headline"
              name="philosophy_headline"
              defaultValue={p.philosophy_headline}
              hint="The word “Bolder” is shown in gold italic."
            />
            <Field label="Sub line" name="philosophy_sub" defaultValue={p.philosophy_sub} />
            <Field label="Quote" name="philosophy_quote" defaultValue={p.philosophy_quote} multiline />
          </div>
        </Panel>

        <Panel title="Contact & links">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Email" name="email" type="email" defaultValue={p.email} />
            <Field label="Instagram URL" name="instagram_url" type="url" defaultValue={p.instagram_url} />
            <Field label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={p.linkedin_url} />
            <Field
              label="Showreel video URL"
              name="showreel_url"
              type="url"
              defaultValue={p.showreel_url}
              hint="YouTube, Vimeo or a direct .mp4 link."
            />
            <Field label="Story video URL" name="story_video_url" type="url" defaultValue={p.story_video_url} />
          </div>
        </Panel>

        <Panel title="Photos & media kit" description="JPG, PNG, WebP or AVIF up to 10 MB. Media kit must be a PDF.">
          <div className="grid gap-4 md:grid-cols-2">
            <FileField label="Hero portrait" name="hero_image_url" current={p.hero_image_url} placeholderNote="Using the placeholder photo" />
            <FileField label="About photo" name="about_image_url" current={p.about_image_url} placeholderNote="Using the placeholder photo" />
            <FileField
              label="Philosophy (golden hour) photo"
              name="philosophy_image_url"
              current={p.philosophy_image_url}
              placeholderNote="Using the placeholder photo"
            />
            <FileField
              label="Media kit (PDF)"
              name="media_kit_url"
              accept="application/pdf"
              current={p.media_kit_url ? toSiteHref(p.media_kit_url) : null}
              placeholderNote="No media kit yet: the button is shown disabled"
            />
          </div>
        </Panel>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <SubmitButton className="shadow-[0_14px_34px_rgb(0_0_0/0.5)]">Save profile</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
