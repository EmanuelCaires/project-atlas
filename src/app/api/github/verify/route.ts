import { NextRequest, NextResponse } from "next/server";
import { verifyGitHubRepository } from "@/features/github-verification/services/github-verification.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const repositoryUrl = request.nextUrl.searchParams.get("url");

  if (!repositoryUrl) {
    return NextResponse.json(
      { error: "Repository URL is required." },
      { status: 400 },
    );
  }

  const result = await verifyGitHubRepository(repositoryUrl);

  return NextResponse.json(result, {
    status: result.verified ? 200 : 422,
  });
}
