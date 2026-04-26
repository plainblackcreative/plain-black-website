# PlainBlack Website + Social Asset Pack

## Brand rule
Never use "Creative" under the PlainBlack logo in client-facing outputs.

## Recommended use
- `website/hero-1600x900`: homepage and large hero sections.
- `website/section-1920x1080`: full-width section backgrounds.
- `website/og-1200x630`: social sharing / Open Graph images.
- `social/instagram-square-1080`: Instagram and square social posts.
- `social/linkedin-1200x627`: LinkedIn post images.
- `reference`: source images and asset library roadmap.

## Usage notes
- Keep text on the darker/emptier side of each image.
- Use a dark gradient overlay for readability.
- Keep copy blunt and human. Avoid agency jargon.
- Let the monogram/logo act like a discovered detail, not the whole message.

## Suggested CSS overlay

.section-bg {
  background:
    linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 42%, rgba(5,5,5,0.22) 75%, transparent 100%),
    url('/assets/website/section-1920x1080/pb-founder-desk-section-1920x1080.webp') right center / cover no-repeat;
}
