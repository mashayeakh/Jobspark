import CompanyDetailsClient from "./CompanyDetailsClient";

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CompanyDetailsClient id={resolvedParams.id} />;
}
