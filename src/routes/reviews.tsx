import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Al-Prince" }, { name: "description", content: "What our clients say." }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { tr, lang } = useI18n();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="px-[8%] py-20">
      <div className="text-center mb-12">
        <span style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 600, color: "var(--gold-dark)", letterSpacing: 3, textTransform: "uppercase" }}>{tr("reviews.label")}</span>
        <h2 className="mt-3 font-black" style={{ fontFamily: "Cairo", fontSize: "clamp(26px,3.2vw,42px)" }}>
          <span className="gold-gradient-text">{tr("reviews.heading")}</span>
        </h2>
      </div>

      {isLoading && (
        <p className="text-center" style={{ color: "var(--text-muted)" }}>{tr("common.loading")}</p>
      )}

      {!isLoading && (!reviews || reviews.length === 0) && (
        <div className="text-center card-surface p-10 max-w-lg mx-auto">
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{tr("reviews.empty")}</p>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.map((r) => {
            const text = lang === "ar" ? r.review_text_ar : r.review_text_en;
            const initial = r.customer_name?.charAt(0) ?? "?";
            return (
              <article key={r.id} className="card-surface p-7">
                <div className="flex gap-1 mb-3" style={{ color: "var(--gold)" }}>
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={14} fill={k < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="italic mb-5" style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.8 }}>"{text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "linear-gradient(135deg,var(--gold-light),var(--gold))", color: "#fff" }}>{initial}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{r.customer_name}</div>
                    {r.car_info && (
                      <div style={{ fontFamily: "Poppins", fontSize: 11, color: "var(--text-muted)" }}>{r.car_info}</div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
