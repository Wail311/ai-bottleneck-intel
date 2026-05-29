import { notFound } from "next/navigation";
import { getBottleneck, getAllSlugs } from "@/lib/data";
import BottleneckPage from "@/components/BottleneckPage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = getBottleneck(slug);
  if (!b) return { title: "Not found" };
  return {
    title: `${b.name} — AI Bottleneck Intelligence`,
    description: b.thesis,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const bottleneck = getBottleneck(slug);
  if (!bottleneck) notFound();
  return <BottleneckPage bottleneck={bottleneck} />;
}
