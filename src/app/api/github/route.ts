import { ENV } from "@/config/env";
import AppError, { BadRequestError, GithubError, InternalServerError } from "@/pkg/error/Error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || !username.trim()) {
      throw new BadRequestError("Username is required");
    }

    const query = `
      {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new GithubError(data.errors[0].message, 400, data.errors);
    }

    return NextResponse.json({
      success: true,
      contributions: data.data.user.contributionsCollection.contributionCalendar.totalContributions
    });

  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toJSON(), { status: err.statusCode });
    }

    const internalErr = new InternalServerError("Unexpected error", err);
    return NextResponse.json(internalErr.toJSON(), { status: 500 });
  }
}
