export function getModels() {
  return [
    { name: "GPT-3.5", value: "openai:gpt-3.5-turbo" },
    { name: "GPT-4", value: "openai:gpt-4" },
    { name: "GPT-4 Turbo", value: "openai:gpt-4-turbo" },
    { name: "Claude-3 Haiku", value: "anthropic:claude-3-haiku-20240307" },
    {
      name: "Claude-3 Sonnet",
      value: "anthropic:claude-3-sonnet-20240229",
    },
    { name: "Claude-3 Opus", value: "claude-3-opus-20240229" },
  ];
}
