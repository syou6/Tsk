import Replicate from "replicate";
import type { AIResponse } from "../ai";

type ReplicateRequest = {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

const apiToken = process.env.REPLICATE_API_TOKEN;

if (!apiToken) {
  console.warn("REPLICATE_API_TOKEN is not set. Replicate provider will throw when used.");
}

const client = apiToken ? new Replicate({ auth: apiToken }) : null;

export async function callReplicate({
  prompt,
  temperature = 0.7,
  maxTokens,
  systemPrompt,
}: ReplicateRequest): Promise<AIResponse> {
  if (!client) {
    throw new Error("Replicate provider is not configured. Set REPLICATE_API_TOKEN in your environment.");
  }

  const model = process.env.REPLICATE_MODEL ?? "meta/meta-llama-3-8b-instruct";

  const input: Record<string, unknown> = {
    prompt,
    temperature,
  };

  if (maxTokens) {
    input.max_tokens = maxTokens;
  }

  if (systemPrompt) {
    input.system_prompt = systemPrompt;
  }

  const response = (await client.run(model as `${string}/${string}`, { input })) as unknown;

  let content = "";

  if (Array.isArray(response)) {
    content = response
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join("");
  } else if (typeof response === "string") {
    content = response;
  } else {
    content = JSON.stringify(response);
  }

  return {
    content,
    raw: response,
  };
}
