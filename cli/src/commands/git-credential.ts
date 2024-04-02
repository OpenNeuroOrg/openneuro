import { Command, TextLineStream } from "../deps.ts"
import { getConfig } from "../config.ts"

const prepareRepoAccess = `
  mutation prepareRepoAccess($datasetId: ID!) {
    prepareRepoAccess(datasetId: $datasetId) {
      token
      endpoint
    }
  }
`

export async function getRepoAccess(datasetId?: string) {
  const config = getConfig()
  const req = await fetch(`${config.url}/crn/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.token}`, // Long lived token
    },
    body: JSON.stringify({
      query: prepareRepoAccess,
      variables: {
        datasetId,
      },
    }),
  })
  const response = await req.json()
  if (response.errors) {
    throw Error(response.errors.map(error => error.message))
  } else {
    return {
      token: response.data.prepareRepoAccess.token, // Short lived repo access token
      endpoint: response.data.prepareRepoAccess.endpoint,
    }
  }
}

/**
 * Provide a git-credential helper for OpenNeuro
 */
export async function gitCredentialAction(
  stdinReadable: ReadableStream<Uint8Array> = Deno.stdin.readable,
  tokenGetter = getRepoAccess,
) {
  let pipeOutput = ""
  const credential: Record<string, string | undefined> = {}
  // Create a stream of lines from stdin
  const lineStream = stdinReadable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
  for await (const line of lineStream) {
    const [key, value] = line.split("=", 2)
    credential[key] = value
  }
  if ("path" in credential && credential.path) {
    const datasetId = credential.path.split("/").pop()
    const { token } = await tokenGetter(datasetId)
    const output: Record<string, string> = {
      username: "@openneuro/cli",
      password: token,
    }
    for (const key in output) {
      pipeOutput += `${key}=${output[key]}\n`
    }
  } else {
    throw new Error(
      "Invalid input from git, check the credential helper is configured correctly",
    )
  }
  return pipeOutput
}

export const gitCredential = new Command()
  .name("git-credential")
  .description(
    "A git credentials helper for easier datalad or git-annex access to datasets.",
  )
  .command("fill")
  .action(async () => {
    console.log(await gitCredentialAction())
  })
