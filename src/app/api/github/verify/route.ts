import { NextRequest, NextResponse } from "next/server";
import { verifyGitHubRepository } from "@/features/github-verification/services/github-verification.service";

export async function GET(request: NextRequest) {
  const repositoryUrl = request.nextUrl.searchParams.get("url");

  if (!repositoryUrl) {
    return NextResponse.json(
      { error: "Repository URL is required." },
      { status: 400 }
    );
  }

  const result = await verifyGitHubRepository(repositoryUrl);

  return NextResponse.json(result, {
    status: result.verified ? 200 : 422,
  });
}