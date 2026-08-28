import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

const originalFeedbackFormUrl = process.env.FEEDBACK_FORM_URL;
const originalPublicFeedbackFormUrl =
  process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL;

afterEach(() => {
  if (originalFeedbackFormUrl === undefined) {
    delete process.env.FEEDBACK_FORM_URL;
  } else {
    process.env.FEEDBACK_FORM_URL = originalFeedbackFormUrl;
  }

  if (originalPublicFeedbackFormUrl === undefined) {
    delete process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL;
  } else {
    process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL = originalPublicFeedbackFormUrl;
  }
});

describe("feedback runtime configuration", () => {
  it("returns the configured form URL", async () => {
    process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL =
      "https://forms.example.com/feedback";
    delete process.env.FEEDBACK_FORM_URL;

    const response = await GET();

    expect(await response.json()).toEqual({
      feedbackUrl: "https://forms.example.com/feedback",
    });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });

  it("returns no URL when configuration is missing", async () => {
    delete process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL;
    delete process.env.FEEDBACK_FORM_URL;

    const response = await GET();

    expect(await response.json()).toEqual({ feedbackUrl: null });
  });

  it("rejects unsafe URL protocols", async () => {
    process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL = "javascript:alert(1)";
    delete process.env.FEEDBACK_FORM_URL;

    const response = await GET();

    expect(await response.json()).toEqual({ feedbackUrl: null });
  });
});
