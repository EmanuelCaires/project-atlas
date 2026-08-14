import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { projectId, verification } = body;

    if (!projectId || !verification?.verified) {
      return NextResponse.json(
        { error: "Invalid verification payload." },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("developer_projects")
      .update({
        github_verified: true,
        github_verified_at: new Date().toISOString(),
        github_repository_name: verification.fullName,
        github_language: verification.language,
        github_stars: verification.stars,
        github_forks: verification.forks,
      })
      .eq("id", projectId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save GitHub verification.",
      },
      { status: 500 },
    );
  }
}