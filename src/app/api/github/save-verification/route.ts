import { NextRequest, NextResponse } from "next/server";
import { verifyGitHubRepository } from "@/features/github-verification/services/github-verification.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const projectId = typeof body?.projectId === "string" ? body.projectId : "";

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 },
      );
    }

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

    const { data: passport, error: passportError } = await supabase
      .from("developer_passports")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (passportError) {
      return NextResponse.json(
        { error: passportError.message },
        { status: 500 },
      );
    }

    if (!passport) {
      return NextResponse.json(
        { error: "Developer passport not found." },
        { status: 404 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("developer_projects")
      .select("id, github_url")
      .eq("id", projectId)
      .eq("passport_id", passport.id)
      .maybeSingle();

    if (projectError) {
      return NextResponse.json(
        { error: projectError.message },
        { status: 500 },
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 },
      );
    }

    if (!project.github_url) {
      return NextResponse.json(
        { error: "Project does not have a GitHub repository URL." },
        { status: 400 },
      );
    }

    const verification = await verifyGitHubRepository(project.github_url);

    if (!verification.verified) {
      return NextResponse.json(
        {
          error: verification.error ?? "Unable to confirm GitHub repository.",
          verification,
        },
        { status: 422 },
      );
    }

    const { error: updateError } = await supabase
      .from("developer_projects")
      .update({
        github_verified: true,
        github_verified_at: new Date().toISOString(),
        github_repository_name: verification.fullName,
        github_language: verification.language,
        github_stars: verification.stars,
        github_forks: verification.forks,
      })
      .eq("id", projectId)
      .eq("passport_id", passport.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      verification,
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
