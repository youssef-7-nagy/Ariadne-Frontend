"use client"

import { FilmstripGallery, type FilmstripImage } from "@/components/ui/filmstrip-gallery"

// Photographs from Unsplash under the Unsplash License, hosted on 21st storage; swap in your own.
// Captions read like a contact sheet: place, moment, the note pencilled on the sleeve.
const IMAGES: FilmstripImage[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/ca/ca905300194e1d0ffc3223cfd3ba226477f36706c5461ffcd97c6f9e15344b8e.jpg",
    alt: "Snow peaks above a sea of cloud at sunrise",
    caption: "Chamonix, 06:40 — the ridge before the wind",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/39/396e97451e55c77f7cfd6ecc90ba207f12a606c5dfc6aa59fcdb52725bc2c75d.jpg",
    alt: "Rock pinnacles above hazy hills, one person on the ridge",
    caption: "Meteora — one person, one hour of light",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/bc/bcc9ead37d38fc20a9464b6500c51c7a0fb9d67e5e64e319562b29e0e7ddd934.jpg",
    alt: "Green cliffs under low cloud with the sun breaking through",
    caption: "Skye, October — the cloud lifting off the ridge",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/61/61594ee61e92b6be0b47dad10261528fc8260d3d515846218ee0a47902f57d27.jpg",
    alt: "Sunlight through a forest path",
    caption: "Black Forest — the road that keeps the light",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/41/41f5cd800f8ffac39cb893c6732da838cbc40ce82b1ea10fb71e3cbd1f5a3db8.jpg",
    alt: "Empty road through a red rock canyon",
    caption: "Valley of Fire — nobody for an hour",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/f1/f1a63126631e6eb1ad541955e2982c6081e0c6f656bcfe4e1f67f4d4b9e39527.jpg",
    alt: "Stone spiral in a green valley at sunset",
    caption: "Connemara — the spiral someone left",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/c9/c9fd1f11cae294fd6f9b7667aef20d7a6e07181027a3b4a926314602829f79d7.jpg",
    alt: "Footbridge into a dense forest",
    caption: "Olympic — the quiet under the canopy",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/25/25a4122f8c369ba08750496a875030fc2518565d411c7a19a3595fcf908eb3e7.jpg",
    alt: "Tall waterfall with a stone footbridge",
    caption: "Multnomah — twenty seconds at f/16",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/e4/e45c1ddf5f7ab48524d48682ba018968b1e4c1a2a21f75efea616d8c3b9578c9.jpg",
    alt: "Blue sea swell, close to the water",
    caption: "Bells Beach — the last set",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/c3/c35cbb884658b00b49bb3d737d9003db5d4c37166d1423ad83c440cef51a5bfc.jpg",
    alt: "Mountain lake with peaks lit at sunrise",
    caption: "Moraine Lake — the lake that held still",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/0d/0d73be6b770882432d3ecac3792acf251424fcf65820e139e6cfc6fbd2fc6d7b.jpg",
    alt: "Empty beach at sunset",
    caption: "Sardinia — nobody for a mile",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/45/45beb787c6ee01ea29fa72fc57bf48e2a6d9b652ab8c4d4464b35d3a04a57b72.jpg",
    alt: "Yellow poppies against a blue sky",
    caption: "Provence — the last roll of the trip",
  },
]

const settings = {
  negative: true,
  mask: 0.6,
  lit: 0,
  frameWidth: 300,
  aspect: "3 / 2",
  film: "35MM · ISO 400 · 36 EXP",
  stripColor: "#2f2a25",
  inkColor: "#e8d9a6",
  startIndex: 4,
  eyebrow: "Portfolio",
  headline: "Twelve frames. One roll.",
  subline: "Scroll the strip and the frame in the gate develops. Click it to see the print.",
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props }

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
      <div style={{ display: "flex", width: "100%", maxWidth: "1024px", flexDirection: "column", alignItems: "center", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ marginBottom: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.15)", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 500 }}>
          <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "var(--accent-color, #1392d6)" }} />
          {s.eyebrow}
        </p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 600, letterSpacing: "-0.025em" }}>
          {s.headline}
        </h1>
        <p style={{ marginTop: "1rem", maxWidth: "32rem", fontSize: "1rem", opacity: 0.75 }}>{s.subline}</p>
      </div>

      <div style={{ marginTop: "2.5rem", width: "100%", maxWidth: "1024px", padding: "0 1.5rem" }}>
        <FilmstripGallery
          key={`${s.startIndex}-${s.frameWidth}-${s.aspect}`}
          images={IMAGES}
          defaultIndex={s.startIndex}
          negative={s.negative}
          mask={s.mask}
          lit={s.lit}
          frameWidth={s.frameWidth}
          aspect={s.aspect}
          film={s.film}
          stripColor={s.stripColor}
          inkColor={s.inkColor}
        />
      </div>
    </div>
  )
}
