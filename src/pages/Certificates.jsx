import React, { useEffect, useState } from "react";

import { EmptyState, LoadingBlock, PageHeader, SafeImage } from "../components/ui";

// Not routed yet — kept for a future Certificates tab in Google Sheets.
// Until that tab exists in src/data/content.js, the page shows its empty state.
// Expected item shape: { id, name, description, comment, image_url }
async function getCertificates() {
  return [];
}

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      const data = await getCertificates();
      setCertificates(data);
      setLoading(false);
    }

    fetchCertificates();
  }, []);

  return (
    <div className="grid gap-8">
      <PageHeader label="Learning" title="Certificates" intro="Courses, trainings, and certifications I completed." />

      {loading ? (
        <LoadingBlock />
      ) : certificates.length === 0 ? (
        <EmptyState title="No certificates yet" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {certificates.map((cert) => (
            <article key={cert.id} className="rounded-md border border-line bg-surface p-5">
              <SafeImage src={cert.image_url} alt={cert.name} className="mb-5 aspect-[16/10] w-full rounded object-cover" />

              <h2 className="text-heading font-normal text-ink">{cert.name}</h2>

              {cert.description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{cert.description}</p>}

              {cert.comment && (
                <div className="mt-4 border-s border-wine ps-4">
                  <p className="label text-wine-text">My comment</p>
                  <p className="mt-1 text-sm text-ink-soft">{cert.comment}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
