export const HOST_API: string | undefined = process.env.NEXT_PUBLIC_API_VERSION
  ? process.env.NEXT_PUBLIC_API_BASE_URL?.concat(
      process.env.NEXT_PUBLIC_API_VERSION,
    )
  : process.env.NEXT_PUBLIC_API_BASE_URL?.concat("/api/v1");
